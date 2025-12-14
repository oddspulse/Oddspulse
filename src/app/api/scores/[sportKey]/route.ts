import { NextRequest, NextResponse } from 'next/server';
import { getLiveScores } from '@/lib/scoresService';
import { LiveScore } from '@/lib/types';

/**
 * Scores API Endpoint
 *
 * Fetches live scores for a specific sport with smart caching:
 * - LIVE games: 15-second cache TTL (frequent updates)
 * - FINAL games: 5-minute cache TTL (scores don't change)
 * - PRE games: 2-minute cache TTL (minimal updates needed)
 *
 * This prevents excessive API calls while keeping scores fresh
 */

// In-memory cache per sport
const scoresCache = new Map<string, {
  data: Map<string, LiveScore>;
  timestamp: number;
  ttl: number;
}>();

// Cache TTLs (in milliseconds)
const LIVE_CACHE_TTL = 15 * 1000; // 15 seconds for live games
const FINAL_CACHE_TTL = 5 * 60 * 1000; // 5 minutes for final games
const PRE_CACHE_TTL = 2 * 60 * 1000; // 2 minutes for pre-game

export async function GET(
  request: NextRequest,
  { params }: { params: { sportKey: string } }
) {
  try {
    const { sportKey } = params;

    if (!sportKey) {
      return NextResponse.json(
        { error: 'Sport key is required' },
        { status: 400 }
      );
    }

    const now = Date.now();

    // Check cache
    const cached = scoresCache.get(sportKey);
    if (cached && (now - cached.timestamp) < cached.ttl) {
      console.log(`[Scores API] Serving cached scores for ${sportKey} (age: ${Math.floor((now - cached.timestamp) / 1000)}s)`);

      return NextResponse.json({
        sportKey,
        scores: Array.from(cached.data.values()),
        fromCache: true,
        cacheAge: Math.floor((now - cached.timestamp) / 1000),
      });
    }

    // Cache miss - fetch fresh scores
    console.log(`[Scores API] Fetching fresh scores for ${sportKey}...`);

    const scoresMap = await getLiveScores(sportKey);

    // Determine appropriate TTL based on game states
    let ttl = PRE_CACHE_TTL;
    const scores = Array.from(scoresMap.values());

    if (scores.some(s => s.status === 'live')) {
      // If any games are live, use short cache
      ttl = LIVE_CACHE_TTL;
    } else if (scores.every(s => s.status === 'final')) {
      // If all games are final, use long cache
      ttl = FINAL_CACHE_TTL;
    }

    // Update cache
    scoresCache.set(sportKey, {
      data: scoresMap,
      timestamp: now,
      ttl
    });

    return NextResponse.json({
      sportKey,
      scores,
      fromCache: false,
      cacheAge: 0,
      ttl: Math.floor(ttl / 1000), // TTL in seconds
    });

  } catch (error) {
    console.error('[Scores API] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch scores',
        message: error instanceof Error ? error.message : 'Unknown error',
        scores: [], // Return empty array to prevent UI breaking
      },
      { status: 200 } // Return 200 so UI doesn't error, just shows no scores
    );
  }
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
