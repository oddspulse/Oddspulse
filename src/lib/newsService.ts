/**
 * News Service - Fetch sports betting and casino news
 *
 * Uses GNews API to fetch relevant articles
 * Implements caching to avoid rate limits and improve performance
 */

export type NewsArticle = {
  id: string;
  title: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  description?: string;
};

const GNEWS_API_KEY = process.env.GNEWS_API_KEY || '';
const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

// Keywords for sports betting and casino news
const KEYWORDS = [
  'sports betting',
  'casino',
  'sportsbook',
  'online casino',
  'betting odds',
].join(' OR ');

// In-memory cache
interface CacheEntry {
  articles: NewsArticle[];
  timestamp: number;
  ttl: number;
}

let newsCache: CacheEntry | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Check if API key is configured
 */
function checkApiKey(): void {
  if (!GNEWS_API_KEY || GNEWS_API_KEY === '') {
    throw new Error('GNEWS_API_KEY is not configured. Please add it to .env.local');
  }
}

/**
 * Check if cached data is still valid
 */
function isCacheValid(): boolean {
  if (!newsCache) return false;
  const now = Date.now();
  return (now - newsCache.timestamp) < newsCache.ttl;
}

/**
 * Normalize GNews API response to our NewsArticle format
 */
function normalizeArticle(article: any): NewsArticle {
  return {
    id: article.url, // Use URL as unique ID
    title: article.title,
    source: article.source.name,
    url: article.url,
    imageUrl: article.image || undefined,
    publishedAt: article.publishedAt,
    description: article.description || undefined,
  };
}

/**
 * Fetch news articles from GNews API
 */
export async function fetchNewsArticles(): Promise<NewsArticle[]> {
  try {
    checkApiKey();

    // Return cached data if valid
    if (isCacheValid() && newsCache) {
      console.log('[News API] Returning cached articles');
      return newsCache.articles;
    }

    console.log('[News API] Fetching fresh articles from GNews');

    const url = `${GNEWS_BASE_URL}/search?q=${encodeURIComponent(KEYWORDS)}&lang=en&country=us&max=20&apikey=${GNEWS_API_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 600 }, // Revalidate every 10 minutes
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid GNews API key');
      }
      if (response.status === 429) {
        throw new Error('GNews API rate limit exceeded');
      }
      throw new Error(`GNews API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Normalize articles
    const articles: NewsArticle[] = data.articles?.map(normalizeArticle) || [];

    // Update cache
    newsCache = {
      articles,
      timestamp: Date.now(),
      ttl: CACHE_TTL,
    };

    console.log(`[News API] Cached ${articles.length} articles`);

    return articles;
  } catch (error) {
    console.error('[News API] Error fetching news:', error);

    // Return cached data if available, even if expired
    if (newsCache && newsCache.articles.length > 0) {
      console.log('[News API] Returning stale cache due to error');
      return newsCache.articles;
    }

    // Return empty array as fallback
    return [];
  }
}

/**
 * Get cache status for debugging
 */
export function getCacheStatus() {
  if (!newsCache) {
    return { cached: false, age: 0, articles: 0 };
  }

  const age = Math.floor((Date.now() - newsCache.timestamp) / 1000);
  return {
    cached: true,
    age,
    articles: newsCache.articles.length,
    valid: isCacheValid(),
  };
}
