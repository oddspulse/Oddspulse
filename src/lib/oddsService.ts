import { LiveEvent, LiveMarket, MarketOutcome, Sport, MarketType, Operator } from './types';
import bookmakerMappings from '@/data/bookmaker-mappings.json';
import operatorsData from '@/data/operators.json';

// Environment variables - loaded securely from .env.local
const API_KEY = process.env.ODDS_API_KEY || '';
const BASE_URL = process.env.ODDS_API_BASE_URL || 'https://api.the-odds-api.com/v4';
const DEFAULT_REGION = process.env.ODDS_API_REGION || 'us';
const DEFAULT_FORMAT = process.env.ODDS_API_FORMAT || 'american';

// Check if API key is configured
function checkApiKey(): void {
  if (!API_KEY || API_KEY === 'REPLACE_ME') {
    throw new Error(
      'ODDS_API_KEY is not configured. Please add your API key to .env.local'
    );
  }
}

// Log API usage (without exposing the key)
function logApiCall(endpoint: string, remainingRequests?: number): void {
  console.log(`[Odds API] ${endpoint}`);
  if (remainingRequests !== undefined) {
    console.log(`[Odds API] Remaining requests: ${remainingRequests}`);
  }
}

// Sport keys for major sports
export const SPORT_KEYS = {
  NFL: 'americanfootball_nfl',
  NBA: 'basketball_nba',
  NHL: 'icehockey_nhl',
  MLB: 'baseball_mlb',
  EPL: 'soccer_epl',
  UCL: 'soccer_uefa_champs_league',
  UFC: 'mma_mixed_martial_arts',
  TENNIS_ATP: 'tennis_atp',
  GOLF_PGA: 'golf_pga_championship',
};

// Get available sports from The Odds API
export async function getAvailableSports(): Promise<Sport[]> {
  try {
    checkApiKey();

    const url = `${BASE_URL}/sports?apiKey=${API_KEY}`;
    logApiCall('GET /sports');

    const response = await fetch(url);

    // Check rate limit headers
    const remaining = response.headers.get('x-requests-remaining');
    if (remaining) {
      logApiCall('Sports list', parseInt(remaining));
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your ODDS_API_KEY in .env.local');
      }
      if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please wait before making more requests.');
      }
      throw new Error(`API error: ${response.statusText}`);
    }

    const sports = await response.json();
    return sports;
  } catch (error) {
    console.error('[Odds API] Error fetching sports:', error);
    throw error;
  }
}

// Fetch live odds for a specific sport
export async function getLiveOdds(
  sportKey: string,
  markets: MarketType[] = ['moneyline', 'spread', 'total'],
  region: string = DEFAULT_REGION
): Promise<LiveEvent[]> {
  try {
    checkApiKey();

    const url = `${BASE_URL}/sports/${sportKey}/odds?apiKey=${API_KEY}&regions=${region}&markets=h2h,spreads,totals&oddsFormat=${DEFAULT_FORMAT}`;

    logApiCall(`GET /sports/${sportKey}/odds`);

    const response = await fetch(url, {
      // Cache for 30 seconds to avoid hitting API limits
      next: { revalidate: 30 }
    });

    // Check rate limit headers
    const remaining = response.headers.get('x-requests-remaining');
    const used = response.headers.get('x-requests-used');
    if (remaining) {
      logApiCall(`Odds for ${sportKey}`, parseInt(remaining));
      console.log(`[Odds API] Requests used: ${used || 'unknown'}`);
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your ODDS_API_KEY in .env.local');
      }
      if (response.status === 429) {
        throw new Error('API rate limit exceeded. You have used your monthly quota. Upgrade your plan or wait until next month.');
      }
      if (response.status === 404) {
        console.warn(`[Odds API] Sport not found: ${sportKey}`);
        return [];
      }
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Get operators for mapping
    const operators = operatorsData as Operator[];

    // Transform API response to our LiveEvent format
    const events: LiveEvent[] = data.map((game: any) => {
      const isLive = game.commence_time ? new Date(game.commence_time) <= new Date() : false;

      // Build markets from bookmaker data
      const eventMarkets: LiveMarket[] = [];

      // Process each market type
      if (markets.includes('moneyline')) {
        const moneylineOutcomes = processMoneylineMarket(game, operators);
        if (moneylineOutcomes.length > 0) {
          eventMarkets.push({
            type: 'moneyline',
            outcomes: moneylineOutcomes,
          });
        }
      }

      if (markets.includes('spread')) {
        const spreadOutcomes = processSpreadMarket(game, operators);
        if (spreadOutcomes.length > 0) {
          eventMarkets.push({
            type: 'spread',
            outcomes: spreadOutcomes,
          });
        }
      }

      if (markets.includes('total')) {
        const totalOutcomes = processTotalMarket(game, operators);
        if (totalOutcomes.length > 0) {
          eventMarkets.push({
            type: 'total',
            outcomes: totalOutcomes,
          });
        }
      }

      return {
        id: game.id,
        sport: sportKey,
        sportKey: game.sport_key,
        league: game.sport_title || sportKey,
        homeTeam: game.home_team,
        awayTeam: game.away_team,
        startTime: game.commence_time,
        isLive,
        markets: eventMarkets,
      };
    });

    return events;
  } catch (error) {
    console.error('[Odds API] Error fetching live odds:', error);
    // Re-throw the error so it can be handled by the caller
    throw error;
  }
}

