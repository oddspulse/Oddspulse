'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { AppNavigation } from '@/components/AppNavigation';
import type { NewsArticle } from '@/lib/newsService';

/**
 * News Page
 *
 * Displays latest sports betting and casino news from GNews API
 * Features:
 * - Client-side search/filter
 * - Loading states
 * - Error handling
 * - Auto-refresh every 10 minutes
 */
export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNews();

    // Auto-refresh every 10 minutes
    const refreshInterval = setInterval(() => {
      console.log('[News] Auto-refreshing news...');
      fetchNews();
    }, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Filter articles when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.description?.toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query)
    );
    setFilteredArticles(filtered);
  }, [searchQuery, articles]);

  const fetchNews = async () => {
    try {
      setError(null);
      const response = await fetch('/api/news');
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch news');
      }

      setArticles(data.articles || []);
      setFilteredArticles(data.articles || []);
      console.log(`[News] Loaded ${data.count} articles (from ${data.cache?.cached ? 'cache' : 'API'})`);
    } catch (err: any) {
      console.error('[News] Error fetching news:', err);
      setError(err.message || 'Failed to load news articles');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-casino pb-24">
      {/* Header */}
      <Navigation
        title="Betting News"
        subtitle="Latest sports betting & casino news"
        emoji="📰"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="rounded-xl2 bg-casinoSurface shadow-card p-4 border border-white/5">
            <div className="relative">
              <input
                type="text"
                placeholder="Search news by title, description, or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-casinoBlack border-2 border-casinoGold/30 rounded-lg text-textPrimary placeholder-textSecondary/50 focus:ring-2 focus:ring-casinoGold outline-none"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-textSecondary mt-2">
                Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-16 h-16 border-4 border-casinoOrange/30 border-t-casinoOrange rounded-full animate-spin shadow-glow"></div>
              <p className="text-textSecondary text-lg mt-4 font-heading">Loading news...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-xl2 bg-casinoRed/10 border border-casinoRed/30 p-8 text-center">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h3 className="text-xl font-heading font-bold text-casinoRed mb-2">
              News Unavailable
            </h3>
            <p className="text-textSecondary">
              {error}
            </p>
            <p className="text-sm text-textSecondary/70 mt-4">
              Make sure GNEWS_API_KEY is configured in your environment variables.
            </p>
            <button
              onClick={fetchNews}
              className="mt-6 bg-gradient-green hover:shadow-glow-green text-white font-heading font-bold py-3 px-8 rounded-lg transition-all duration-300 uppercase tracking-wide text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Articles State */}
        {!loading && !error && filteredArticles.length === 0 && (
          <div className="text-center py-20 rounded-xl2 bg-casinoSurface shadow-card border border-white/5 p-12">
            <span className="text-6xl mb-4 block">📭</span>
            <p className="text-textSecondary text-xl font-heading mb-2">
              {searchQuery ? 'No articles match your search' : 'No news articles found'}
            </p>
            <p className="text-textSecondary text-sm">
              {searchQuery ? 'Try a different search term' : 'Check back later for updates'}
            </p>
          </div>
        )}

        {/* News Articles Grid */}
        {!loading && !error && filteredArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl2 bg-casinoSurface shadow-card border border-white/5 overflow-hidden hover:border-casinoGold/30 hover:shadow-glow transition-all duration-300 card-3d group"
              >
                {/* Article Image */}
                {article.imageUrl && (
                  <div className="aspect-video bg-casinoBlack overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Hide image if it fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="p-5">
                  {/* Source & Time */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-casinoGold uppercase tracking-wide">
                      {article.source}
                    </span>
                    <span className="text-textSecondary text-xs">•</span>
                    <span className="text-xs text-textSecondary">
                      {formatTimeAgo(article.publishedAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-heading font-bold text-textPrimary mb-3 line-clamp-2 group-hover:text-casinoGold transition-colors">
                    {article.title}
                  </h3>

                  {/* Description */}
                  {article.description && (
                    <p className="text-sm text-textSecondary line-clamp-3">
                      {article.description}
                    </p>
                  )}

                  {/* Read More Indicator */}
                  <div className="flex items-center gap-2 mt-4 text-casinoGold text-sm font-semibold">
                    <span>Read more</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && filteredArticles.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-textSecondary text-sm">
              Showing {filteredArticles.length} of {articles.length} articles
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <AppNavigation />
    </div>
  );
}
