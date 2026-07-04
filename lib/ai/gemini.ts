import type { AIProvider, TravelPlanInput, TravelPlanOutput, GroundingBundle } from '@/types/travel';
import { SYSTEM_PROMPT, buildTravelPlanPrompt } from './prompts';
import { TravelPlanOutputSchema } from '@/lib/validation/schemas';
import { normalizeTravelPlanOutput } from './normalize';

// gemini-1.5-flash has been retired from the v1beta API — gemini-2.5-flash
// is the current stable fast/cheap model as of writing. Re-check available
// models periodically via GET /v1beta/models if this starts 404ing again.
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
// This schema is large enough that generation genuinely takes ~24-28s even
// with thinking disabled — measured directly against the live API. Kept
// under 30s so the full Gemini→OpenRouter→Groq chain fits inside a 60s
// Vercel function budget (see maxDuration in app/api/plan/route.ts).
const REQUEST_TIMEOUT_MS = 30_000;

// Thrown for conditions the orchestrator should treat as "try the next
// provider" rather than surfacing directly to the user.
export class ProviderUnavailableError extends Error {}

export const geminiProvider: AIProvider = {
  name: 'gemini',
  async generateTravelPlan(input: TravelPlanInput, grounding: GroundingBundle): Promise<TravelPlanOutput> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new ProviderUnavailableError('GEMINI_API_KEY not configured');

    const prompt = buildTravelPlanPrompt(input, grounding);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
            // gemini-2.5-flash spends part of maxOutputTokens on internal
            // "thinking" by default, which can starve the actual JSON
            // output — disable it since we want fast, deterministic structured output.
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      });

      if (res.status === 401 || res.status === 403) {
        throw new ProviderUnavailableError('Gemini API key invalid or unauthorized');
      }
      if (res.status === 429) {
        throw new ProviderUnavailableError('Gemini quota exceeded');
      }
      if (!res.ok) {
        throw new ProviderUnavailableError(`Gemini request failed with status ${res.status}`);
      }

      const data = await res.json();
      const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new ProviderUnavailableError('Gemini returned an empty response');

      const parsedJson = safeJsonParse(text);
      if (!parsedJson) throw new ProviderUnavailableError('Gemini returned invalid JSON');

      const validated = TravelPlanOutputSchema.safeParse(normalizeTravelPlanOutput(parsedJson));
      if (!validated.success) {
        throw new ProviderUnavailableError(`Gemini output failed schema validation: ${validated.error.message}`);
      }

      return { ...validated.data, fallbackUsed: false, providerUsed: 'gemini' };
    } catch (err) {
      if (err instanceof ProviderUnavailableError) throw err;
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ProviderUnavailableError('Gemini request timed out');
      }
      throw new ProviderUnavailableError(`Gemini request error: ${err instanceof Error ? err.message : 'unknown'}`);
    } finally {
      clearTimeout(timeout);
    }
  },
};

function safeJsonParse(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    // Model sometimes wraps JSON in markdown fences despite instructions — try stripping them.
    const stripped = text.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
    try {
      return JSON.parse(stripped);
    } catch {
      return null;
    }
  }
}
