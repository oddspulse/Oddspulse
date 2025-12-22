'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { AppNavigation } from '@/components/AppNavigation';
import { SlotGame, ProviderInfo } from '@/lib/types';
import { CasinoIcon } from '@/lib/icons';

export default function RtpSlotsPage() {
  const [slots, setSlots] = useState<SlotGame[]>([]);
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slotsResponse, providersResponse] = await Promise.all([
        fetch('/api/slots'),
        fetch('/api/providers'),
      ]);

      const slotsData = await slotsResponse.json();
      const providersData = await providersResponse.json();

      // Filter to only show slots with popularity rankings (top 5 per provider)
      const popularSlots = slotsData.filter((slot: SlotGame) => slot.popularityRank);

      setSlots(popularSlots);
      setProviders(providersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group slots by provider
  const groupedSlots = slots.reduce((acc, slot) => {
    const providerId = slot.provider;
    if (!acc[providerId]) {
      acc[providerId] = [];
    }
    acc[providerId].push(slot);
    return acc;
  }, {} as Record<string, SlotGame[]>);

  // Sort slots within each provider by popularity rank
  Object.keys(groupedSlots).forEach((providerId) => {
    groupedSlots[providerId].sort((a, b) =>
      (a.popularityRank || 999) - (b.popularityRank || 999)
    );
  });

  // Get provider info by ID
  const getProviderInfo = (providerId: string): ProviderInfo | undefined => {
    return providers.find(p => p.id === providerId);
  };

  // Calculate overall stats
  const totalSlots = slots.length;
  const avgRtp = slots.length > 0
    ? (slots.reduce((sum, slot) => sum + slot.rtp, 0) / slots.length).toFixed(2)
    : '0.00';
  const totalProviders = Object.keys(groupedSlots).length;

  // Get volatility color
  const getVolatilityColor = (volatility?: string) => {
    switch (volatility) {
      case 'Low': return 'text-casinoGreen';
      case 'Medium': return 'text-casinoGold';
      case 'High': return 'text-casinoRed';
      case 'Extreme': return 'text-casinoRed';
      default: return 'text-textSecondary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-casino">
      {/* Header */}
      <Navigation
        title="RTP Casino Games"
        subtitle="Top 5 most popular games per provider with RTP ratings"
        icon={CasinoIcon}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass border border-casinoGold/20 rounded-xl2 p-6 shadow-card">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">Total Providers</div>
            <div className="text-3xl font-heading font-bold gradient-text">{totalProviders}</div>
          </div>
          <div className="glass border border-casinoGreen/20 rounded-xl2 p-6 shadow-card">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">Top Slots</div>
            <div className="text-3xl font-heading font-bold text-casinoGreen">{totalSlots}</div>
          </div>
          <div className="glass border border-casinoBlue/20 rounded-xl2 p-6 shadow-card">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">Average RTP</div>
            <div className="text-3xl font-heading font-bold text-casinoBlue">{avgRtp}%</div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-16 h-16 border-4 border-casinoGold/30 border-t-casinoGold rounded-full animate-spin"></div>
              <p className="text-textSecondary text-lg mt-4 font-heading">Loading slots...</p>
            </div>
          </div>
        )}

        {/* Provider Sections */}
        {!loading && (
          <div className="space-y-8 mb-12">
            {Object.keys(groupedSlots)
              .sort((a, b) => {
                const providerA = getProviderInfo(a);
                const providerB = getProviderInfo(b);
                return (providerA?.name || a).localeCompare(providerB?.name || b);
              })
              .map((providerId) => {
                const provider = getProviderInfo(providerId);
                const providerSlots = groupedSlots[providerId];

                return (
                  <div
                    key={providerId}
                    className="glass border border-white/10 rounded-xl2 overflow-hidden shadow-card-dark"
                  >
                    {/* Provider Header */}
                    <div
                      className="px-6 py-4 border-b border-white/10"
                      style={{
                        background: `linear-gradient(135deg, ${provider?.color || '#FFD700'}15 0%, transparent 100%)`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-heading font-bold text-textPrimary">
                            {provider?.name || providerId}
                          </h2>
                          <p className="text-sm text-textSecondary mt-1">
                            Top {providerSlots.length} Most Popular Slots
                          </p>
                        </div>
                        <div
                          className="w-3 h-3 rounded-full shadow-glow"
                          style={{ backgroundColor: provider?.color || '#FFD700' }}
                        />
                      </div>
                    </div>

                    {/* Slots Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="text-left px-6 py-3 text-xs font-heading uppercase tracking-wide text-textSecondary">
                              Rank
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-heading uppercase tracking-wide text-textSecondary">
                              Slot Name
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-heading uppercase tracking-wide text-textSecondary">
                              RTP
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-heading uppercase tracking-wide text-textSecondary">
                              Volatility
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-heading uppercase tracking-wide text-textSecondary">
                              Max Win
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-heading uppercase tracking-wide text-textSecondary">
                              Features
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {providerSlots.map((slot, index) => (
                            <tr
                              key={slot.id}
                              className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                            >
                              {/* Rank */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-sm"
                                    style={{
                                      backgroundColor: `${provider?.color || '#FFD700'}20`,
                                      color: provider?.color || '#FFD700',
                                      border: `2px solid ${provider?.color || '#FFD700'}40`,
                                    }}
                                  >
                                    #{slot.popularityRank}
                                  </div>
                                </div>
                              </td>

                              {/* Slot Name */}
                              <td className="px-6 py-4">
                                <div>
                                  <div className="font-heading font-semibold text-textPrimary">
                                    {slot.gameName}
                                  </div>
                                  {slot.theme && (
                                    <div className="text-xs text-textSecondary mt-1">
                                      {slot.theme}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* RTP */}
                              <td className="px-6 py-4">
                                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-casinoGreen/10 border border-casinoGreen/20">
                                  <span className="font-heading font-bold text-casinoGreen">
                                    {slot.rtp}%
                                  </span>
                                </div>
                              </td>

                              {/* Volatility */}
                              <td className="px-6 py-4">
                                <span className={`font-heading font-semibold ${getVolatilityColor(slot.volatility)}`}>
                                  {slot.volatility || 'N/A'}
                                </span>
                              </td>

                              {/* Max Win */}
                              <td className="px-6 py-4">
                                <div className="font-heading font-bold text-casinoGold">
                                  {slot.maxWinMultiplier ? `${slot.maxWinMultiplier.toLocaleString()}x` : 'N/A'}
                                </div>
                              </td>

                              {/* Features */}
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                  {slot.hasBonusBuy && (
                                    <span className="px-2 py-1 text-xs rounded-full bg-casinoBlue/10 border border-casinoBlue/20 text-casinoBlue font-semibold">
                                      Bonus Buy
                                    </span>
                                  )}
                                  {slot.mechanicTags?.slice(0, 2).map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-textSecondary"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* No Results */}
        {!loading && Object.keys(groupedSlots).length === 0 && (
          <div className="text-center py-20 glass rounded-xl2 border border-casinoGold/20 p-12">
            <span className="text-6xl mb-4 block">🎰</span>
            <p className="text-textSecondary text-xl font-heading mb-2">
              No slot data available
            </p>
            <p className="text-textSecondary text-sm">
              Check back soon for popular slot rankings
            </p>
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
                RTP values are theoretical and may vary by casino
              </p>
            </div>
            <p className="text-textSecondary text-sm">
              Always gamble responsibly. 18+ only.
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
