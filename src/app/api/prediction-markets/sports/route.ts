import { NextResponse } from 'next/server';

// Exclusion keywords
const EXCLUSION_KEYWORDS = {
  Politics: ['president', 'election', 'poll', 'senate', 'congress', 'trump', 'biden', 'kamala', 'harris', 'governor', 'campaign'],
  Fed: ['fed', 'fomc', 'powell', 'rate cut', 'rate hike', 'cpi', 'inflation', 'federal reserve'],
  Crypto: ['btc', 'bitcoin', 'eth', 'ethereum', 'sol', 'crypto', 'blockchain', 'nft'],
  Stocks: ['stock', 'shares', 'earnings', 'nasdaq', 'dow', 'tsla', 'aapl', 'nvda'],
};

// Sports inclusion keywords
const SPORTS_KEYWORDS = ['nba', 'nfl', 'nhl', 'mlb', 'ufc', 'mma', 'atp', 'wta', 'pga', 'epl', 'premier league', 'champions league', 'f1', 'vs', 'vs.', 'match', 'game', 'fight', 'tournament', 'playoffs', 'championship', 'super bowl', 'world series', 'stanley cup'];

function isSportsMarket(question: string): boolean {
  const lower = question.toLowerCase();

  // Hard exclusion first
  for (const keywords of Object.values(EXCLUSION_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return false;
  }

  // Must have sports keywords
  return SPORTS_KEYWORDS.some(k => lower.includes(k));
}

function probabilityToAmericanOdds(p: number): number {
  if (p > 1) p = p / 100;
  if (p <= 0.01 || p >= 0.99) return 0;

  if (p >= 0.5) {
    return -Math.round((p / (1 - p)) * 100);
  } else {
    return Math.round(((1 - p) / p) * 100);
  }
}

async function fetchPolymarketDirect() {
  try {
    const response = await fetch('https://gamma-api.polymarket.com/markets', {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('[Polymarket Sports] API error:', response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('[Polymarket Sports] Fetch error:', error);
    return [];
  }
}

async function fetchManifoldDirect() {
  try {
    const response = await fetch('https://api.manifold.markets/v0/markets', {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('[Manifold Sports] API error:', response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('[Manifold Sports] Fetch error:', error);
    return [];
  }
}

export async function GET() {
  try {
    console.log('[Prediction Markets Sports] Fetching sports markets...');

    const [polymarketData, manifoldData] = await Promise.all([
      fetchPolymarketDirect(),
      fetchManifoldDirect(),
    ]);

    console.log(`[Prediction Markets Sports] Raw data - Polymarket: ${polymarketData.length}, Manifold: ${manifoldData.length}`);

    const sportsMarkets: any[] = [];

    // Process Polymarket markets
    let polyProcessed = 0;
    let polyIncluded = 0;
    for (const market of polymarketData) {
      polyProcessed++;
      if (market.closed || !market.active) continue;

      if (!isSportsMarket(market.question)) continue;

      let probability = 50;
      if (market.outcomePrices && market.outcomePrices.length > 0) {
        probability = parseFloat(market.outcomePrices[0]) * 100;
      }

      const americanOdds = probabilityToAmericanOdds(probability);
      if (americanOdds === 0) continue;

      polyIncluded++;
      sportsMarkets.push({
        id: market.id || market.conditionId,
        question: market.question,
        category: 'Sports',
        probability,
        americanOdds,
        source: 'Polymarket',
        url: `https://polymarket.com/event/${market.slug || market.id}`,
        volume: market.volume ? parseFloat(market.volume) : 0,
        endDate: market.endDate,
        lastUpdated: new Date().toISOString(),
      });
    }

    // Process Manifold markets
    let manifoldProcessed = 0;
    let manifoldIncluded = 0;
    for (const market of manifoldData) {
      manifoldProcessed++;
      if (market.isResolved || (market.closeTime && market.closeTime < Date.now())) continue;

      if (!isSportsMarket(market.question)) continue;

      let probability = 50;
      if (market.probability !== undefined) {
        probability = market.probability * 100;
      }

      const americanOdds = probabilityToAmericanOdds(probability);
      if (americanOdds === 0) continue;

      manifoldIncluded++;
      sportsMarkets.push({
        id: market.id,
        question: market.question,
        category: 'Sports',
        probability,
        americanOdds,
        source: 'Manifold',
        url: market.url,
        volume: market.volume || 0,
        endDate: market.closeTime ? new Date(market.closeTime).toISOString() : undefined,
        lastUpdated: new Date().toISOString(),
      });
    }

    // Sort by volume and limit
    sportsMarkets.sort((a, b) => (b.volume || 0) - (a.volume || 0));
    const topMarkets = sportsMarkets.slice(0, 20);

    console.log(`[Prediction Markets Sports] Polymarket: ${polyIncluded}/${polyProcessed}, Manifold: ${manifoldIncluded}/${manifoldProcessed}`);
    console.log(`[Prediction Markets Sports] Sample:`, topMarkets.slice(0, 3).map(m => m.question));

    return NextResponse.json({
      success: true,
      markets: topMarkets,
      count: topMarkets.length,
      sources: {
        polymarket: polyIncluded,
        manifold: manifoldIncluded,
      },
    });
  } catch (error: any) {
    console.error('[API] Error fetching sports prediction markets:', error);
    return NextResponse.json(
      {
        success: false,
        markets: [],
        error: error.message || 'Failed to fetch sports prediction markets',
      },
      { status: 500 }
    );
  }
}
