import { NextResponse } from 'next/server';
import { getAllProviders } from '@/lib/providersDb';

export async function GET() {
  try {
    const providers = getAllProviders();
    return NextResponse.json(providers);
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}
