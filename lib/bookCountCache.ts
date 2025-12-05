/**
 * Server-side in-memory cache for book counts per tag.
 * TTL: 2 hours (7200000 ms)
 */

const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

interface CacheEntry {
  count: number;
  timestamp: number;
}

// In-memory cache: Map<tag, { count, timestamp }>
// "all" key represents total count (no tag filter)
const countCache = new Map<string, CacheEntry>();

/**
 * Get cached count for a tag. Returns null if cache miss or expired.
 * @param tag - Tag value, or "all" for total count
 */
export function getCount(tag: string = "all"): number | null {
  const entry = countCache.get(tag);
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
  if (isExpired) {
    countCache.delete(tag);
    return null;
  }

  return entry.count;
}

/**
 * Set count in cache for a tag.
 * @param tag - Tag value, or "all" for total count
 * @param count - The book count to cache
 */
export function setCount(tag: string = "all", count: number): void {
  countCache.set(tag, {
    count,
    timestamp: Date.now(),
  });
}

/**
 * Invalidate (remove) a cached count for a tag.
 * @param tag - Tag value to invalidate, or "all" for total count
 */
export function invalidateCount(tag: string = "all"): void {
  countCache.delete(tag);
}

/**
 * Invalidate all cached counts.
 */
export function invalidateAllCounts(): void {
  countCache.clear();
}

/**
 * Get total count by summing all per-tag counts.
 * Returns null if no cached data available.
 */
export function getTotalFromTagCounts(): number | null {
  if (countCache.size === 0) return null;

  let total = 0;
  const now = Date.now();

  for (const [tag, entry] of countCache.entries()) {
    // Skip the "all" entry and expired entries
    if (tag === "all") continue;
    if (now - entry.timestamp > CACHE_TTL_MS) continue;
    total += entry.count;
  }

  return total > 0 ? total : null;
}

/**
 * Get all cached entries (for debugging/monitoring).
 */
export function getCacheStats(): {
  entries: { tag: string; count: number; ageMs: number }[];
  size: number;
} {
  const now = Date.now();
  const entries = Array.from(countCache.entries()).map(([tag, entry]) => ({
    tag,
    count: entry.count,
    ageMs: now - entry.timestamp,
  }));

  return { entries, size: countCache.size };
}
