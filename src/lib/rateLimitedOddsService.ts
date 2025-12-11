/**
 * Rate-Limited Odds Service
 *
 * This service wraps the core odds fetching logic with:
 * - Monthly quota tracking (500 calls/month)
 * - Aggressive caching (90-minute minimum refresh)
 * - Graceful degradation (serve cached data when quota exhausted)
 *
 * This ensures we NEVER exceed our API limits while still providing
 * fresh data to users within reasonable timeframes.
 */

import { LiveEvent, MarketType } from './types';
import { getLiveOdds } from './oddsService';
import { canMakeApiCall, incrementApiUsage, getApiUsageStats } from './apiUsageTracker';
import {
  getCachedOdds,
  setCachedOdds,
  canRefresh,
  getCacheStats,
} from './oddsCache';
import { ODDS_API_CONFIG, getTimeUntilNextRefresh } from '@/config/oddsConfig';

export interface RateLimitedOddsResponse {
  events: LiveEvent[];
  fromCache: boolean;
  cacheAge?: number; // milliseconds
  quotaInfo: {
    callCount: number;
    limit: number;
    remaining: number;
    percentUsed: number;
    isNearLimit: boolean;
  };
  refreshInfo: {
    canRefreshNow: boolean;
    timeUntilRefresh?: string;
    lastFetchTime?: number;
  };
  warning?: string;
}

/**
 * Get live odds with rate limiting and caching
 *
 * This is the ONLY function that should be called by API routes.
 * It handles all quota tracking, caching, and rate limiting logic.
 */
export async function getRateLimitedLiveOdds(params: {
  sportKey: string;
  markets?: MarketType[];
  region?: string;
  forceRefresh?: boolean;
}): Promise<RateLimitedOddsResponse> {
  const {
    sportKey,
    markets = ['moneyline', 'spread', 'total'],
    region = ODDS_API_CONFIG.DEFAULT_REGION,
    forceRefresh = false,
  } = params;

  const marketsStr = markets.join(',');
  const quotaInfo = getApiUsageStats();

  // Check if we have cached data
  const cached = getCachedOdds(sportKey, marketsStr, region);

  // Check if we can refresh
  const refreshCheck = canRefresh(sportKey, marketsStr, region);

  // Check if we can make an API call
  const quotaCheck = canMakeApiCall();

  // Determine if we should fetch fresh data
  const shouldFetch =
    forceRefresh || (!cached || (refreshCheck.allowed && quotaCheck.allowed));

  // If we can't/shouldn't fetch, return cached data
  if (!shouldFetch) {
    if (!cached) {
      throw new Error('No cached data available and refresh not allowed');
    }

    let warning: string | undefined;

    if (!quotaCheck.allowed) {
      warning = quotaCheck.reason;
    } else if (!refreshCheck.allowed) {
      warning = refreshCheck.reason;
    }

    return {
      events: cached.data,
      fromCache: true,
      cacheAge: cached.age,
      quotaInfo,
      refreshInfo: {
        canRefreshNow: false,
        timeUntilRefresh: refreshCheck.lastFetchTime
          ? getTimeUntilNextRefresh(refreshCheck.lastFetchTime)
          : undefined,
        lastFetchTime: refreshCheck.lastFetchTime,
      },
      warning,
    };
  }

  // Fetch fresh data from The Odds API
  try {
    console.log(`[Rate Limited Odds] Fetching fresh data for ${sportKey}`);

    const events = await getLiveOdds(sportKey, markets, region);

    // Cache the results
    setCachedOdds(sportKey, marketsStr, region, events);

    // Increment usage counter
    incrementApiUsage(`/sports/${sportKey}/odds`, sportKey);

    // Get updated quota info
    const updatedQuotaInfo = getApiUsageStats();

    return {
      events,
      fromCache: false,
      quotaInfo: updatedQuotaInfo,
      refreshInfo: {
        canRefreshNow: false,
        timeUntilRefresh: getTimeUntilNextRefresh(Date.now()),
        lastFetchTime: Date.now(),
      },
      warning: updatedQuotaInfo.isNearLimit
        ? `Warning: ${updatedQuotaInfo.remaining} API calls remaining this month`
        : undefined,
    };
  } catch (error) {
    // If fetch fails, try to return cached data
    if (cached) {
      console.warn('[Rate Limited Odds] Fetch failed, returning cached data');
      return {
        events: cached.data,
        fromCache: true,
        cacheAge: cached.age,
        quotaInfo,
        refreshInfo: {
          canRefreshNow: false,
          lastFetchTime: refreshCheck.lastFetchTime,
        },
        warning: `API error: ${error instanceof Error ? error.message : 'Unknown error'}. Showing cached data.`,
      };
    }

    // No cached data and fetch failed
    throw error;
  }
}

/**
 * Get cache and quota statistics (for admin/debugging)
 */
export function getOddsServiceStats() {
  return {
    quota: getApiUsageStats(),
    cache: getCacheStats(),
    config: {
      monthlyLimit: ODDS_API_CONFIG.MONTHLY_API_LIMIT,
      minRefreshInterval: `${ODDS_API_CONFIG.MIN_REFRESH_INTERVAL_MS / (60 * 1000)} minutes`,
      cacheExpiration: `${ODDS_API_CONFIG.CACHE_EXPIRATION_MS / (60 * 1000)} minutes`,
    },
  };
}
