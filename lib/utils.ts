export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

export function confidenceLabel(confidence: number): 'High' | 'Medium' | 'Low' {
  if (confidence >= 0.8) return 'High';
  if (confidence >= 0.55) return 'Medium';
  return 'Low';
}

// Simple in-memory cache for seed/grounding lookups within a single
// serverless invocation lifetime — avoids redundant work on repeat reads.
const cache = new Map<string, { value: unknown; expiresAt: number }>();

export function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function setCached<T>(key: string, value: T, ttlMs = 5 * 60_000): void {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}
