import { NextResponse } from 'next/server';

// Direct server-side fetchers
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
    const [polymarketData, manifoldData] = await Promise.all([
      fetchPolymarketDirect(),
      fetchManifoldDirect(),
    ]);

    return NextResponse.json({
      success: true,
      categories: {
        polymarket: polymarketData.length,
        manifold: manifoldData.length,
      },
      totalCount: polymarketData.length + manifoldData.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching prediction markets:', error);
    return NextResponse.json(
      {
        success: false,
        categories: {},
        error: error.message || 'Failed to fetch prediction markets',
      },
      { status: 500 }
    );
  }
}
