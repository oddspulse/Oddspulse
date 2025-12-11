import { NextResponse } from 'next/server';
import { getAvailableSports } from '@/lib/oddsService';

export async function GET() {
  try {
    const sports = await getAvailableSports();
    return NextResponse.json(sports);
  } catch (error) {
    console.error('Error fetching sports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available sports' },
      { status: 500 }
    );
  }
}
