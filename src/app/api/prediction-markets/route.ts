import { NextResponse } from 'next/server';
import { fetchAllCategoryMarkets } from '@/lib/predictionMarketsService';

export async function GET() {
  try {
    const marketsByCategory = await fetchAllCategoryMarkets();

    const totalCount = Object.values(marketsByCategory).reduce(
      (sum, markets) => sum + markets.length,
      0
    );

    return NextResponse.json({
      success: true,
      categories: marketsByCategory,
      totalCount,
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
