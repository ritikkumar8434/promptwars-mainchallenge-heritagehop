import { NextRequest, NextResponse } from 'next/server';
import { TravelPlanInputSchema } from '@/lib/validation/schemas';
import { guardTravelPlanFields } from '@/lib/security/prompt-guard';
import { checkRateLimit, getClientKey } from '@/lib/security/rate-limit';
import { buildGroundingBundle } from '@/lib/ai/grounding';
import { generateTravelPlanWithFallback } from '@/lib/ai/provider';
import type { TravelPlanOutput } from '@/types/travel';

export const runtime = 'nodejs';
// The full Gemini(30s)→OpenRouter(18s)→Groq(8s) fallback chain can take up
// to ~62s in the worst case (all providers failing/timing out) plus
// grounding fetches — default Vercel function timeouts (10s) would kill
// this mid-request, so it's extended explicitly with headroom.
export const maxDuration = 90;

// SECURITY-SENSITIVE: This is the ONLY server boundary that talks to AI
// providers. The frontend must never call Gemini/OpenRouter/Groq directly —
// all provider API keys live only in this process's environment.
export async function POST(req: NextRequest) {
  const clientKey = getClientKey(req.headers);
  const rate = checkRateLimit(`plan:${clientKey}`, { max: 10, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment before generating another plan.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) } }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body — expected JSON.' }, { status: 400 });
  }

  const parsed = TravelPlanInputSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Please complete all required trip details before generating a plan.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const input = parsed.data;

  const guard = guardTravelPlanFields({ city: input.city, refinementRequest: input.refinementRequest });
  if (!guard.safe) {
    return NextResponse.json(
      {
        error:
          'This request could not be processed as a cultural travel plan. Please describe a destination and travel preferences only.',
      },
      { status: 400 }
    );
  }

  try {
    const grounding = await buildGroundingBundle(input.city);
    const { plan, attemptedProviders } = await generateTravelPlanWithFallback(input, grounding);

    const usedFallback = plan.providerUsed === 'mock';
    const responsePlan: TravelPlanOutput = plan;

    return NextResponse.json({
      plan: responsePlan,
      meta: {
        usedFallback,
        message: usedFallback
          ? 'Live AI is temporarily unavailable, so HeritageHop is showing a curated demo plan.'
          : `Generated live using ${plan.providerUsed}.`,
        providerAttempts: attemptedProviders,
      },
    });
  } catch (err) {
    // Developer-facing log only — no stack trace ever reaches the client.
    console.error('[HeritageHop] /api/plan unexpected failure:', err);
    return NextResponse.json(
      { error: 'Something went wrong while generating your travel plan. Please try again.' },
      { status: 500 }
    );
  }
}
