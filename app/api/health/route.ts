import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';

// Never leaks whether a key is valid — only whether it's configured — so
// this endpoint is safe to expose without authentication.
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    providers: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
      groq: Boolean(process.env.GROQ_API_KEY),
      mock: true,
    },
    supabaseConfigured: isSupabaseConfigured(),
    ticketmasterConfigured: Boolean(process.env.TICKETMASTER_API_KEY),
    timestamp: new Date().toISOString(),
  });
}
