import { NextResponse } from 'next/server';
import { promoService } from '@/lib/promoService';
import { getAllOperators } from '@/lib/operatorsDb';
import { Operator } from '@/lib/types';

/**
 * Promo API Endpoint
 *
 * Returns latest operator promos with smart caching
 * - Cache TTL: 6 hours (21600 seconds)
 * - Frontend can refresh frequently, backend controls external calls
 * - Merges affiliate feed data with manual fallback
 */

// In-memory cache
let cachedData: any = null;
let cacheTimestamp: number = 0;

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
const CACHE_TTL_SECONDS = 6 * 60 * 60; // 6 hours in seconds

export async function GET() {
  try {
    const now = Date.now();
    const cacheAge = now - cacheTimestamp;
    const isCacheValid = cachedData && cacheAge < CACHE_TTL_MS;

    // Return cached data if still valid
    if (isCacheValid) {
      console.log(`[Promos API] Serving cached data (age: ${Math.floor(cacheAge / 1000 / 60)}min)`);

      return NextResponse.json({
        ...cachedData,
        fromCache: true,
        cacheAge: Math.floor(cacheAge / 1000), // age in seconds
      });
    }

    // Cache miss or expired - fetch fresh data
    console.log('[Promos API] Cache miss or expired, fetching fresh promo data...');

    // Get all operators from database
    const operators = getAllOperators();

    // Fetch latest promos from affiliate feeds
    const feedPromos = await promoService.getLatestOperatorPromos();

    // Merge with manual data (feed data takes precedence)
    const mergedPromos = promoService.mergeWithManualData(feedPromos, operators);

    // Build response with full operator data + merged promos
    const enrichedOperators = operators.map((op: Operator) => {
      const promo = mergedPromos[op.id];

      return {
        id: op.id,
        name: op.name,
        brandLogoUrl: op.brandLogoUrl,
        logo: op.logo, // Auto-mapped logo from /public/logos/
        regionTags: op.regionTags,
        productTags: op.productTags,
        affiliateUrl: op.affiliateUrl,
        rtpInfo: op.rtpInfo,
        notes: op.notes,
        bonusHeadline: promo?.bonusHeadline || op.bonusHeadline,
        detailedOffer: promo?.detailedOffer || op.detailedOffer,
        termsUrl: promo?.termsUrl,
        promoSource: promo?.source || 'manual',
        promoLastUpdated: promo?.lastUpdated || op.promoLastUpdated || new Date().toISOString(),
      };
    });

    // Build response
    const response = {
      generatedAt: new Date().toISOString(),
      ttlSeconds: CACHE_TTL_SECONDS,
      totalOperators: enrichedOperators.length,
      operators: enrichedOperators,
      fromCache: false,
    };

    // Update cache
    cachedData = response;
    cacheTimestamp = now;

    console.log(`[Promos API] Fresh data fetched and cached (${enrichedOperators.length} operators)`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Promos API] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch promo data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Force dynamic rendering (no static generation)
export const dynamic = 'force-dynamic';
