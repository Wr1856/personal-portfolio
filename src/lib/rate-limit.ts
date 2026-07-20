import "server-only";

type WindowEntry = {
  timestamps: number[];
};

const buckets = new Map<string, WindowEntry>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;
const MAX_BUCKETS = 10_000;

/**
 * Sliding-window rate limiter kept in instance memory. Appropriate for a
 * single serverless instance; swap for a shared store (e.g. Upstash) if the
 * deployment ever needs cross-instance limits.
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = buckets.get(key) ?? { timestamps: [] };

  entry.timestamps = entry.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    buckets.set(key, entry);
    return true;
  }

  entry.timestamps.push(now);
  buckets.set(key, entry);

  // Prevent unbounded growth.
  if (buckets.size > MAX_BUCKETS) {
    const oldestKey = buckets.keys().next().value;
    if (oldestKey) buckets.delete(oldestKey);
  }

  return false;
}
