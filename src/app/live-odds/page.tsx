'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { AppNavigation } from '@/components/AppNavigation';
import LiveOddsTable from '@/components/LiveOddsTable';
import SportSelector from '@/components/SportSelector';
import { LiveEvent, LiveScore, MarketType } from '@/lib/types';
import { SPORT_KEYS } from '@/lib/oddsService';
import { format } from 'date-fns';
import { useOddsStatus, formatCountdown, formatCacheAge } from '@/hooks/useOddsStatus';
import {
  ChartIcon,
  RefreshIcon,
  HourglassIcon,
  ClockIcon,
  WarningIcon,
  ZapIcon,
  CalendarIcon,
  BuildingIcon,
  LightbulbIcon,
} from '@/lib/icons';

interface RateLimitedOddsResponse {
  events: LiveEvent[];
  fromCache: boolean;
  cacheAge?: number;
  quotaInfo: {
    callCount: number;
    limit: number;
    remaining: number;
    percentUsed: number;
    isNearLimit: boolean;
  };
  refreshInfo: {
    canRefreshNow: boolean;
    timeUntilRefresh?: string;
    lastFetchTime?: number;
  };
  warning?: string;
}

export default function LiveOddsPage() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSport, setSelectedSport] = useState(SPORT_KEYS.NFL);
  const [selectedMarket, setSelectedMarket] = useState<MarketType>('moneyline');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [cacheAge, setCacheAge] = useState<number | undefined>();
  const [warning, setWarning] = useState<string | undefined>();

  // Use the odds status hook for real-time countdown
  const { status, remainingMs, canRefreshNow, refetchStatus } = useOddsStatus(5000);

  // Fetch odds data
  const fetchOdds = async (forceRefresh = false) => {
    try {
      setError(null);
      if (forceRefresh) {
        setRefreshing(true);
      }

      const response = await fetch(
        `/api/odds/${selectedSport}?markets=${selectedMarket}&forceRefresh=${forceRefresh}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch odds');
      }

      const data: RateLimitedOddsResponse = await response.json();

      // Fetch scores separately and merge with events
      await fetchAndMergeScores(data.events);

      setFromCache(data.fromCache);
      setCacheAge(data.cacheAge);
      setWarning(data.warning);
      setLastUpdated(new Date());

      // Refetch status after manual refresh to update countdown
      if (forceRefresh) {
        await refetchStatus();
      }
    } catch (err: any) {
      console.error('Error fetching odds:', err);
      setError(err.message || 'Failed to load odds');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch scores and merge with events
  const fetchAndMergeScores = async (oddsEvents: LiveEvent[]) => {
    try {
      const scoresResponse = await fetch(`/api/scores/${selectedSport}`);

      if (!scoresResponse.ok) {
        // If scores fail, just use events without scores
        setEvents(oddsEvents);
        return;
      }

      const scoresData = await scoresResponse.json();
      const scoresMap = new Map(scoresData.scores?.map((s: any) => [s.eventId, s]) || []);

      // Merge scores into events
      const eventsWithScores: LiveEvent[] = oddsEvents.map(event => ({
        ...event,
        liveScore: scoresMap.get(event.id) as LiveScore | undefined
      }));

      setEvents(eventsWithScores);
    } catch (err) {
      console.error('Error fetching scores:', err);
      // If scores fail, just use events without scores
      setEvents(oddsEvents);
    }
  };

  // Fetch operators
  const fetchOperators = async () => {
    try {
      const response = await fetch('/api/operators');
      const data = await response.json();
      setOperators(data);
    } catch (err) {
      console.error('Error fetching operators:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOperators();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchOdds();
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
        title="Sports Odds Comparison"
        subtitle="Smart quota management • 90-minute refresh intervals"
        icon={ChartIcon}
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

        {/* Quota and Refresh Info Banner */}
        {status && (
          <div className="bg-gradient-casino-reverse rounded-xl shadow-card-dark p-6 border border-casinoGold/20 my-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* API Quota */}
              <div className={`p-4 rounded-lg border-2 ${
                status.isNearLimit
                  ? 'bg-casinoRed/10 border-casinoRed'
                  : 'bg-casinoGreen/10 border-casinoGreen'
              }`}>
                <div className="text-xs nav-label mb-2 font-semibold flex items-center gap-2" style={{
                  color: status.isNearLimit ? '#FF314A' : '#0DB15D'
                }}>
                  <ChartIcon size="xs" className={status.isNearLimit ? 'stroke-casinoRed' : 'stroke-casinoGreen'} />
                  <span>Monthly Quota</span>
                </div>
                <div className="text-2xl font-heading font-bold" style={{
                  color: status.isNearLimit ? '#FF314A' : '#0DB15D'
                }}>
                  {status.remaining}/{status.monthlyLimit}
                </div>
                <div className="text-xs text-textSecondary mt-1">
                  {status.percentUsed.toFixed(1)}% used
                </div>
                {status.isNearLimit && (
                  <div className="text-xs text-casinoRed mt-2 font-semibold flex items-center gap-1">
                    <WarningIcon size="xs" className="stroke-casinoRed" />
                    <span>Approaching limit!</span>
                  </div>
                )}
              </div>

              {/* Cache Status */}
              <div className="p-4 rounded-lg border-2 bg-casinoBlue/10 border-casinoBlue">
                <div className="text-xs text-casinoBlue nav-label mb-2 font-semibold flex items-center gap-2">
                  <ClockIcon size="xs" className="stroke-casinoBlue" />
                  <span>Data Source</span>
                </div>
                <div className="text-2xl font-heading font-bold text-casinoBlue">
                  {fromCache ? 'Cached' : 'Fresh'}
                </div>
                {fromCache && cacheAge && (
                  <div className="text-xs text-textSecondary mt-1">
                    {formatCacheAge(cacheAge)}
                  </div>
                )}
              </div>

              {/* Refresh Status with Live Countdown */}
              <div className="p-4 rounded-lg border-2 bg-casinoGold/10 border-casinoGold">
                <div className="text-xs text-casinoGold nav-label mb-2 font-semibold flex items-center gap-2">
                  <RefreshIcon size="xs" className="stroke-casinoGold" />
                  <span>Next Refresh</span>
                </div>
                <div className="text-lg font-heading font-bold text-casinoGold mb-2">
                  {formatCountdown(remainingMs)}
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => fetchOdds(true)}
                    disabled={refreshing || !canRefreshNow}
                    className={`w-full px-4 py-2 rounded-lg font-heading font-semibold text-sm nav-label transition-all duration-200 flex items-center justify-center gap-2 ${
                      canRefreshNow && !refreshing
                        ? 'bg-casinoGold text-casinoBlack hover:shadow-glow-gold cursor-pointer'
                        : 'bg-casinoBlack3 text-textSecondary cursor-not-allowed opacity-50'
                    }`}
                  >
                    {refreshing ? (
                      <>
                        <HourglassIcon size="xs" />
                        <span>Refreshing...</span>
                      </>
                    ) : canRefreshNow ? (
                      <>
                        <RefreshIcon size="xs" />
                        <span>Refresh Now</span>
                      </>
                    ) : (
                      <>
                        <ClockIcon size="xs" />
                        <span>Cooldown</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Warning Banner */}
            {warning && (
              <div className="mt-4 p-4 bg-casinoRed/10 border-2 border-casinoRed rounded-lg">
                <div className="flex items-start gap-2">
                  <WarningIcon size="sm" className="stroke-casinoRed" />
                  <p className="text-casinoRed text-sm font-semibold flex-1">
                    {warning}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
          <div className="bg-gradient-casino-reverse border border-casinoRed/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary nav-label mb-1 flex items-center gap-1">
              <ZapIcon size="xs" className="stroke-casinoRed" />
              <span>Live Events</span>
            </div>
            <div className="text-2xl font-heading font-bold text-casinoRed">
              {liveEventsCount}
            </div>
          </div>
          <div className="bg-gradient-casino-reverse border border-casinoBlue/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary nav-label mb-1 flex items-center gap-1">
              <CalendarIcon size="xs" className="stroke-casinoBlue" />
              <span>Upcoming</span>
            </div>
            <div className="text-2xl font-heading font-bold text-casinoBlue">
              {upcomingEventsCount}
            </div>
          </div>
          <div className="bg-gradient-casino-reverse border border-casinoGreen/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary nav-label mb-1 flex items-center gap-1">
              <BuildingIcon size="xs" className="stroke-casinoGreen" />
              <span>Sportsbooks</span>
            </div>
            <div className="text-2xl font-heading font-bold text-casinoGreen">
              {totalOperators}
            </div>
          </div>
          <div className="bg-gradient-casino-reverse border border-casinoGold/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary nav-label mb-1 flex items-center gap-1">
              <ClockIcon size="xs" className="stroke-casinoGold" />
              <span>Last Updated</span>
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
              <WarningIcon size="lg" className="stroke-casinoRed" />
              <div>
                <h3 className="text-casinoRed font-heading font-bold text-lg mb-2 section-title">
                  Error Loading Odds
                </h3>
                <p className="text-textSecondary mb-3">{error}</p>
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
          <LiveOddsTable events={events} selectedMarket={selectedMarket} operators={operators} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-casinoBlack border-t-2 border-casinoGold/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-casinoGold">
              <LightbulbIcon size="sm" className="stroke-casinoGold" />
              <p className="text-sm font-semibold nav-label">
                Smart Quota Management: Data refreshes every 90 minutes
              </p>
            </div>
            <p className="text-textSecondary text-sm">
              Odds are for informational purposes only. Always gamble responsibly. 18+ only.
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-casinoGold to-transparent mx-auto"></div>
            <p className="text-textSecondary text-xs">
              © {new Date().getFullYear()} Odds Pulse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <AppNavigation />
    </div>
  );
}
