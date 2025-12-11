import { NextResponse } from 'next/server';
import { getApiUsageStats } from '@/lib/apiUsageTracker';

export interface OddsApiStatus {
  lastFetchTime: string | null;
  nextAllowedFetchTime: string | null;
  monthlyCallCount: number;
  monthlyLimit: number;
  remaining: number;
  percentUsed: number;
  isNearLimit: boolean;
}

/**
 * GET /api/odds-status
 * Returns the current status of The Odds API quota and fetch timing
 */
export async function GET() {
  try {
    const stats = getApiUsageStats();

    const status: OddsApiStatus = {
      lastFetchTime: stats.lastFetchTime || null,
      nextAllowedFetchTime: stats.nextAllowedFetchTime || null,
      monthlyCallCount: stats.callCount,
      monthlyLimit: stats.limit,
      remaining: stats.remaining,
      percentUsed: stats.percentUsed,
      isNearLimit: stats.isNearLimit,
    };

    return NextResponse.json(status, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('[Odds Status API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get odds status' },
      { status: 500 }
    );
  }
}
