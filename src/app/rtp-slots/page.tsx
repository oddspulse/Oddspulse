'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SlotCard from '@/components/SlotCard';
import SlotFilterBar from '@/components/SlotFilterBar';
import { SlotGame, Operator } from '@/lib/types';

export default function RtpSlotsPage() {
  const [slots, setSlots] = useState<SlotGame[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<SlotGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    provider: 'all',
    minRtp: 0,
    volatility: 'all',
    hasBonusBuy: 'all',
    minMaxWin: 0,
    mechanic: 'all',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [slots, filters]);

  const fetchData = async () => {
    try {
      const [slotsResponse, operatorsResponse] = await Promise.all([
        fetch('/api/slots'),
        fetch('/api/operators'),
      ]);

      const slotsData = await slotsResponse.json();
      const operatorsData = await operatorsResponse.json();

      setSlots(slotsData);
      setOperators(operatorsData);
      setFilteredSlots(slotsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...slots];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((slot) =>
        slot.gameName.toLowerCase().includes(searchLower)
      );
    }

    // Provider filter
    if (filters.provider !== 'all') {
      filtered = filtered.filter((slot) => slot.provider === filters.provider);
    }

    // Min RTP filter
    if (filters.minRtp > 0) {
      filtered = filtered.filter((slot) => slot.rtp >= filters.minRtp);
    }

    // Volatility filter
    if (filters.volatility !== 'all') {
      filtered = filtered.filter((slot) => slot.volatility === filters.volatility);
    }

    // Bonus Buy filter
    if (filters.hasBonusBuy === 'yes') {
      filtered = filtered.filter((slot) => slot.hasBonusBuy === true);
    } else if (filters.hasBonusBuy === 'no') {
      filtered = filtered.filter((slot) => !slot.hasBonusBuy);
    }

    // Min Max Win filter
    if (filters.minMaxWin > 0) {
      filtered = filtered.filter(
        (slot) => (slot.maxWinMultiplier || 0) >= filters.minMaxWin
      );
    }

    // Mechanic filter
    if (filters.mechanic !== 'all') {
      filtered = filtered.filter((slot) =>
        slot.mechanicTags?.includes(filters.mechanic)
      );
    }

    setFilteredSlots(filtered);
  };

  // Get stats
  const avgRtp = filteredSlots.length > 0
    ? (filteredSlots.reduce((sum, slot) => sum + slot.rtp, 0) / filteredSlots.length).toFixed(2)
    : '0.00';

  const maxWinSlot = filteredSlots.length > 0
    ? filteredSlots.reduce((max, slot) =>
        (slot.maxWinMultiplier || 0) > (max.maxWinMultiplier || 0) ? slot : max
      )
    : null;

  return (
    <div className="min-h-screen bg-gradient-casino">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-casinoBlack/95 backdrop-blur-sm border-b-2 border-casinoGold/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <span className="text-4xl">🎰</span>
                <h1 className="text-3xl md:text-5xl font-heading font-bold bg-gradient-to-r from-casinoGold via-yellow-300 to-casinoGold bg-clip-text text-transparent">
                  RTP Slots Database
                </h1>
              </div>
              <p className="text-textSecondary mt-2 font-body">
                Compare Return-to-Player rates across top slot providers
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="bg-gradient-casino-reverse border-2 border-casinoGreen/40 text-casinoGreen px-6 py-3 rounded-lg font-heading font-semibold hover:bg-casinoGreen hover:text-white hover:shadow-glow-green transition-all duration-300 uppercase tracking-wide text-sm"
              >
                ← Casinos
              </Link>
              <Link
                href="/admin"
                className="bg-gradient-casino-reverse border-2 border-casinoGold/40 text-casinoGold px-6 py-3 rounded-lg font-heading font-semibold hover:bg-casinoGold hover:text-casinoBlack hover:shadow-glow-gold transition-all duration-300 uppercase tracking-wide text-sm"
              >
                ⚙️ Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <SlotFilterBar onFilterChange={setFilters} />

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-casino-reverse border border-casinoGold/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">Total Slots</div>
            <div className="text-2xl font-heading font-bold text-casinoGold">{filteredSlots.length}</div>
          </div>
          <div className="bg-gradient-casino-reverse border border-casinoGreen/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">Avg RTP</div>
            <div className="text-2xl font-heading font-bold text-casinoGreen">{avgRtp}%</div>
          </div>
          <div className="bg-gradient-casino-reverse border border-casinoBlue/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">Bonus Buy Slots</div>
            <div className="text-2xl font-heading font-bold text-casinoBlue">
              {filteredSlots.filter(s => s.hasBonusBuy).length}
            </div>
          </div>
          <div className="bg-gradient-casino-reverse border border-casinoRed/20 rounded-lg p-4">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-1">Max Win</div>
            <div className="text-2xl font-heading font-bold text-casinoRed">
              {maxWinSlot ? `${maxWinSlot.maxWinMultiplier?.toLocaleString()}x` : '-'}
            </div>
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

        {/* No Results */}
        {!loading && filteredSlots.length === 0 && (
          <div className="text-center py-20 bg-gradient-casino-reverse rounded-xl border border-casinoGold/20 p-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-textSecondary text-xl font-heading mb-2">
              No slots found
            </p>
            <p className="text-textSecondary text-sm">
              Try adjusting your filters
            </p>
          </div>
        )}

        {/* Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredSlots.map((slot) => (
            <SlotCard key={slot.id} slot={slot} operators={operators} />
          ))}
        </div>
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
              © {new Date().getFullYear()} BetRadar Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
