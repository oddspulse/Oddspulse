import { NextResponse } from 'next/server';
import { getRateLimitedLiveOdds } from '@/lib/rateLimitedOddsService';
import { MarketType } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { sportKey: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const marketsParam = searchParams.get('markets') || 'moneyline,spread,total';
    const region = searchParams.get('region') || 'us';
    const forceRefresh = searchParams.get('forceRefresh') === 'true';

    // Parse markets from comma-separated string
    const markets = marketsParam.split(',').filter(m =>
      ['moneyline', 'spread', 'total'].includes(m)
    ) as MarketType[];

    // Use rate-limited service (includes caching and quota tracking)
    const result = await getRateLimitedLiveOdds({
      sportKey: params.sportKey,
      markets,
      region,
      forceRefresh,
    });

    return NextResponse.json(result, {
      headers: {
        // Don't cache at CDN level since we're managing cache internally
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('[API] Error fetching odds:', error);

    // Handle specific error types
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        {
          error: 'API Configuration Error',
          message: error.message,
          hint: 'Add your API key to .env.local'
        },
        { status: 500 }
      );
    }

    if (error.message?.includes('rate limit') || error.message?.includes('quota')) {
      return NextResponse.json(
        {
          error: 'Rate Limit Exceeded',
          message: error.message,
          hint: 'Monthly API quota exhausted. Data will refresh next month or upgrade your plan.'
        },
        { status: 429 }
      );
    }

    if (error.message?.includes('No cached data')) {
      return NextResponse.json(
        {
          error: 'No Data Available',
          message: 'No cached data available and refresh not allowed yet',
          hint: 'Please wait for the refresh interval to expire'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch odds data',
        message: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
