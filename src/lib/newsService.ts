/**
 * News Service - Fetch sports betting and casino news
 *
 * Aggregates articles from multiple news APIs:
 * - GNews API
 * - NewsAPI.org
 *
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

// API Configuration
const GNEWS_API_KEY = process.env.GNEWS_API_KEY || '';
const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

const NEWSAPI_KEY = process.env.NEWSAPI_KEY || '';
const NEWSAPI_BASE_URL = 'https://newsapi.org/v2';

// Keywords for sports betting news - focused on major sports
const KEYWORDS = [
  'NFL betting odds',
  'NBA betting odds',
  'NHL betting odds',
  'MLB betting odds',
  'UFC betting odds',
  'football betting',
  'basketball betting',
  'hockey betting',
  'baseball betting',
  'point spread',
  'moneyline odds',
  'over under betting',
];

// In-memory cache
interface CacheEntry {
  articles: NewsArticle[];
  timestamp: number;
  ttl: number;
}

let newsCache: CacheEntry | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes - refresh every half hour for daily updates

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
function normalizeGNewsArticle(article: any): NewsArticle {
  return {
    id: article.url,
    title: article.title,
    source: article.source?.name || 'Unknown',
    url: article.url,
    imageUrl: article.image || undefined,
    publishedAt: article.publishedAt,
    description: article.description || undefined,
  };
}

/**
 * Normalize NewsAPI.org response to our NewsArticle format
 */
function normalizeNewsAPIArticle(article: any): NewsArticle {
  return {
    id: article.url,
    title: article.title,
    source: article.source?.name || 'Unknown',
    url: article.url,
    imageUrl: article.urlToImage || undefined,
    publishedAt: article.publishedAt,
    description: article.description || undefined,
  };
}

/**
 * Fetch articles from GNews API
 */
async function fetchFromGNews(): Promise<NewsArticle[]> {
  if (!GNEWS_API_KEY) {
    console.log('[GNews] API key not configured, skipping');
    return [];
  }

  try {
    const query = KEYWORDS.join(' OR ');
    const url = `${GNEWS_BASE_URL}/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=100&sortby=publishedAt&apikey=${GNEWS_API_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Revalidate every 30 minutes
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
    const articles = data.articles?.map(normalizeGNewsArticle) || [];

    console.log(`[GNews] Fetched ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error('[GNews] Error fetching articles:', error);
    return [];
  }
}

/**
 * Fetch articles from NewsAPI.org
 */
async function fetchFromNewsAPI(): Promise<NewsArticle[]> {
  if (!NEWSAPI_KEY) {
    console.log('[NewsAPI] API key not configured, skipping');
    return [];
  }

  try {
    // NewsAPI uses AND for multiple terms, so we'll search for betting-related sports news
    const query = '(NFL OR NBA OR NHL OR MLB OR UFC) AND (betting OR odds OR sportsbook)';
    const url = `${NEWSAPI_BASE_URL}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=100&apiKey=${NEWSAPI_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Revalidate every 30 minutes
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid NewsAPI key');
      }
      if (response.status === 429) {
        throw new Error('NewsAPI rate limit exceeded');
      }
      throw new Error(`NewsAPI error: ${response.statusText}`);
    }

    const data = await response.json();
    const articles = data.articles?.map(normalizeNewsAPIArticle) || [];

    console.log(`[NewsAPI] Fetched ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error('[NewsAPI] Error fetching articles:', error);
    return [];
  }
}

/**
 * Deduplicate articles by URL and sort by publishedAt (newest first)
 */
function deduplicateAndSort(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  const unique: NewsArticle[] = [];

  for (const article of articles) {
    if (!seen.has(article.url)) {
      seen.add(article.url);
      unique.push(article);
    }
  }

  // Sort by publishedAt (newest first)
  return unique.sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return dateB - dateA;
  });
}

/**
 * Fetch news articles from all configured sources
 */
export async function fetchNewsArticles(): Promise<NewsArticle[]> {
  try {
    // Return cached data if valid
    if (isCacheValid() && newsCache) {
      console.log('[News API] Returning cached articles');
      return newsCache.articles;
    }

    console.log('[News API] Fetching fresh articles from all sources');

    // Fetch from all sources in parallel
    const [gnewsArticles, newsapiArticles] = await Promise.all([
      fetchFromGNews(),
      fetchFromNewsAPI(),
    ]);

    // Combine and deduplicate
    const allArticles = [...gnewsArticles, ...newsapiArticles];
    const articles = deduplicateAndSort(allArticles);

    // Update cache
    newsCache = {
      articles,
      timestamp: Date.now(),
      ttl: CACHE_TTL,
    };

    console.log(`[News API] Cached ${articles.length} total articles (${gnewsArticles.length} from GNews, ${newsapiArticles.length} from NewsAPI)`);

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
