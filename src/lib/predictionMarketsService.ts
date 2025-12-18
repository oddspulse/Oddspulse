/**
 * Prediction Markets Service
 *
 * Fetches data from Polymarket and Manifold prediction markets
 * Normalizes to common format and filters by category
 */

export type PredictionMarket = {
  id: string;
  question: string;
  category: string;
  probability: number; // 0-100
  americanOdds: number;
  source: 'Polymarket' | 'Manifold';
  url: string;
  volume?: number;
  endDate?: string;
  lastUpdated: string;
};

export type PredictionMarketCategory = 'Crypto' | 'Politics' | 'Sports' | 'Fed Decisions' | 'Stocks' | 'All';

// Sports keywords for filtering
const SPORTS_KEYWORDS = [
  'nfl', 'nba', 'nhl', 'mlb', 'ufc', 'mma',
  'football', 'basketball', 'hockey', 'baseball',
  'soccer', 'tennis', 'golf', 'boxing',
  'super bowl', 'world series', 'playoffs', 'championship',
  'team', 'game', 'match', 'win', 'score'
];

// Category keywords
const CATEGORY_KEYWORDS = {
  Crypto: ['bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'blockchain', 'defi', 'nft', 'solana', 'xrp', 'dogecoin'],
  Politics: ['election', 'president', 'biden', 'trump', 'congress', 'senate', 'vote', 'political', 'government', 'desantis', 'harris'],
  Sports: SPORTS_KEYWORDS,
  'Fed Decisions': ['fed', 'fomc', 'powell', 'interest rate', 'rate cut', 'rate hike', 'cpi', 'inflation', 'fed fund', 'federal reserve'],
  Stocks: ['stock', 'aapl', 'tsla', 'spy', 'nasdaq', 'dow', 's&p', 'earnings', 'apple', 'tesla', 'google', 'amazon', 'microsoft', 'nvidia']
};

/**
 * Convert probability to American odds
 */
function probabilityToAmericanOdds(probability: number): number {
  // Probability should be between 0 and 1
  const p = probability > 1 ? probability / 100 : probability;

  if (p <= 0 || p >= 1) return 0; // Invalid

  if (p >= 0.5) {
    return -Math.round((p / (1 - p)) * 100);
  } else {
    return Math.round(((1 - p) / p) * 100);
  }
}

/**
 * Categorize market based on question/title
 */
function categorizeMarket(question: string, availableCategories: PredictionMarketCategory[] = ['All']): PredictionMarketCategory | null {
  const lowerQuestion = question.toLowerCase();

  // If only looking for specific categories
  if (!availableCategories.includes('All')) {
    for (const category of availableCategories) {
      if (category === 'All') continue;
      const keywords = CATEGORY_KEYWORDS[category];
      if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
        return category;
      }
    }
    return null;
  }

  // Check all categories in order of priority
  const categories: (keyof typeof CATEGORY_KEYWORDS)[] = ['Sports', 'Politics', 'Crypto', 'Fed Decisions', 'Stocks'];

  for (const category of categories) {
    const keywords = CATEGORY_KEYWORDS[category];
    if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
      return category;
    }
  }

  return null; // Uncategorized
}

/**
 * Fetch sports markets from Polymarket
 */
