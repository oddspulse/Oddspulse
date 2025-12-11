'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import LiveOddsTable from '@/components/LiveOddsTable';
import SportSelector from '@/components/SportSelector';
import { LiveEvent, MarketType } from '@/lib/types';
import { SPORT_KEYS } from '@/lib/oddsService';
import { format } from 'date-fns';

export default function LiveOddsPage() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState(SPORT_KEYS.NFL);
  const [selectedMarket, setSelectedMarket] = useState<MarketType>('moneyline');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch odds data
  const fetchOdds = async () => {
    try {
      setError(null);
      const response = await fetch(
        `/api/odds/${selectedSport}?markets=${selectedMarket}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch odds');
      }

      const data = await response.json();
      setEvents(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching odds:', err);
      setError('Failed to load odds. Please check your API key configuration.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    setLoading(true);
    fetchOdds();
  }, [selectedSport, selectedMarket]);

  // Polling - refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOdds();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [selectedSport, selectedMarket]);

  // Stats
  const liveEventsCount = events.filter(e => e.isLive).length;
  const upcomingEventsCount = events.filter(e => !e.isLive).length;
  const totalOperators = new Set(
    events.flatMap(e =>
      e.markets.flatMap(m => m.outcomes.map(o => o.operatorId))
    )
  ).size;

  return (
    <div className="min-h-screen bg-gradient-casino">
      {/* Header */}
      <Navigation
        title="Live Odds Comparison"
        subtitle="Real-time odds from top sportsbooks • Updates every 30 seconds"
        emoji="📊"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sport & Market Selector */}
        <SportSelector
          selectedSport={selectedSport}
          selectedMarket={selectedMarket}
          onSportChange={setSelectedSport}
          onMarketChange={setSelectedMarket}
        />

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
          <div className="bg-gradient-casino-reverse border border-casinoRed/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">
              🔴 Live Events
            </div>
            <div className="text-2xl font-heading font-bold text-casinoRed">
              {liveEventsCount}
            </div>
          </div>
          <div className="bg-gradient-casino-reverse border border-casinoBlue/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">
              📅 Upcoming
            </div>
            <div className="text-2xl font-heading font-bold text-casinoBlue">
              {upcomingEventsCount}
            </div>
          </div>
          <div className="bg-gradient-casino-reverse border border-casinoGreen/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">
              🏢 Sportsbooks
            </div>
            <div className="text-2xl font-heading font-bold text-casinoGreen">
              {totalOperators}
            </div>
          </div>
          <div className="bg-gradient-casino-reverse border border-casinoGold/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">
              🔄 Last Updated
            </div>
            <div className="text-lg font-heading font-bold text-casinoGold">
              {lastUpdated ? format(lastUpdated, 'h:mm:ss a') : '—'}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-casinoRed/10 border-2 border-casinoRed rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-casinoRed font-heading font-bold text-lg mb-2">
                  Error Loading Odds
                </h3>
                <p className="text-textSecondary mb-3">{error}</p>
                <p className="text-textSecondary text-sm">
                  Make sure you've set <code className="bg-casinoBlack px-2 py-1 rounded text-casinoGold">ODDS_API_KEY</code> in your .env.local file.
                  Get a free API key at{' '}
                  <a
                    href="https://the-odds-api.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-casinoGold hover:text-yellow-300 underline"
                  >
                    the-odds-api.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-16 h-16 border-4 border-casinoGold/30 border-t-casinoGold rounded-full animate-spin"></div>
              <p className="text-textSecondary text-lg mt-4 font-heading">
                Loading live odds...
              </p>
            </div>
          </div>
        )}

        {/* Odds Table */}
        {!loading && !error && (
          <LiveOddsTable events={events} selectedMarket={selectedMarket} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-casinoBlack border-t-2 border-casinoGold/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-casinoRed">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-semibold uppercase tracking-wide">
                Odds are for informational purposes only
              </p>
            </div>
            <p className="text-textSecondary text-sm">
              Always gamble responsibly. 18+ only.
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-casinoGold to-transparent mx-auto"></div>
            <p className="text-textSecondary text-xs">
              © {new Date().getFullYear()} BetRadar Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
