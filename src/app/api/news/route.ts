/**
 * News API Route
 *
 * GET /api/news
 * Fetches sports betting and casino news articles
 *
 * Uses GNews API with 10-minute caching to avoid rate limits
 * Returns cached data if API fails
 */

import { NextResponse } from 'next/server';
import { fetchNewsArticles, getCacheStatus } from '@/lib/newsService';

export async function GET() {
  try {
    const articles = await fetchNewsArticles();
    const cacheStatus = getCacheStatus();

    return NextResponse.json({
      success: true,
      articles,
      count: articles.length,
      cache: cacheStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[News API Route] Error:', error);

    // Return error response with guidance
    return NextResponse.json(
      {
        success: false,
        articles: [],
        count: 0,
        error: error.message || 'Failed to fetch news articles',
        hint: 'Make sure GNEWS_API_KEY is set in your environment variables',
      },
      { status: 500 }
    );
  }
}
