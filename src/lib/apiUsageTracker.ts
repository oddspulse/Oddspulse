import fs from 'fs';
import path from 'path';
import { ODDS_API_CONFIG, getCurrentMonthKey } from '@/config/oddsConfig';

const USAGE_FILE_PATH = path.join(process.cwd(), 'src/data/api-usage.json');

export interface ApiUsage {
  monthKey: string; // e.g., "2025-12"
  callCount: number;
  lastReset: string; // ISO date
  callHistory: ApiCall[];
}

export interface ApiCall {
  timestamp: string;
  endpoint: string;
  sportKey?: string;
  remaining?: number;
}

/**
 * Load API usage data from persistent storage
 */
export function loadApiUsage(): ApiUsage {
  try {
    const data = fs.readFileSync(USAGE_FILE_PATH, 'utf-8');
    const usage: ApiUsage = JSON.parse(data);

    // Check if we need to reset for new month
    const currentMonth = getCurrentMonthKey();
    if (usage.monthKey !== currentMonth) {
      console.log(`[API Usage] New month detected. Resetting counter from ${usage.callCount} to 0`);
      return resetUsage();
    }

    return usage;
  } catch (error) {
    console.error('[API Usage] Error loading usage data, creating new:', error);
    return resetUsage();
  }
}

/**
 * Save API usage data to persistent storage
 */
export function saveApiUsage(usage: ApiUsage): void {
  try {
    fs.writeFileSync(USAGE_FILE_PATH, JSON.stringify(usage, null, 2));
  } catch (error) {
    console.error('[API Usage] Error saving usage data:', error);
  }
}

/**
 * Reset usage counter for new month
 */
function resetUsage(): ApiUsage {
  const usage: ApiUsage = {
    monthKey: getCurrentMonthKey(),
    callCount: 0,
    lastReset: new Date().toISOString(),
    callHistory: [],
  };
  saveApiUsage(usage);
  return usage;
}

/**
 * Increment call count and log the API call
 */
export function incrementApiUsage(endpoint: string, sportKey?: string, remaining?: number): void {
  const usage = loadApiUsage();

  usage.callCount++;
  usage.callHistory.push({
    timestamp: new Date().toISOString(),
    endpoint,
    sportKey,
    remaining,
  });

  // Keep only last 100 calls in history to prevent file bloat
  if (usage.callHistory.length > 100) {
    usage.callHistory = usage.callHistory.slice(-100);
  }

  saveApiUsage(usage);

  console.log(`[API Usage] Call #${usage.callCount}/${ODDS_API_CONFIG.MONTHLY_API_LIMIT} this month`);
  if (remaining !== undefined) {
    console.log(`[API Usage] API reports ${remaining} requests remaining`);
  }
}

/**
 * Check if we can make another API call this month
 */
export function canMakeApiCall(): { allowed: boolean; reason?: string; usage: ApiUsage } {
  const usage = loadApiUsage();

  if (usage.callCount >= ODDS_API_CONFIG.MONTHLY_API_LIMIT) {
    return {
      allowed: false,
      reason: `Monthly API limit reached (${usage.callCount}/${ODDS_API_CONFIG.MONTHLY_API_LIMIT}). Quota resets next month.`,
      usage,
    };
  }

  return { allowed: true, usage };
}

/**
 * Get current API usage statistics
 */
export function getApiUsageStats(): {
  callCount: number;
  limit: number;
  remaining: number;
  percentUsed: number;
  monthKey: string;
  isNearLimit: boolean;
} {
  const usage = loadApiUsage();
  const remaining = Math.max(0, ODDS_API_CONFIG.MONTHLY_API_LIMIT - usage.callCount);
  const percentUsed = (usage.callCount / ODDS_API_CONFIG.MONTHLY_API_LIMIT) * 100;
  const isNearLimit = usage.callCount >= ODDS_API_CONFIG.WARNING_THRESHOLD;

  return {
    callCount: usage.callCount,
    limit: ODDS_API_CONFIG.MONTHLY_API_LIMIT,
    remaining,
    percentUsed,
    monthKey: usage.monthKey,
    isNearLimit,
  };
}
