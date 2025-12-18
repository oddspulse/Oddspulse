import { NextResponse } from 'next/server';
import { fetchPolymarketSports, fetchManifoldSports } from '@/lib/predictionMarketsService';

export async function GET() {
  try {
    // Fetch sports markets from both sources in parallel
    const [polymarketMarkets, manifoldMarkets] = await Promise.all([
      fetchPolymarketSports(),
      fetchManifoldSports(),
    ]);

    const allMarkets = [...polymarketMarkets, ...manifoldMarkets];

    // Sort by volume (if available)
    allMarkets.sort((a, b) => (b.volume || 0) - (a.volume || 0));

    return NextResponse.json({
      success: true,
      markets: allMarkets,
      count: allMarkets.length,
      sources: {
        polymarket: polymarketMarkets.length,
        manifold: manifoldMarkets.length,
      },
    });
  } catch (error: any) {
    console.error('[API] Error fetching prediction markets:', error);
    return NextResponse.json(
      {
        success: false,
        markets: [],
        error: error.message || 'Failed to fetch prediction markets',
      },
      { status: 500 }
    );
  }
}
