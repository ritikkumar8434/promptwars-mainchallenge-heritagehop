import type { AIProvider, TravelPlanInput, TravelPlanOutput, GroundingBundle } from '@/types/travel';
import { SYSTEM_PROMPT, buildTravelPlanPrompt } from './prompts';
import { TravelPlanOutputSchema } from '@/lib/validation/schemas';
import { ProviderUnavailableError } from './gemini';
import { normalizeTravelPlanOutput } from './normalize';

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
// meta-llama/llama-3.1-8b-instruct:free was retired from OpenRouter's free
// tier (returns 404) and the current ":free" models tested were either
// rate-limited under shared load or spent their token budget on hidden
// "reasoning" output before the actual JSON. deepseek-chat-v3-0324 is a
// non-reasoning paid-but-near-zero-cost model (~$0.002/request at this
// schema's size) that reliably returns clean, schema-conformant JSON in ~3s.
const OPENROUTER_MODEL = 'deepseek/deepseek-chat-v3-0324';
// Measured ~1-3s in isolation, but shared-infra latency varies — 10s
// clipped a real request under load, so this has headroom built in.
const REQUEST_TIMEOUT_MS = 18_000;

export const openrouterProvider: AIProvider = {
  name: 'openrouter',
  async generateTravelPlan(input: TravelPlanInput, grounding: GroundingBundle): Promise<TravelPlanOutput> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new ProviderUnavailableError('OPENROUTER_API_KEY not configured');

    const prompt = buildTravelPlanPrompt(input, grounding);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(OPENROUTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          temperature: 0.6,
          max_tokens: 4096,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (res.status === 401 || res.status === 403) throw new ProviderUnavailableError('OpenRouter API key invalid');
      if (res.status === 429) throw new ProviderUnavailableError('OpenRouter quota exceeded');
      if (!res.ok) throw new ProviderUnavailableError(`OpenRouter request failed with status ${res.status}`);

      const data = await res.json();
      const text: string | undefined = data?.choices?.[0]?.message?.content;
      if (!text) throw new ProviderUnavailableError('OpenRouter returned an empty response');

      const parsedJson = safeJsonParse(text);
      if (!parsedJson) throw new ProviderUnavailableError('OpenRouter returned invalid JSON');

      const validated = TravelPlanOutputSchema.safeParse(normalizeTravelPlanOutput(parsedJson));
      if (!validated.success) {
        throw new ProviderUnavailableError(`OpenRouter output failed schema validation: ${validated.error.message}`);
      }

      return { ...validated.data, fallbackUsed: false, providerUsed: 'openrouter' };
    } catch (err) {
      if (err instanceof ProviderUnavailableError) throw err;
      if (err instanceof Error && err.name === 'AbortError') throw new ProviderUnavailableError('OpenRouter request timed out');
      throw new ProviderUnavailableError(`OpenRouter request error: ${err instanceof Error ? err.message : 'unknown'}`);
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
