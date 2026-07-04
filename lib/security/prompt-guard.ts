// SECURITY-SENSITIVE: Defense-in-depth against prompt injection and unsafe
// requests before user text ever reaches an AI provider. This is a
// heuristic filter, not a guarantee — the AI prompts themselves (see
// lib/ai/prompts.ts) also carry explicit instructions to ignore embedded
// commands and refuse unsafe topics. Treat this as the first of two layers.

const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
  /reveal\s+(the\s+)?(api\s*key|system\s*prompt|secret)/i,
  /show\s+(me\s+)?(the\s+)?(system\s*prompt|api\s*key)/i,
  /you\s+are\s+now\s+/i,
  /act\s+as\s+(if\s+you\s+are\s+)?(a\s+)?(different|new)\s+(ai|model|assistant)/i,
  /forget\s+(everything|all\s+prior)/i,
  /jailbreak/i,
  /developer\s+mode/i,
  /\bsystem\s*:\s*/i,
  /<\|.*?\|>/,
];

const UNSAFE_TOPIC_PATTERNS: RegExp[] = [
  /\b(bomb|explosive|weapon\s+making|how\s+to\s+kill)\b/i,
  /\b(illegal\s+drugs?|drug\s+trafficking)\b/i,
  /\b(smuggl(e|ing)|human\s+trafficking)\b/i,
  /\b(bribe|bribery)\s+(official|police|customs)/i,
  /\btrespass(ing)?\s+(into|on)\s+(restricted|private|sacred)/i,
  /\bexploit(ing)?\s+(local|poor|vulnerable)\s+(people|communities)/i,
];

export interface PromptGuardResult {
  safe: boolean;
  reason?: string;
  sanitizedText: string;
}

// Strips characters that have no legitimate purpose in travel-preference
// free text but are common injection/control vectors.
export function sanitizeUserText(input: string): string {
  let out = '';
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    const isControl = code <= 8 || (code >= 11 && code <= 31) || code === 127;
    if (!isControl) out += input[i];
  }
  return out.replace(/```/g, "'").trim().slice(0, 2000);
}

export function guardUserText(rawInput: string): PromptGuardResult {
  const sanitizedText = sanitizeUserText(rawInput);

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(sanitizedText)) {
      return { safe: false, reason: 'prompt_injection_detected', sanitizedText };
    }
  }

  for (const pattern of UNSAFE_TOPIC_PATTERNS) {
    if (pattern.test(sanitizedText)) {
      return { safe: false, reason: 'unsafe_topic_detected', sanitizedText };
    }
  }

  return { safe: true, sanitizedText };
}

// Applies the guard across every free-text field of a travel plan request
// (city name, refinement request) so no single field can smuggle instructions.
export function guardTravelPlanFields(fields: Record<string, string | undefined>): PromptGuardResult {
  for (const [, value] of Object.entries(fields)) {
    if (!value) continue;
    const result = guardUserText(value);
    if (!result.safe) return result;
  }
  return { safe: true, sanitizedText: '' };
}