// Process moneyline (h2h) market
function processMoneylineMarket(game: any, operators: any[]): MarketOutcome[] {
  const outcomes: MarketOutcome[] = [];

  if (!game.bookmakers) return outcomes;

  game.bookmakers.forEach((bookmaker: any) => {
    // Find operator mapping
    const mapping = bookmakerMappings.find(m => m.apiBookmakerKey === bookmaker.key);
    if (!mapping) return;

    // Find the operator
    const operator = operators.find(op => op.id === mapping.operatorId);
    if (!operator) return;

    // Find h2h market
    const h2hMarket = bookmaker.markets?.find((m: any) => m.key === 'h2h');
    if (!h2hMarket) return;

    // Add home and away outcomes
    h2hMarket.outcomes.forEach((outcome: any) => {
      const label = outcome.name === game.home_team ? 'Home' : 'Away';
      outcomes.push({
        label: `${label} (${outcome.name})`,
        operatorId: operator.id,
        operatorName: operator.name,
        odds: outcome.price,
        price: americanToDecimal(outcome.price),
        affiliateUrl: operator.affiliateUrl,
      });
    });
  });

  return outcomes;
}

// Process spread market
function processSpreadMarket(game: any, operators: any[]): MarketOutcome[] {
  const outcomes: MarketOutcome[] = [];

  if (!game.bookmakers) return outcomes;

  game.bookmakers.forEach((bookmaker: any) => {
    const mapping = bookmakerMappings.find(m => m.apiBookmakerKey === bookmaker.key);
    if (!mapping) return;

    const operator = operators.find(op => op.id === mapping.operatorId);
    if (!operator) return;

    const spreadMarket = bookmaker.markets?.find((m: any) => m.key === 'spreads');
    if (!spreadMarket) return;

    spreadMarket.outcomes.forEach((outcome: any) => {
      const label = outcome.name === game.home_team ? 'Home' : 'Away';
      outcomes.push({
        label: `${label} ${outcome.point > 0 ? '+' : ''}${outcome.point}`,
        operatorId: operator.id,
        operatorName: operator.name,
        odds: outcome.price,
        price: americanToDecimal(outcome.price),
        point: outcome.point,
        affiliateUrl: operator.affiliateUrl,
      });
    });
  });

  return outcomes;
}

// Process total (over/under) market
function processTotalMarket(game: any, operators: any[]): MarketOutcome[] {
  const outcomes: MarketOutcome[] = [];

  if (!game.bookmakers) return outcomes;

  game.bookmakers.forEach((bookmaker: any) => {
    const mapping = bookmakerMappings.find(m => m.apiBookmakerKey === bookmaker.key);
    if (!mapping) return;

    const operator = operators.find(op => op.id === mapping.operatorId);
    if (!operator) return;

    const totalMarket = bookmaker.markets?.find((m: any) => m.key === 'totals');
    if (!totalMarket) return;

    totalMarket.outcomes.forEach((outcome: any) => {
      outcomes.push({
        label: `${outcome.name} ${outcome.point}`,
        operatorId: operator.id,
        operatorName: operator.name,
        odds: outcome.price,
        price: americanToDecimal(outcome.price),
        point: outcome.point,
        affiliateUrl: operator.affiliateUrl,
      });
    });
  });

  return outcomes;
}

// Helper: Convert American odds to decimal
function americanToDecimal(american: number): number {
  if (american > 0) {
    return (american / 100) + 1;
  } else {
    return (100 / Math.abs(american)) + 1;
  }
}

// Helper: Format American odds for display
export function formatAmericanOdds(odds: number): string {
  if (odds > 0) {
    return `+${odds}`;
  }
  return `${odds}`;
}

// Helper: Find best odds for each outcome
export function findBestOdds(outcomes: MarketOutcome[]): Map<string, MarketOutcome> {
  const bestOdds = new Map<string, MarketOutcome>();

  outcomes.forEach(outcome => {
    const currentBest = bestOdds.get(outcome.label);
    if (!currentBest || outcome.odds > currentBest.odds) {
      bestOdds.set(outcome.label, outcome);
    }
  });

  return bestOdds;
}
