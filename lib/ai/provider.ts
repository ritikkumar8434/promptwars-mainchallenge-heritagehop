import type { AIProvider, TravelPlanInput, TravelPlanOutput, GroundingBundle } from '@/types/travel';
import { geminiProvider, ProviderUnavailableError } from './gemini';
import { openrouterProvider } from './openrouter';
import { groqProvider } from './groq';
import { mockProvider } from './mock';

const PROVIDER_CHAIN: AIProvider[] = [geminiProvider, openrouterProvider, groqProvider, mockProvider];

export interface PlanGenerationResult {
  plan: TravelPlanOutput;
  attemptedProviders: { name: string; failed: boolean; reason?: string }[];
}

// Orchestrates the Gemini → OpenRouter → Groq → Mock fallback chain.
// The mock provider never throws, so this function always resolves —
// callers never need to handle a "no plan available" case.
export async function generateTravelPlanWithFallback(
  input: TravelPlanInput,
  grounding: GroundingBundle
): Promise<PlanGenerationResult> {
  const attemptedProviders: PlanGenerationResult['attemptedProviders'] = [];

  for (const provider of PROVIDER_CHAIN) {
    try {
      const plan = await provider.generateTravelPlan(input, grounding);
      attemptedProviders.push({ name: provider.name, failed: false });
      return { plan, attemptedProviders };
    } catch (err) {
      const reason = err instanceof ProviderUnavailableError ? err.message : 'unexpected error';
      // Developer-facing log only — never surfaced to the client response.
      console.error(`[HeritageHop AI] provider "${provider.name}" failed: ${reason}`);
      attemptedProviders.push({ name: provider.name, failed: true, reason });
    }
  }

  // Unreachable in practice — mockProvider does not throw — but keeps the
  // function's return type honest without a non-null assertion.
  throw new Error('All AI providers, including mock fallback, failed unexpectedly');
}
