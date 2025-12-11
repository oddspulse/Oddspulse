'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import SportSelector from '@/components/SportSelector';
import { ArbitrageOpportunity, LiveEvent, MarketType } from '@/lib/types';
import { SPORT_KEYS } from '@/lib/oddsService';
import { findArbitrageOpportunities } from '@/lib/arbitrageService';
import { format } from 'date-fns';

export default function ArbitragePage() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState(SPORT_KEYS.NFL);
  const [selectedMarket, setSelectedMarket] = useState<MarketType>('moneyline');
  const [minProfit, setMinProfit] = useState(0.5); // 0.5% minimum
  const [totalStake, setTotalStake] = useState(1000);
  const [lastScanned, setLastScanned] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  // Fetch odds and scan for arbitrage
  const scanForArbitrage = async () => {
    setScanning(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/odds/${selectedSport}?markets=${selectedMarket}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch odds');
      }

      const data: LiveEvent[] = await response.json();
      setEvents(data);

      // Find arbitrage opportunities
      const opps = findArbitrageOpportunities(data, minProfit, totalStake);
      setOpportunities(opps);
      setLastScanned(new Date());
    } catch (err: any) {
      console.error('Error scanning for arbitrage:', err);
      setError(err.message || 'Failed to scan for arbitrage opportunities');
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  // Initial scan
  useEffect(() => {
    scanForArbitrage();
  }, [selectedSport, selectedMarket]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      scanForArbitrage();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [selectedSport, selectedMarket, minProfit, totalStake]);

  return (
    <div className="min-h-screen bg-gradient-casino">
      {/* Header */}
      <Navigation
        title="Arbitrage Scanner"
        subtitle="Find guaranteed profit opportunities across sportsbooks"
        emoji="💰"
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

        {/* Settings */}
        <div className="bg-gradient-casino-reverse rounded-xl shadow-card-dark p-6 border border-casinoGold/20 my-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-casinoGold text-xl">⚙️</span>
            <h2 className="text-lg font-heading font-bold text-casinoGold uppercase tracking-wide">
              Scanner Settings
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-textSecondary mb-2 uppercase tracking-wide font-semibold">
                Minimum Profit (%)
              </label>
              <input
                type="number"
                value={minProfit}
                onChange={(e) => setMinProfit(parseFloat(e.target.value))}
                step="0.1"
                min="0"
                className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGold/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoGold outline-none"
              />
              <p className="text-xs text-textSecondary mt-1">
                Only show opportunities with at least this profit margin
              </p>
            </div>
            <div>
              <label className="block text-sm text-textSecondary mb-2 uppercase tracking-wide font-semibold">
                Total Stake ($)
              </label>
              <input
                type="number"
                value={totalStake}
                onChange={(e) => setTotalStake(parseInt(e.target.value))}
                step="100"
                min="100"
                className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGreen/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoGreen outline-none"
              />
              <p className="text-xs text-textSecondary mt-1">
                Total amount to allocate across all bets in an opportunity
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={scanForArbitrage}
              disabled={scanning}
              className="bg-gradient-green hover:shadow-glow-green text-white font-heading font-bold py-3 px-8 rounded-lg transition-all duration-300 uppercase tracking-wide text-sm disabled:opacity-50"
            >
              {scanning ? '🔄 Scanning...' : '🔍 Scan Now'}
            </button>
            {lastScanned && (
              <span className="text-textSecondary text-sm">
                Last scanned: {format(lastScanned, 'h:mm:ss a')}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-casino-reverse border border-casinoGreen/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">
              📈 Opportunities Found
            </div>
            <div className="text-2xl font-heading font-bold text-casinoGreen">
              {opportunities.length}
            </div>
          </div>
          <div className="bg-gradient-casino-reverse border border-casinoGold/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">
              🎯 Best Profit
            </div>
            <div className="text-2xl font-heading font-bold text-casinoGold">
              {opportunities.length > 0 ? `${opportunities[0].profit.toFixed(2)}%` : '—'}
            </div>
          </div>
          <div className="bg-gradient-casino-reverse border border-casinoBlue/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">
              🏟️ Games Scanned
            </div>
            <div className="text-2xl font-heading font-bold text-casinoBlue">
              {events.length}
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
                  Scanner Error
                </h3>
                <p className="text-textSecondary">{error}</p>
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
                Scanning for arbitrage opportunities...
              </p>
            </div>
          </div>
        )}

        {/* No Opportunities */}
        {!loading && !error && opportunities.length === 0 && (
          <div className="text-center py-20 bg-gradient-casino-reverse rounded-xl border border-casinoGold/20 p-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-textSecondary text-xl font-heading mb-2">
              No arbitrage opportunities found
            </p>
            <p className="text-textSecondary text-sm">
              Try adjusting your minimum profit threshold or check a different sport/market
            </p>
          </div>
        )}

        {/* Opportunities List */}
        {!loading && opportunities.length > 0 && (
          <div className="space-y-6">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-gradient-casino-reverse rounded-xl shadow-card-dark border-2 border-casinoGreen/30 overflow-hidden hover:border-casinoGreen/60 transition-all duration-300"
              >
                {/* Opportunity Header */}
                <div className="bg-casinoBlack2 border-b-2 border-casinoGold/10 p-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-heading font-bold text-textPrimary mb-2">
                        {opp.awayTeam} @ {opp.homeTeam}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-textSecondary">
                        <span className="flex items-center gap-1">
                          🏆 {opp.league}
                        </span>
                        <span className="flex items-center gap-1">
                          🕐 {format(new Date(opp.startTime), 'MMM d, h:mm a')}
                        </span>
                        <span className="flex items-center gap-1 capitalize">
                          📊 {opp.marketType}
                        </span>
                      </div>
                    </div>
                    <div className="px-6 py-4 bg-casinoGreen/20 border-2 border-casinoGreen rounded-lg">
                      <div className="text-xs text-textSecondary uppercase tracking-wide text-center">
                        Guaranteed Profit
                      </div>
                      <div className="text-3xl font-heading font-bold text-casinoGreen text-center">
                        {opp.profit.toFixed(2)}%
                      </div>
                      <div className="text-xs text-casinoGreen text-center mt-1">
                        ${((opp.totalStake * opp.profit) / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bet Instructions */}
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {opp.bets.map((bet, idx) => (
                      <a
                        key={idx}
                        href={bet.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-casinoBlack border-2 border-casinoGold/30 rounded-lg p-4 hover:border-casinoGold hover:shadow-glow-gold transition-all duration-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="text-sm text-textSecondary uppercase tracking-wide mb-1">
                              Bet {idx + 1}
                            </div>
                            <div className="text-lg font-heading font-bold text-textPrimary">
                              {bet.outcome}
                            </div>
                          </div>
                          <span className="text-casinoGold">→</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-textSecondary">Sportsbook:</span>
                            <span className="text-sm font-semibold text-textPrimary">
                              {bet.operatorName}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-textSecondary">Odds:</span>
                            <span className="text-sm font-semibold text-casinoGold">
                              {bet.odds > 0 ? '+' : ''}{bet.odds}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-casinoGold/20">
                            <span className="text-sm text-textSecondary">Stake:</span>
                            <span className="text-lg font-heading font-bold text-casinoGreen">
                              ${bet.stake.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-textSecondary">Return:</span>
                            <span className="text-sm font-semibold text-textPrimary">
                              ${bet.potentialReturn.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-casinoBlack border-t-2 border-casinoGold/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-casinoRed">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-semibold uppercase tracking-wide">
                Arbitrage betting may violate sportsbook terms of service
              </p>
            </div>
            <p className="text-textSecondary text-sm">
              Always read and comply with operator terms. This tool is for educational purposes only.
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
