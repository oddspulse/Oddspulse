# News Feature Documentation

## Overview

The News tab displays the latest sports betting news articles aggregated from **multiple sources**:
- **GNews API** - Up to 100 articles
- **NewsAPI.org** - Up to 100 articles

Articles are combined, deduplicated, and sorted by publish date for the freshest betting odds content.

## Features

✅ **Multi-Source Aggregation** - Combines articles from GNews + NewsAPI for maximum daily coverage
✅ **Sports-Focused** - NFL, NBA, NHL, MLB, UFC betting odds and news
✅ **Smart Caching** - 30-minute cache TTL to avoid rate limits and improve performance
✅ **Auto-Deduplication** - Removes duplicate articles by URL
✅ **Client-Side Search** - Filter articles by title, description, or source
✅ **Auto-Refresh** - Automatically refreshes news every 30 minutes
✅ **Error Handling** - Graceful fallback to cached data if APIs fail
✅ **Responsive UI** - Clean card-based layout with images and descriptions

---

## Setup

### 1. Get API Keys

**GNews API:**
1. Sign up at https://gnews.io
2. Get your free API key from the dashboard
3. Free tier: 100 requests/day

**NewsAPI.org:**
1. Sign up at https://newsapi.org
2. Get your free API key from the dashboard
3. Free tier: 100 requests/day

### 2. Add to Environment Variables

Add to `.env.local`:

```bash
# GNews API
GNEWS_API_KEY=your_actual_gnews_api_key_here

# NewsAPI.org
NEWSAPI_KEY=your_actual_newsapi_key_here
```

**Note:** Both APIs are optional. If only one is configured, the system will use just that source.

### 3. Deploy to Vercel

Add the same variables in Vercel dashboard:
- Go to Settings → Environment Variables
- Add `GNEWS_API_KEY` with your key
- Add `NEWSAPI_KEY` with your key
- Check Production, Preview, and Development for both

---

## Search Keywords

### GNews Keywords (OR logic)
- "NFL betting odds"
- "NBA betting odds"
- "NHL betting odds"
- "MLB betting odds"
- "UFC betting odds"
- "football betting"
- "basketball betting"
- "hockey betting"
- "baseball betting"
- "point spread"
- "moneyline odds"
- "over under betting"

### NewsAPI Query
- `(NFL OR NBA OR NHL OR MLB OR UFC) AND (betting OR odds OR sportsbook)`

---

## Caching Strategy

### In-Memory Cache
- **TTL**: 30 minutes
- **Fallback**: Returns stale cache if APIs fail
- **Auto-refresh**: Page refreshes news every 30 minutes
- **Deduplication**: Articles with same URL are automatically removed
- **Sorting**: Newest articles first (by publishedAt date)

### Why Caching?
- Avoids hitting API rate limits (100 req/day each on free tier)
- Improves page load performance
- Provides resilience if APIs are temporarily unavailable
- Reduces bandwidth and server costs

---

## API Route

### `GET /api/news`

**Response:**
```typescript
{
  success: true,
  articles: NewsArticle[],
  count: number,
  cache: {
    cached: boolean,
    age: number,      // seconds since cache update
    articles: number,
    valid: boolean
  },
  timestamp: string
}
```

**Error Response:**
```typescript
{
  success: false,
  articles: [],
  count: 0,
  error: string,
  hint: string
}
```

---

## Data Model

### NewsArticle Type

```typescript
type NewsArticle = {
  id: string;           // Unique identifier (URL)
  title: string;        // Article title
  source: string;       // News source (e.g., "ESPN", "Bloomberg")
  url: string;          // Article URL
  imageUrl?: string;    // Optional thumbnail image
  publishedAt: string;  // ISO timestamp
  description?: string; // Article description/excerpt
};
```

---

## UI Components

### News Page (`/news`)

Features:
- **Search Bar** - Filter articles in real-time
- **Article Cards** - Image, title, source, timestamp, description
- **Loading State** - Spinner while fetching
- **Error State** - User-friendly error message with retry button
- **Empty State** - Message when no articles found

### Article Card

- Clickable (opens in new tab with `target="_blank"`)
- Hover effects (scale, glow, color change)
- Image with fallback if fails to load
- Source badge and time ago display
- 2-line title truncation
- 3-line description truncation

---

## Navigation

The News tab is added to the bottom navigation bar:

```typescript
{ href: '/news', label: 'News', icon: '📰' }
```

**Mobile Bottom Nav Order:**
1. Casino 🏠
2. Live Odds 📊
3. Arbitrage 💰
4. Slots 🎰
5. **News 📰** (NEW)

---

## Error Handling

### If API Key Missing
- Console error logged
- UI shows "News Unavailable" message
- Hints to check environment variables

### If API Fails
- Returns cached data (even if stale)
- If no cache, returns empty array
- UI shows error with retry button

### If Image Fails to Load
- Image hidden automatically
- Card still displays with text content

---

## Rate Limits

### GNews Free Tier
- **100 requests/day**
- With 10-minute caching: ~144 potential requests/day (if refreshed 24/7)
- In practice: Much lower due to user behavior

### Optimization
- Cache prevents excessive API calls
- Stale cache served on error
- Manual refresh doesn't trigger new API call if cache valid

---

## Testing

### Local Development

1. Add API key to `.env.local`
2. Start dev server: `npm run dev`
3. Visit: http://localhost:3000/news
4. Check browser console for cache status

### Production

1. Add `GNEWS_API_KEY` to Vercel env vars
2. Deploy
3. Visit: https://oddspulse.app/news
4. Test search functionality
5. Check Network tab for caching behavior

---

## Troubleshooting

### "News Unavailable" Error

**Cause**: Missing or invalid API key

**Solution**:
1. Check `.env.local` has `GNEWS_API_KEY=your_key`
2. Verify key is valid at https://gnews.io/dashboard
3. Restart dev server after adding key

### No Articles Showing

**Possible causes**:
- API key quota exceeded (100/day limit)
- API temporarily down
- No recent news matching keywords

**Solutions**:
- Wait for quota to reset (midnight UTC)
- Check GNews status page
- Try different search keywords

### Images Not Loading

**Cause**: Some news sources block external image requests

**Solution**: This is handled automatically - images hide on error, text content still displays

---

## Future Enhancements

Potential improvements:
- Category filters (sports betting, casino, poker, etc.)
- Sorting (newest, oldest, source)
- Pagination or infinite scroll
- Save favorite articles (requires database)
- Dark mode image contrast adjustment
- RSS feed integration as backup source

---

## API Alternatives

If you prefer a different news API:

### NewsAPI (newsapi.org)
- More sources
- Historical data
- $449/month for production

### MediaStack (mediastack.com)
- Real-time news
- 500 requests/month free
- Similar JSON structure

**To switch**: Modify `src/lib/newsService.ts` and update API endpoint/normalization logic.

---

## Support

- GNews API Docs: https://gnews.io/docs/v4
- GNews Support: support@gnews.io
- Rate Limit Info: https://gnews.io/docs/v4#rate-limits
