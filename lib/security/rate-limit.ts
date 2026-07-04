// SECURITY-SENSITIVE: In-memory sliding-window rate limiter for API routes.
// This is process-local (fine for a single hackathon deployment / serverless
// instance reuse). For multi-instance production use, swap for a shared
// store (Redis, Upstash) behind the same `check()` interface.

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;

// Periodically prevent unbounded memory growth from unique IPs.
const MAX_TRACKED_KEYS = 5000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function checkRateLimit(key: string, opts?: { max?: number; windowMs?: number }): RateLimitResult {
  const max = opts?.max ?? MAX_REQUESTS_PER_WINDOW;
  const windowMs = opts?.windowMs ?? WINDOW_MS;
  const now = Date.now();

  if (buckets.size > MAX_TRACKED_KEYS) {
    buckets.clear();
  }

  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= max) {
    buckets.set(key, bucket);
    const oldest = bucket.timestamps[0];
    return { allowed: false, remaining: 0, retryAfterMs: Math.max(0, windowMs - (now - oldest)) };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { allowed: true, remaining: max - bucket.timestamps.length, retryAfterMs: 0 };
}

// Best-effort client identifier from standard proxy headers, falling back to
// a constant bucket when nothing is available (e.g. local dev without a proxy).
export function getClientKey(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'anonymous';
}
