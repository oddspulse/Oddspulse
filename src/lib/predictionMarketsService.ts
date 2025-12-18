/**
 * Prediction Markets Service
 *
 * Fetches data from Polymarket and Manifold prediction markets via server-side proxies
 * Uses 2-stage filtering: exclusion first, then inclusion
 * Normalizes to common format and validates odds
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

// EXCLUSION keywords (remove these first)
const EXCLUSION_KEYWORDS = {
  Politics: [
    'president', 'election', 'poll', 'senate', 'congress', 'trump', 'biden',
    'liberal', 'conservative', 'prime minister', 'parliament', 'governor',
    'kamala', 'harris', 'desantis', 'republican', 'democrat', 'vote',
    'white house', 'political', 'campaign', 'impeach',
  ],
  Fed: [
    'fed', 'fomc', 'rate cut', 'rate hike', 'cpi', 'inflation', 'powell',
    'federal reserve', 'interest rate', 'monetary policy', 'recession',
  ],
  Crypto: [
    'btc', 'bitcoin', 'eth', 'ethereum', 'sol', 'solana', 'crypto', 'cryptocurrency',
    'blockchain', 'defi', 'nft', 'xrp', 'dogecoin', 'cardano', 'binance',
  ],
  Stocks: [
    'stock', 'shares', 'earnings', 'sp500', 's&p 500', 'nasdaq', 'dow jones', 'dow',
    'tsla', 'tesla', 'aapl', 'apple', 'nvda', 'nvidia', 'msft', 'microsoft',
    'amzn', 'amazon', 'googl', 'google', 'meta', 'fb',
  ],
};

// INCLUSION keywords for sports (must have at least one)
const SPORTS_INCLUSION = {
  leagues: [
    'nba', 'nfl', 'nhl', 'mlb', 'ufc', 'mma', 'atp', 'wta', 'pga',
    'mls', 'epl', 'premier league', 'la liga', 'serie a', 'bundesliga',
    'champions league', 'uefa', 'f1', 'formula 1', 'nascar', 'world cup',
  ],
  genericSports: [
    'vs', 'vs.', 'match', 'game', 'fight', 'tournament', 'playoffs',
    'final', 'championship', 'season', 'super bowl', 'world series',
    'stanley cup', 'bowl game',
  ],
  teams: [
    // NBA
    'lakers', 'celtics', 'warriors', 'heat', 'raptors', 'nets', 'knicks',
    'bucks', 'suns', 'mavericks', 'nuggets', 'clippers', '76ers', 'bulls',
    // NFL
    'chiefs', 'eagles', 'bills', '49ers', 'cowboys', 'packers', 'patriots',
    'ravens', 'bengals', 'rams', 'chargers',
    // NHL
    'maple leafs', 'canadiens', 'bruins', 'lightning', 'avalanche', 'oilers',
    // MLB
    'yankees', 'red sox', 'dodgers', 'astros', 'mets', 'braves',
  ],
};

/**
 * 2-STAGE FILTER: Exclusion first, then inclusion
 */
function isSportsMarket(question: string, tags?: string[]): boolean {
  const lowerQuestion = question.toLowerCase();

  // Check tags first if available (most reliable)
  if (tags && Array.isArray(tags)) {
    const lowerTags = tags.map(t => t.toLowerCase());
    // Exclude non-sports tags
    if (lowerTags.some(t => ['politics', 'crypto', 'economics', 'finance'].includes(t))) {
      return false;
    }
    // Include sports tags
    if (lowerTags.some(t => ['sports', 'sport', 'nba', 'nfl', 'nhl', 'mlb', 'ufc'].includes(t))) {
      return true;
    }
  }

  // STAGE 1: HARD EXCLUSION - if contains any of these, it's NOT sports
  const allExclusionKeywords = [
    ...EXCLUSION_KEYWORDS.Politics,
    ...EXCLUSION_KEYWORDS.Fed,
    ...EXCLUSION_KEYWORDS.Crypto,
    ...EXCLUSION_KEYWORDS.Stocks,
  ];

  for (const keyword of allExclusionKeywords) {
    if (lowerQuestion.includes(keyword)) {
      return false; // Hard exclusion
    }
  }

  // STAGE 2: HARD INCLUSION - must have at least one sports indicator
  const allInclusionKeywords = [
    ...SPORTS_INCLUSION.leagues,
    ...SPORTS_INCLUSION.genericSports,
    ...SPORTS_INCLUSION.teams,
  ];

  for (const keyword of allInclusionKeywords) {
    if (lowerQuestion.includes(keyword)) {
      return true; // Sports confirmed
    }
  }

  return false; // No sports indicators found
}

/**
 * Categorize market with proper 2-stage filtering
 */
