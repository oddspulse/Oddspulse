import { LiveEvent } from './types';
import { ODDS_API_CONFIG } from '@/config/oddsConfig';

interface CacheEntry {
  data: LiveEvent[];
  timestamp: number;
  sportKey: string;
  markets: string;
  region: string;
}

// In-memory cache (resets on server restart, which is fine for our use case)
const cache = new Map<string, CacheEntry>();

/**
 * Generate cache key from parameters
 */
function getCacheKey(sportKey: string, markets: string, region: string): string {
  return `${sportKey}:${markets}:${region}`;
}

/**
 * Check if cached data is still valid
 */
function isCacheValid(entry: CacheEntry): boolean {
  const age = Date.now() - entry.timestamp;
  return age < ODDS_API_CONFIG.CACHE_EXPIRATION_MS;
}

/**
 * Check if enough time has passed to allow a refresh
 */
export function canRefresh(sportKey: string, markets: string, region: string): {
  allowed: boolean;
  reason?: string;
  timeUntilRefresh?: number;
  lastFetchTime?: number;
} {
  const key = getCacheKey(sportKey, markets, region);
  const entry = cache.get(key);

  if (!entry) {
    return { allowed: true };
  }

  const timeSinceLastFetch = Date.now() - entry.timestamp;
  const timeUntilRefresh = ODDS_API_CONFIG.MIN_REFRESH_INTERVAL_MS - timeSinceLastFetch;

  if (timeSinceLastFetch < ODDS_API_CONFIG.MIN_REFRESH_INTERVAL_MS) {
    const minutesRemaining = Math.ceil(timeUntilRefresh / (60 * 1000));
    return {
      allowed: false,
      reason: `Refresh not allowed yet. Please wait ${minutesRemaining} more minutes.`,
      timeUntilRefresh,
      lastFetchTime: entry.timestamp,
    };
  }

  return { allowed: true, lastFetchTime: entry.timestamp };
}

/**
 * Get cached odds data
 */
export function getCachedOdds(
  sportKey: string,
  markets: string,
  region: string
): { data: LiveEvent[]; age: number } | null {
  const key = getCacheKey(sportKey, markets, region);
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  const age = Date.now() - entry.timestamp;

  // Return cached data even if expired (we'll show a warning in UI)
  return {
    data: entry.data,
    age,
  };
}

/**
 * Store odds data in cache
 */
export function setCachedOdds(
  sportKey: string,
  markets: string,
  region: string,
  data: LiveEvent[]
): void {
  const key = getCacheKey(sportKey, markets, region);
  cache.set(key, {
    data,
    timestamp: Date.now(),
    sportKey,
    markets,
    region,
  });

  console.log(`[Odds Cache] Cached ${data.length} events for ${key}`);
}

/**
 * Clear all cached data (useful for testing)
 */
export function clearCache(): void {
  cache.clear();
  console.log('[Odds Cache] Cache cleared');
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  entries: number;
  keys: string[];
  oldestEntry?: { key: string; age: number };
} {
  const entries = cache.size;
  const keys = Array.from(cache.keys());

  let oldestEntry: { key: string; age: number } | undefined;
  let maxAge = 0;

  cache.forEach((entry, key) => {
    const age = Date.now() - entry.timestamp;
    if (age > maxAge) {
      maxAge = age;
      oldestEntry = { key, age };
    }
  });

  return { entries, keys, oldestEntry };
}
