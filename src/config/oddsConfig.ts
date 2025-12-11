/**
 * The Odds API Configuration
 *
 * Rate Limiting Strategy:
 * - Free tier: 500 API calls per month
 * - Spread across ~30 days = ~16 calls per day
 * - 16 calls per day = ~1 call every 90 minutes
 *
 * This configuration ensures we never exceed the monthly quota
 * by implementing aggressive caching and minimum refresh intervals.
 */

export const ODDS_API_CONFIG = {
  // Monthly API call limit (free tier)
  MONTHLY_API_LIMIT: 500,

  // Minimum time between API calls per sport/market combination (90 minutes)
  // This spreads ~500 calls across 30 days = ~16 calls/day = ~1 call/90min
  MIN_REFRESH_INTERVAL_MS: 90 * 60 * 1000, // 90 minutes

  // Cache expiration (how long to keep cached data)
  // Set to 2 hours to ensure fresh data while respecting rate limits
  CACHE_EXPIRATION_MS: 120 * 60 * 1000, // 2 hours

  // Warning threshold (show warning when approaching limit)
  WARNING_THRESHOLD: 450, // Show warning at 90% usage (450/500)

  // Environment variables
  API_KEY: process.env.ODDS_API_KEY || '',
  BASE_URL: process.env.ODDS_API_BASE_URL || 'https://api.the-odds-api.com/v4',
  DEFAULT_REGION: process.env.ODDS_API_REGION || 'us',
  DEFAULT_FORMAT: process.env.ODDS_API_FORMAT || 'american',
} as const;

/**
 * Helper to format time remaining until next refresh
 */
export function getTimeUntilNextRefresh(lastFetchTime: number): string {
  const now = Date.now();
  const elapsed = now - lastFetchTime;
  const remaining = ODDS_API_CONFIG.MIN_REFRESH_INTERVAL_MS - elapsed;

  if (remaining <= 0) return 'Available now';

  const minutes = Math.ceil(remaining / (60 * 1000));
  if (minutes < 60) return `${minutes} minutes`;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/**
 * Helper to get current month key (YYYY-MM format)
 */
export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