function categorizeMarket(question: string, tags?: string[], targetCategory?: PredictionMarketCategory): PredictionMarketCategory | null {
  const lowerQuestion = question.toLowerCase();

  // Check tags first
  if (tags && Array.isArray(tags)) {
    const lowerTags = tags.map(t => t.toLowerCase());
    if (lowerTags.includes('sports') || lowerTags.includes('sport')) {
      if (!targetCategory || targetCategory === 'Sports') {
        return isSportsMarket(question, tags) ? 'Sports' : null;
      }
    }
    if (lowerTags.includes('politics')) return 'Politics';
    if (lowerTags.includes('crypto') || lowerTags.includes('cryptocurrency')) return 'Crypto';
  }

  // If targeting sports specifically, use the sports filter
  if (targetCategory === 'Sports') {
    return isSportsMarket(question, tags) ? 'Sports' : null;
  }

  // For all categories, check in order (avoiding sports for now)
  if (EXCLUSION_KEYWORDS.Politics.some(k => lowerQuestion.includes(k))) return 'Politics';
  if (EXCLUSION_KEYWORDS.Crypto.some(k => lowerQuestion.includes(k))) return 'Crypto';
  if (EXCLUSION_KEYWORDS.Fed.some(k => lowerQuestion.includes(k))) return 'Fed Decisions';
  if (EXCLUSION_KEYWORDS.Stocks.some(k => lowerQuestion.includes(k))) return 'Stocks';

  // Finally check sports
  if (isSportsMarket(question, tags)) return 'Sports';

  return null;
}

/**
 * Convert probability to American odds with validation
 */
function probabilityToAmericanOdds(probability: number): number {
  // Normalize probability (handle both 0-1 and 0-100 formats)
  let p = probability > 1 ? probability / 100 : probability;

  // Validate: must be between 0.01 and 0.99 (avoid extremes)
  if (p <= 0.01 || p >= 0.99) {
    return 0; // Invalid - too extreme
  }

  // Convert to American odds
  if (p >= 0.5) {
    return -Math.round((p / (1 - p)) * 100);
  } else {
    return Math.round(((1 - p) / p) * 100);
  }
}

/**
 * Fetch sports markets from Polymarket via proxy
 */
export async function fetchPolymarketSports(): Promise<PredictionMarket[]> {
  try {
    console.log('[Polymarket] Fetching via proxy...');

    const response = await fetch('/api/prediction/polymarket?category=sports');

    if (!response.ok) {
      console.error('[Polymarket] Proxy error:', response.statusText);
      return [];
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.items)) {
      console.error('[Polymarket] Invalid proxy response');
      return [];
    }

    const markets = data.items;
    const sportsMarkets: PredictionMarket[] = [];

    let totalProcessed = 0;
    let includedSports = 0;
    let excludedNonSports = 0;

    for (const market of markets) {
      totalProcessed++;

      // Skip if not active or closed
      if (market.closed || !market.active) {
        excludedNonSports++;
        continue;
      }

      // Apply sports filter
      const tags = market.tags || market.cate || market.category;
      const isSports = isSportsMarket(market.question, tags);

      if (!isSports) {
        excludedNonSports++;
        continue;
      }

      includedSports++;

      // Extract probability
      let probability = 50; // Default
      if (market.outcomePrices && market.outcomePrices.length > 0) {
        probability = parseFloat(market.outcomePrices[0]) * 100;
      } else if (market.clobTokenIds && market.tokens?.[0]?.price) {
        probability = parseFloat(market.tokens[0].price) * 100;
      }

      const americanOdds = probabilityToAmericanOdds(probability);

      // Skip if odds conversion failed (too extreme)
      if (americanOdds === 0) {
        excludedNonSports++;
        continue;
      }

      sportsMarkets.push({
        id: market.id || market.conditionId,
        question: market.question,
        category: 'Sports',
        probability,
        americanOdds,
        source: 'Polymarket',
        url: `https://polymarket.com/event/${market.slug || market.id}`,
        volume: market.volume ? parseFloat(market.volume) : undefined,
        endDate: market.endDate,
        lastUpdated: new Date().toISOString(),
      });
    }

    console.log(`[Polymarket] Processed: ${totalProcessed}, Included: ${includedSports}, Excluded: ${excludedNonSports}`);
    console.log(`[Polymarket] Sample sports:`, sportsMarkets.slice(0, 5).map(m => m.question));

    return sportsMarkets.slice(0, 20);
  } catch (error) {
    console.error('[Polymarket] Error:', error);
    return [];
  }
}

/**
 * Fetch sports markets from Manifold via proxy
 */
