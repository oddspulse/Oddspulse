import { NextResponse } from 'next/server';

// Exclusion keywords
const EXCLUSION_KEYWORDS = {
  Politics: ['president', 'election', 'poll', 'senate', 'congress', 'trump', 'biden', 'kamala', 'harris', 'governor', 'campaign'],
  Fed: ['fed', 'fomc', 'powell', 'rate cut', 'rate hike', 'cpi', 'inflation', 'federal reserve'],
  Crypto: ['btc', 'bitcoin', 'eth', 'ethereum', 'sol', 'crypto', 'blockchain', 'nft'],
  Stocks: ['stock', 'shares', 'earnings', 'nasdaq', 'dow', 'tsla', 'aapl', 'nvda'],
};

// Sports inclusion keywords
const SPORTS_KEYWORDS = ['nba', 'nfl', 'nhl', 'mlb', 'ufc', 'mma', 'vs', 'match', 'game', 'fight', 'tournament', 'playoffs', 'championship'];

function isSportsMarket(question: string): boolean {
  const lower = question.toLowerCase();

  // Exclude non-sports first
  for (const keywords of Object.values(EXCLUSION_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return false;
  }

  // Must have sports keywords
  return SPORTS_KEYWORDS.some(k => lower.includes(k));
}

function categorizeMarket(question: string): string | null {
  const lower = question.toLowerCase();

  // Check exclusions first
  if (EXCLUSION_KEYWORDS.Politics.some(k => lower.includes(k))) return 'Politics';
  if (EXCLUSION_KEYWORDS.Crypto.some(k => lower.includes(k))) return 'Crypto';
  if (EXCLUSION_KEYWORDS.Fed.some(k => lower.includes(k))) return 'Fed Decisions';
  if (EXCLUSION_KEYWORDS.Stocks.some(k => lower.includes(k))) return 'Stocks';

  // Check sports
  if (isSportsMarket(question)) return 'Sports';

  return null;
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
      console.error('[Polymarket] API error:', response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('[Polymarket] Fetch error:', error);
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
      console.error('[Manifold] API error:', response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('[Manifold] Fetch error:', error);
    return [];
  }
}

export async function GET() {
  try {
    console.log('[Prediction Markets API] Fetching from both sources...');

    const [polymarketData, manifoldData] = await Promise.all([
      fetchPolymarketDirect(),
      fetchManifoldDirect(),
    ]);

    console.log(`[Prediction Markets API] Polymarket: ${polymarketData.length}, Manifold: ${manifoldData.length}`);

    const categories: Record<string, any[]> = {
      'Crypto': [],
      'Politics': [],
      'Sports': [],
      'Fed Decisions': [],
      'Stocks': [],
    };

    // Process Polymarket markets
    for (const market of polymarketData) {
      if (market.closed || !market.active) continue;

      const category = categorizeMarket(market.question);
      if (!category) continue;

      let probability = 50;
      if (market.outcomePrices && market.outcomePrices.length > 0) {
        probability = parseFloat(market.outcomePrices[0]) * 100;
      }

      const americanOdds = probabilityToAmericanOdds(probability);
      if (americanOdds === 0) continue;

      categories[category].push({
        id: market.id || market.conditionId,
        question: market.question,
        category,
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
    for (const market of manifoldData) {
      if (market.isResolved || (market.closeTime && market.closeTime < Date.now())) continue;

      const category = categorizeMarket(market.question);
      if (!category) continue;

      let probability = 50;
      if (market.probability !== undefined) {
        probability = market.probability * 100;
      }

      const americanOdds = probabilityToAmericanOdds(probability);
      if (americanOdds === 0) continue;

      categories[category].push({
        id: market.id,
        question: market.question,
        category,
        probability,
        americanOdds,
        source: 'Manifold',
        url: market.url,
        volume: market.volume || 0,
        endDate: market.closeTime ? new Date(market.closeTime).toISOString() : undefined,
        lastUpdated: new Date().toISOString(),
      });
    }

    // Sort each category by volume and limit to top 10
    for (const category in categories) {
      categories[category] = categories[category]
        .sort((a, b) => (b.volume || 0) - (a.volume || 0))
        .slice(0, 10);
    }

    const totalCount = Object.values(categories).reduce((sum, arr) => sum + arr.length, 0);

    console.log('[Prediction Markets API] Categorized:', {
      Crypto: categories['Crypto'].length,
      Politics: categories['Politics'].length,
      Sports: categories['Sports'].length,
      'Fed Decisions': categories['Fed Decisions'].length,
      Stocks: categories['Stocks'].length,
    });

    return NextResponse.json({
      success: true,
      categories,
      totalCount,
    });
  } catch (error: any) {
    console.error('[API] Error fetching prediction markets:', error);
    return NextResponse.json(
      {
        success: false,
        categories: {
          'Crypto': [],
          'Politics': [],
          'Sports': [],
          'Fed Decisions': [],
          'Stocks': [],
        },
        error: error.message || 'Failed to fetch prediction markets',
      },
      { status: 500 }
    );
  }
}
