'use client';

import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { AppNavigation } from '@/components/AppNavigation';
import { PredictionMarket } from '@/lib/predictionMarketsService';
import { format } from 'date-fns';
import { CrystalIcon, Icons } from '@/lib/icons';
import { TrendingUp, Vote, Trophy, Building2, LineChart } from 'lucide-react';

type CategoryName = 'Crypto' | 'Politics' | 'Sports' | 'Fed Decisions' | 'Stocks';

const CATEGORIES: CategoryName[] = ['Crypto', 'Politics', 'Sports', 'Fed Decisions', 'Stocks'];

const CATEGORY_ICONS: Record<CategoryName, React.ComponentType<any>> = {
  'Crypto': () => <TrendingUp size={20} className="stroke-[#F2F1ED] opacity-85" strokeWidth={1.5} />,
  'Politics': () => <Vote size={20} className="stroke-[#F2F1ED] opacity-85" strokeWidth={1.5} />,
  'Sports': () => <Trophy size={20} className="stroke-[#F2F1ED] opacity-85" strokeWidth={1.5} />,
  'Fed Decisions': () => <Building2 size={20} className="stroke-[#F2F1ED] opacity-85" strokeWidth={1.5} />,
  'Stocks': () => <LineChart size={20} className="stroke-[#F2F1ED] opacity-85" strokeWidth={1.5} />,
};

const CATEGORY_COLORS: Record<CategoryName, string> = {
  'Crypto': 'casinoGold',
  'Politics': 'casinoBlue',
  'Sports': 'casinoGreen',
  'Fed Decisions': 'casinoRed',
  'Stocks': '#9333EA', // Purple
};

export default function PredictionMarketsPage() {
  const [marketsByCategory, setMarketsByCategory] = useState<Record<string, PredictionMarket[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>('Crypto');

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/prediction-markets');

      if (!response.ok) {
        throw new Error('Failed to fetch prediction markets');
      }

      const data = await response.json();
      setMarketsByCategory(data.categories || {});
    } catch (err: any) {
      console.error('Error fetching prediction markets:', err);
      setError(err.message || 'Failed to load prediction markets');
    } finally {
      setLoading(false);
    }
  };

  const selectedMarkets = marketsByCategory[selectedCategory] || [];

  const formatOdds = (odds: number): string => {
    if (odds > 0) return `+${odds}`;
    return `${odds}`;
  };

  return (
    <div className="min-h-screen bg-gradient-casino">
      {/* Header */}
      <Navigation
        title="Prediction Markets"
        subtitle="Manifold vs Polymarket comparison across categories"
        icon={CrystalIcon}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Selector */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              const marketCount = marketsByCategory[category]?.length || 0;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-6 py-3 rounded-xl font-heading font-bold transition-all duration-200 border-2 ${
                    isActive
                      ? 'bg-gradient-orange text-casinoBlack border-casinoGold shadow-glow'
                      : 'bg-gradient-casino-reverse text-textSecondary border-casinoBlack3 hover:border-casinoGold/50'
                  }`}
                >
                  <span className="mr-2">{React.createElement(CATEGORY_ICONS[category])}</span>
                  {category}
                  {marketCount > 0 && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        isActive ? 'bg-casinoBlack/20' : 'bg-casinoGold/20'
                      }`}
                    >
                      {marketCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-16 h-16 border-4 border-casinoGold/30 border-t-casinoGold rounded-full animate-spin"></div>
              <p className="text-textSecondary text-lg mt-4 font-heading">
                Loading prediction markets...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-casinoRed/10 border-2 border-casinoRed rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-casinoRed font-heading font-bold text-lg mb-2">
                  Error Loading Prediction Markets
                </h3>
                <p className="text-textSecondary mb-3">{error}</p>
                <button
                  onClick={fetchMarkets}
                  className="px-4 py-2 bg-casinoRed text-white rounded-lg font-heading font-semibold hover:shadow-glow-red transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Markets Grid */}
        {!loading && !error && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-textPrimary mb-2 flex items-center gap-2 section-title">
                {React.createElement(CATEGORY_ICONS[selectedCategory])} {selectedCategory} Markets
              </h2>
              <p className="text-textSecondary">
                Top {selectedMarkets.length} prediction markets from Manifold and Polymarket
              </p>
            </div>

            {selectedMarkets.length === 0 ? (
              <div className="bg-gradient-casino-reverse border border-casinoGold/20 rounded-xl p-8 text-center">
                <span className="text-4xl mb-4 block">📭</span>
                <p className="text-textSecondary">
                  No {selectedCategory.toLowerCase()} markets available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedMarkets.map((market) => (
                  <a
                    key={`${market.source}-${market.id}`}
                    href={market.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-casino-reverse border border-casinoGold/20 rounded-xl p-6 hover:border-casinoGold hover:shadow-card-dark transition-all duration-200 group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-casinoGold/20 text-casinoGold">
                          {market.source}
                        </span>
                        {market.volume && market.volume > 0 && (
                          <span className="text-xs text-textSecondary">
                            Vol: ${(market.volume / 1000).toFixed(1)}k
                          </span>
                        )}
                      </div>
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        🔗
                      </span>
                    </div>

                    {/* Question */}
                    <h3 className="text-lg font-heading font-bold text-textPrimary mb-4 line-clamp-2 group-hover:text-casinoGold transition-colors">
                      {market.question}
                    </h3>

                    {/* Odds Display */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Probability */}
                      <div className="bg-casinoBlack/40 rounded-lg p-4 border border-casinoGreen/20">
                        <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">
                          Probability
                        </div>
                        <div className="text-3xl font-heading font-bold text-casinoGreen">
                          {market.probability.toFixed(1)}%
                        </div>
                      </div>

                      {/* American Odds */}
                      <div className="bg-casinoBlack/40 rounded-lg p-4 border border-casinoGold/20">
                        <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">
                          American Odds
                        </div>
                        <div className="text-3xl font-heading font-bold text-casinoGold">
                          {formatOdds(market.americanOdds)}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between text-xs text-textSecondary">
                      <span>
                        {market.endDate
                          ? `Ends ${format(new Date(market.endDate), 'MMM d, yyyy')}`
                          : 'No end date'}
                      </span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-casinoGold">
                        View Market →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}

        {/* Info Banner */}
        <div className="mt-12 bg-gradient-casino-reverse border border-casinoBlue/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="text-casinoBlue font-heading font-bold text-lg mb-2">
                About Prediction Markets
              </h3>
              <p className="text-textSecondary text-sm leading-relaxed">
                Prediction markets allow you to bet on real-world events using real money. The probability
                shown represents the market's consensus on the likelihood of an event occurring. Higher
                probability means the market believes the event is more likely to happen.
              </p>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="text-textSecondary">
                  <span className="font-bold text-casinoGold">Polymarket:</span> Crypto-based prediction markets
                </span>
                <span className="text-textSecondary">
                  <span className="font-bold text-casinoGreen">Manifold:</span> Play-money prediction markets
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <AppNavigation />
    </div>
  );
}
