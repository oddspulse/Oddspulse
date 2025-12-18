import { NextResponse } from 'next/server';
import { getRateLimitedLiveOdds } from '@/lib/rateLimitedOddsService';
import { MarketType, LiveEvent, MarketOutcome } from '@/lib/types';
import { fetchPolymarketSports, fetchManifoldSports, PredictionMarket } from '@/lib/predictionMarketsService';

/**
 * Convert prediction market to MarketOutcome format
 */
function predictionMarketToOutcome(market: PredictionMarket): MarketOutcome {
  return {
    label: `${market.source}: ${market.question.substring(0, 50)}${market.question.length > 50 ? '...' : ''}`,
    operatorId: market.source.toLowerCase(),
    operatorName: market.source,
    odds: market.americanOdds,
    price: market.probability / 100, // Convert to decimal probability
    affiliateUrl: market.url,
  };
}

/**
 * Convert prediction markets to a synthetic LiveEvent
 * This allows them to appear in the existing odds table
 */
function predictionMarketsToEvents(markets: PredictionMarket[], sportKey: string): LiveEvent[] {
  if (markets.length === 0) return [];

  // Group markets by similar questions to create "events"
  const syntheticEvents: LiveEvent[] = [];

  markets.forEach((market, index) => {
    // Create a synthetic event for each prediction market
    const outcomes = [predictionMarketToOutcome(market)];

    syntheticEvents.push({
      id: `prediction-${market.source.toLowerCase()}-${market.id}`,
      sport: sportKey,
      sportKey: sportKey,
      league: `${market.source} Prediction Markets`,
      homeTeam: 'Yes',
      awayTeam: 'No',
      startTime: market.endDate || new Date().toISOString(),
      isLive: true, // Prediction markets are always "live"
      markets: [
        {
          type: 'moneyline' as MarketType,
          outcomes,
        },
      ],
    });
  });

  return syntheticEvents;
}

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

    // Fetch prediction markets in parallel (sports-only)
    // These are fetched separately and merged in
    let predictionMarkets: PredictionMarket[] = [];
    try {
      const [polymarketSports, manifoldSports] = await Promise.all([
        fetchPolymarketSports(),
        fetchManifoldSports(),
      ]);
      predictionMarkets = [...polymarketSports, ...manifoldSports];
    } catch (error) {
      console.error('[Odds API] Error fetching prediction markets (non-blocking):', error);
      // Continue without prediction markets - non-blocking
    }

    // Convert prediction markets to events and merge
    const predictionEvents = predictionMarketsToEvents(predictionMarkets, params.sportKey);
    const combinedEvents = [...result.events, ...predictionEvents];

    return NextResponse.json({
      ...result,
      events: combinedEvents,
    }, {
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
