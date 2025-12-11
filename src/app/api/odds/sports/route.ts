import { NextResponse } from 'next/server';
import { getAvailableSports } from '@/lib/oddsService';

export async function GET() {
  try {
    const sports = await getAvailableSports();
    return NextResponse.json(sports);
  } catch (error: any) {
    console.error('[API] Error fetching sports:', error);

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
          message: error.message
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch available sports',
        message: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
