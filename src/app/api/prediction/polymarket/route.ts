import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';

  try {
    console.log('[Polymarket API] Fetching markets, category:', category);

    const response = await fetch('https://gamma-api.polymarket.com/markets', {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('[Polymarket API] HTTP error:', response.status, response.statusText);
      return NextResponse.json({
        success: false,
        items: [],
        error: `Polymarket API returned ${response.status}`,
      });
    }

    const rawData = await response.json();
    console.log('[Polymarket API] Received', rawData?.length || 0, 'markets');

    if (!Array.isArray(rawData)) {
      console.error('[Polymarket API] Invalid response shape, expected array');
      return NextResponse.json({
        success: false,
        items: [],
        error: 'Invalid response format',
      });
    }

    // Return raw data - filtering will happen in the service layer
    return NextResponse.json({
      success: true,
      items: rawData,
      count: rawData.length,
    });
  } catch (error: any) {
    console.error('[Polymarket API] Fetch error:', error.message);
    return NextResponse.json({
      success: false,
      items: [],
      error: error.message,
    });
  }
}
