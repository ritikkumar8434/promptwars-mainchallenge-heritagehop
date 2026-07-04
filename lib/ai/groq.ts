import type { AIProvider, TravelPlanInput, TravelPlanOutput, GroundingBundle } from '@/types/travel';
import { SYSTEM_PROMPT, buildTravelPlanPrompt } from './prompts';
import { TravelPlanOutputSchema } from '@/lib/validation/schemas';
import { ProviderUnavailableError } from './gemini';
import { normalizeTravelPlanOutput } from './normalize';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';
// Groq's inference is famously fast (typically well under 2s) — kept tight
// so the full provider chain fits inside a 60s Vercel function budget.
const REQUEST_TIMEOUT_MS = 8_000;

export const groqProvider: AIProvider = {
  name: 'groq',
  async generateTravelPlan(input: TravelPlanInput, grounding: GroundingBundle): Promise<TravelPlanOutput> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new ProviderUnavailableError('GROQ_API_KEY not configured');

    const prompt = buildTravelPlanPrompt(input, grounding);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0.6,
          max_tokens: 4096,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (res.status === 401 || res.status === 403) throw new ProviderUnavailableError('Groq API key invalid');
      if (res.status === 429) throw new ProviderUnavailableError('Groq quota exceeded');
      if (!res.ok) throw new ProviderUnavailableError(`Groq request failed with status ${res.status}`);

      const data = await res.json();
      const text: string | undefined = data?.choices?.[0]?.message?.content;
      if (!text) throw new ProviderUnavailableError('Groq returned an empty response');

      const parsedJson = safeJsonParse(text);
      if (!parsedJson) throw new ProviderUnavailableError('Groq returned invalid JSON');

      const validated = TravelPlanOutputSchema.safeParse(normalizeTravelPlanOutput(parsedJson));
      if (!validated.success) {
        throw new ProviderUnavailableError(`Groq output failed schema validation: ${validated.error.message}`);
      }

      return { ...validated.data, fallbackUsed: false, providerUsed: 'groq' };
    } catch (err) {
      if (err instanceof ProviderUnavailableError) throw err;
      if (err instanceof Error && err.name === 'AbortError') throw new ProviderUnavailableError('Groq request timed out');
      throw new ProviderUnavailableError(`Groq request error: ${err instanceof Error ? err.message : 'unknown'}`);
    } finally {
      clearTimeout(timeout);
    }
  },
};

function safeJsonParse(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    const stripped = text.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
    try {
      return JSON.parse(stripped);
    } catch {
      return null;
    }
  }
}