export async function fetchPolymarketSports(): Promise<PredictionMarket[]> {
  try {
    // Polymarket public API endpoint for markets
    const response = await fetch('https://gamma-api.polymarket.com/markets', {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error('[Polymarket] API error:', response.statusText);
      return [];
    }

    const markets = await response.json();

    // Filter and normalize sports markets
    const sportsMarkets: PredictionMarket[] = [];

    for (const market of markets) {
      // Skip if not active or closed
      if (market.closed || !market.active) continue;

      // Categorize market
      const category = categorizeMarket(market.question, ['Sports']);
      if (category !== 'Sports') continue;

      // Get probability from the market
      // Polymarket uses CLOB tokens, we'll use the last price or outcomes
      let probability = 50; // Default

      if (market.outcomePrices && market.outcomePrices.length > 0) {
        // Use the first outcome's price (usually "Yes")
        probability = parseFloat(market.outcomePrices[0]) * 100;
      } else if (market.clobTokenIds && market.clobTokenIds.length > 0) {
        // Try to get from tokens
        probability = market.tokens?.[0]?.price ? parseFloat(market.tokens[0].price) * 100 : 50;
      }

      sportsMarkets.push({
        id: market.id || market.conditionId,
        question: market.question,
        category: 'Sports',
        probability,
        americanOdds: probabilityToAmericanOdds(probability),
        source: 'Polymarket',
        url: `https://polymarket.com/event/${market.slug || market.id}`,
        volume: market.volume ? parseFloat(market.volume) : undefined,
        endDate: market.endDate,
        lastUpdated: new Date().toISOString(),
      });
    }

    return sportsMarkets.slice(0, 20); // Top 20 by volume
  } catch (error) {
    console.error('[Polymarket] Error fetching sports markets:', error);
    return []; // Graceful fallback
  }
}

/**
 * Fetch sports markets from Manifold
 */
export async function fetchManifoldSports(): Promise<PredictionMarket[]> {
  try {
    // Manifold public API endpoint
    const response = await fetch('https://api.manifold.markets/v0/markets', {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error('[Manifold] API error:', response.statusText);
      return [];
    }

    const markets = await response.json();

    // Filter and normalize sports markets
    const sportsMarkets: PredictionMarket[] = [];

    for (const market of markets) {
      // Skip if resolved or closed
      if (market.isResolved || market.closeTime < Date.now()) continue;

      // Categorize market
      const category = categorizeMarket(market.question, ['Sports']);
      if (category !== 'Sports') continue;

      // Get probability
      let probability = 50;
      if (market.probability !== undefined) {
        probability = market.probability * 100;
      } else if (market.pool && market.pool.YES && market.pool.NO) {
        // Calculate from pool
        const yesPool = market.pool.YES;
        const noPool = market.pool.NO;
        probability = (yesPool / (yesPool + noPool)) * 100;
      }

      sportsMarkets.push({
        id: market.id,
        question: market.question,
        category: 'Sports',
        probability,
        americanOdds: probabilityToAmericanOdds(probability),
        source: 'Manifold',
        url: market.url,
        volume: market.volume,
        endDate: market.closeTime ? new Date(market.closeTime).toISOString() : undefined,
        lastUpdated: new Date().toISOString(),
      });
    }

    return sportsMarkets.slice(0, 20); // Top 20
  } catch (error) {
    console.error('[Manifold] Error fetching sports markets:', error);
    return []; // Graceful fallback
  }
}

/**
 * Fetch markets from Polymarket by category
 */
export async function fetchPolymarketByCategory(categories: PredictionMarketCategory[]): Promise<PredictionMarket[]> {
  try {
    const response = await fetch('https://gamma-api.polymarket.com/markets', {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('[Polymarket] API error:', response.statusText);
      return [];
    }

    const markets = await response.json();
    const result: PredictionMarket[] = [];

    for (const market of markets) {
      if (market.closed || !market.active) continue;

      const category = categorizeMarket(market.question, categories);
      if (!category) continue;

      let probability = 50;
      if (market.outcomePrices && market.outcomePrices.length > 0) {
        probability = parseFloat(market.outcomePrices[0]) * 100;
      }

      result.push({
        id: market.id || market.conditionId,
        question: market.question,
        category,
        probability,
        americanOdds: probabilityToAmericanOdds(probability),
        source: 'Polymarket',
        url: `https://polymarket.com/event/${market.slug || market.id}`,
        volume: market.volume ? parseFloat(market.volume) : undefined,
        endDate: market.endDate,
        lastUpdated: new Date().toISOString(),
      });
    }

    return result.slice(0, 50);
  } catch (error) {
    console.error('[Polymarket] Error fetching markets:', error);
    return [];
  }
}

/**
 * Fetch markets from Manifold by category
 */
export async function fetchManifoldByCategory(categories: PredictionMarketCategory[]): Promise<PredictionMarket[]> {
  try {
    const response = await fetch('https://api.manifold.markets/v0/markets', {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('[Manifold] API error:', response.statusText);
      return [];
    }

    const markets = await response.json();
    const result: PredictionMarket[] = [];

    for (const market of markets) {
      if (market.isResolved || market.closeTime < Date.now()) continue;

      const category = categorizeMarket(market.question, categories);
      if (!category) continue;

      let probability = 50;
      if (market.probability !== undefined) {
        probability = market.probability * 100;
      }

      result.push({
        id: market.id,
        question: market.question,
        category,
        probability,
        americanOdds: probabilityToAmericanOdds(probability),
        source: 'Manifold',
        url: market.url,
        volume: market.volume,
        endDate: market.closeTime ? new Date(market.closeTime).toISOString() : undefined,
        lastUpdated: new Date().toISOString(),
      });
    }

    return result.slice(0, 50);
  } catch (error) {
    console.error('[Manifold] Error fetching markets:', error);
    return [];
  }
}

/**
 * Fetch all category markets (for Prediction Markets page)
 */
export async function fetchAllCategoryMarkets(): Promise<Record<string, PredictionMarket[]>> {
  const categories: PredictionMarketCategory[] = ['Crypto', 'Politics', 'Sports', 'Fed Decisions', 'Stocks'];

  const [polymarketMarkets, manifoldMarkets] = await Promise.all([
    fetchPolymarketByCategory(categories),
    fetchManifoldByCategory(categories),
  ]);

  const allMarkets = [...polymarketMarkets, ...manifoldMarkets];

  // Group by category
  const grouped: Record<string, PredictionMarket[]> = {};
  for (const category of categories) {
    grouped[category] = allMarkets
      .filter(m => m.category === category)
      .sort((a, b) => (b.volume || 0) - (a.volume || 0))
      .slice(0, 10); // Top 10 per category
  }

  return grouped;
}