export async function fetchManifoldSports(): Promise<PredictionMarket[]> {
  try {
    console.log('[Manifold] Fetching via proxy...');

    const response = await fetch('/api/prediction/manifold?category=sports');

    if (!response.ok) {
      console.error('[Manifold] Proxy error:', response.statusText);
      return [];
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.items)) {
      console.error('[Manifold] Invalid proxy response');
      return [];
    }

    const markets = data.items;
    const sportsMarkets: PredictionMarket[] = [];

    let totalProcessed = 0;
    let includedSports = 0;
    let excludedNonSports = 0;

    for (const market of markets) {
      totalProcessed++;

      // Skip if resolved or closed
      if (market.isResolved || (market.closeTime && market.closeTime < Date.now())) {
        excludedNonSports++;
        continue;
      }

      // Apply sports filter
      const tags = market.tags || market.groupSlugs;
      const isSports = isSportsMarket(market.question, tags);

      if (!isSports) {
        excludedNonSports++;
        continue;
      }

      includedSports++;

      // Extract probability
      let probability = 50;
      if (market.probability !== undefined) {
        probability = market.probability * 100;
      } else if (market.pool && market.pool.YES && market.pool.NO) {
        const yesPool = market.pool.YES;
        const noPool = market.pool.NO;
        probability = (yesPool / (yesPool + noPool)) * 100;
      }

      const americanOdds = probabilityToAmericanOdds(probability);

      // Skip if odds conversion failed
      if (americanOdds === 0) {
        excludedNonSports++;
        continue;
      }

      sportsMarkets.push({
        id: market.id,
        question: market.question,
        category: 'Sports',
        probability,
        americanOdds,
        source: 'Manifold',
        url: market.url,
        volume: market.volume,
        endDate: market.closeTime ? new Date(market.closeTime).toISOString() : undefined,
        lastUpdated: new Date().toISOString(),
      });
    }

    console.log(`[Manifold] Processed: ${totalProcessed}, Included: ${includedSports}, Excluded: ${excludedNonSports}`);
    console.log(`[Manifold] Sample sports:`, sportsMarkets.slice(0, 5).map(m => m.question));

    return sportsMarkets.slice(0, 20);
  } catch (error) {
    console.error('[Manifold] Error:', error);
    return [];
  }
}

/**
 * Fetch markets by category (for Prediction Markets page)
 */
export async function fetchPolymarketByCategory(categories: PredictionMarketCategory[]): Promise<PredictionMarket[]> {
  try {
    const response = await fetch('/api/prediction/polymarket');
    if (!response.ok) return [];

    const data = await response.json();
    if (!data.success || !Array.isArray(data.items)) return [];

    const result: PredictionMarket[] = [];

    for (const market of data.items) {
      if (market.closed || !market.active) continue;

      const tags = market.tags || market.category;
      const category = categorizeMarket(market.question, tags);

      if (!category || !categories.includes(category)) continue;

      let probability = 50;
      if (market.outcomePrices && market.outcomePrices.length > 0) {
        probability = parseFloat(market.outcomePrices[0]) * 100;
      }

      const americanOdds = probabilityToAmericanOdds(probability);
      if (americanOdds === 0) continue;

      result.push({
        id: market.id || market.conditionId,
        question: market.question,
        category,
        probability,
        americanOdds,
        source: 'Polymarket',
        url: `https://polymarket.com/event/${market.slug || market.id}`,
        volume: market.volume ? parseFloat(market.volume) : undefined,
        endDate: market.endDate,
        lastUpdated: new Date().toISOString(),
      });
    }

    return result.slice(0, 50);
  } catch (error) {
    console.error('[Polymarket] Category fetch error:', error);
    return [];
  }
}

/**
 * Fetch markets by category from Manifold
 */
export async function fetchManifoldByCategory(categories: PredictionMarketCategory[]): Promise<PredictionMarket[]> {
  try {
    const response = await fetch('/api/prediction/manifold');
    if (!response.ok) return [];

    const data = await response.json();
    if (!data.success || !Array.isArray(data.items)) return [];

    const result: PredictionMarket[] = [];

    for (const market of data.items) {
      if (market.isResolved || (market.closeTime && market.closeTime < Date.now())) continue;

      const tags = market.tags || market.groupSlugs;
      const category = categorizeMarket(market.question, tags);

      if (!category || !categories.includes(category)) continue;

      let probability = 50;
      if (market.probability !== undefined) {
        probability = market.probability * 100;
      }

      const americanOdds = probabilityToAmericanOdds(probability);
      if (americanOdds === 0) continue;

      result.push({
        id: market.id,
        question: market.question,
        category,
        probability,
        americanOdds,
        source: 'Manifold',
        url: market.url,
        volume: market.volume,
        endDate: market.closeTime ? new Date(market.closeTime).toISOString() : undefined,
        lastUpdated: new Date().toISOString(),
      });
    }

    return result.slice(0, 50);
  } catch (error) {
    console.error('[Manifold] Category fetch error:', error);
    return [];
  }
}

/**
 * Fetch all category markets
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
      .slice(0, 10);
  }

  return grouped;
}
