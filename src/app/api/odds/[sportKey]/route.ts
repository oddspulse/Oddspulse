import { NextResponse } from 'next/server';
import { getLiveOdds } from '@/lib/oddsService';
import { MarketType } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { sportKey: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const marketsParam = searchParams.get('markets') || 'moneyline,spread,total';
    const region = searchParams.get('region') || 'us';

    // Parse markets from comma-separated string
    const markets = marketsParam.split(',').filter(m =>
      ['moneyline', 'spread', 'total'].includes(m)
    ) as MarketType[];

    const events = await getLiveOdds(params.sportKey, markets, region);

    return NextResponse.json(events, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
      },
    });
  } catch (error: any) {
    console.error('[API] Error fetching odds:', error);

    // Handle specific error types
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        {
          error: 'API Configuration Error',
          message: error.message,
          hint: 'Add your API key to .env.local'
        },
        { status: 500 }
      );
    }

    if (error.message?.includes('rate limit')) {
      return NextResponse.json(
        {
          error: 'Rate Limit Exceeded',
          message: error.message,
          hint: 'Please wait before making more requests or upgrade your API plan'
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch odds data',
        message: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
