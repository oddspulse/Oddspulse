import { LiveScore } from './types';

// Environment variables - reuse same API configuration
const API_KEY = process.env.ODDS_API_KEY || '';
const BASE_URL = process.env.ODDS_API_BASE_URL || 'https://api.the-odds-api.com/v4';

// Check if API key is configured
function checkApiKey(): void {
  if (!API_KEY || API_KEY === 'REPLACE_ME') {
    throw new Error(
      'ODDS_API_KEY is not configured. Please add your API key to .env.local'
    );
  }
}

// Log API usage
function logApiCall(endpoint: string): void {
  console.log(`[Scores API] ${endpoint}`);
}

/**
 * Fetch live scores for a specific sport
 *
 * The Odds API /scores endpoint provides:
 * - Live scores for in-progress games
 * - Final scores for completed games
 * - Pre-game status for upcoming games
 */
export async function getLiveScores(sportKey: string): Promise<Map<string, LiveScore>> {
  try {
    checkApiKey();

    const url = `${BASE_URL}/sports/${sportKey}/scores?apiKey=${API_KEY}&daysFrom=1`;

    logApiCall(`GET /sports/${sportKey}/scores`);

    const response = await fetch(url, {
      // Short cache for live games
      next: { revalidate: 15 }
    });

    // Check rate limit headers
    const remaining = response.headers.get('x-requests-remaining');
    if (remaining) {
      console.log(`[Scores API] Remaining requests: ${remaining}`);
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key for scores endpoint');
      }
      if (response.status === 429) {
        throw new Error('Score API rate limit exceeded');
      }
      if (response.status === 404) {
        console.warn(`[Scores API] Sport not found: ${sportKey}`);
        return new Map();
      }
      throw new Error(`Scores API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform to Map<eventId, LiveScore> for quick lookup
    const scoresMap = new Map<string, LiveScore>();

    data.forEach((game: any) => {
      const score = normalizeScore(game, sportKey);
      scoresMap.set(game.id, score);
    });

    return scoresMap;
  } catch (error) {
    console.error('[Scores API] Error fetching scores:', error);
    // Return empty map instead of throwing - scores are optional
    return new Map();
  }
}

/**
 * Normalize score data from The Odds API format to our LiveScore type
 * Handles different sports' score formats and periods
 */
function normalizeScore(game: any, sportKey: string): LiveScore {
  const completed = game.completed || false;
  const scores = game.scores || [];

  // Find home and away scores
  const homeScoreData = scores.find((s: any) => s.name === game.home_team);
  const awayScoreData = scores.find((s: any) => s.name === game.away_team);

  const homeScore = homeScoreData?.score !== undefined ? parseFloat(homeScoreData.score) : null;
  const awayScore = awayScoreData?.score !== undefined ? parseFloat(awayScoreData.score) : null;

  // Determine status
  let status: "pre" | "live" | "final" = "pre";
  if (completed) {
    status = "final";
  } else if (homeScore !== null && awayScore !== null) {
    status = "live";
  }

  // Format period/clock display based on sport
  const { displayClock, periodLabel } = formatGameState(game, sportKey);

  return {
    eventId: game.id,
    sportKey,
    homeTeam: game.home_team,
    awayTeam: game.away_team,
    homeScore,
    awayScore,
    status,
    displayClock,
    periodLabel,
    lastUpdated: game.last_update || new Date().toISOString(),
    completed
  };
}

/**
 * Format game state (period/clock) based on sport type
 * Returns human-readable period label and clock display
 */
function formatGameState(game: any, sportKey: string): { displayClock?: string; periodLabel?: string } {
  // If game hasn't started or is final, no clock needed
  if (game.completed || !game.scores || game.scores.length === 0) {
    return {};
  }

  // The Odds API doesn't always provide detailed clock/period info
  // We'll build what we can from available data

  // For sports with periods/quarters
  if (sportKey.includes('basketball') || sportKey.includes('americanfootball')) {
    // NBA/NFL: Try to extract period from score data
    const period = game.period || '';
    if (period) {
      return {
        periodLabel: formatPeriod(sportKey, period),
        displayClock: formatPeriod(sportKey, period)
      };
    }
  }

  if (sportKey.includes('icehockey')) {
    const period = game.period || '';
    if (period) {
      return {
        periodLabel: `${period} Period`,
        displayClock: `${period} Period`
      };
    }
  }

  if (sportKey.includes('baseball')) {
    const inning = game.period || '';
    if (inning) {
      return {
        periodLabel: `Inning ${inning}`,
        displayClock: `Inning ${inning}`
      };
    }
  }

  if (sportKey.includes('soccer')) {
    const minute = game.time || '';
    if (minute) {
      return {
        periodLabel: `${minute}'`,
        displayClock: `${minute}'`
      };
    }
  }

  // Default: just show "LIVE" if we have scores but no period info
  return {
    displayClock: 'In Progress'
  };
}

/**
 * Format period label based on sport
 */
function formatPeriod(sportKey: string, period: string | number): string {
  if (sportKey.includes('basketball')) {
    return `Q${period}`;
  }
  if (sportKey.includes('americanfootball')) {
    return `Q${period}`;
  }
  return String(period);
}
