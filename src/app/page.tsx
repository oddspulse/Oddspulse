'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import OperatorCard from '@/components/OperatorCard';
import FilterBar from '@/components/FilterBar';
import { Operator } from '@/lib/types';

export default function HomePage() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [filteredOperators, setFilteredOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    region: 'all',
    product: 'all',
  });

  useEffect(() => {
    fetchOperators();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [operators, filters]);

  const fetchOperators = async () => {
    try {
      const response = await fetch('/api/operators');
      const data = await response.json();
      setOperators(data);
      setFilteredOperators(data);
    } catch (error) {
      console.error('Error fetching operators:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...operators];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (op) =>
          op.name.toLowerCase().includes(searchLower) ||
          op.bonusHeadline.toLowerCase().includes(searchLower)
      );
    }

    // Region filter
    if (filters.region !== 'all') {
      filtered = filtered.filter((op) =>
        op.regionTags.includes(filters.region)
      );
    }

    // Product filter
    if (filters.product !== 'all') {
      filtered = filtered.filter((op) =>
        op.productTags.includes(filters.product)
      );
    }

    setFilteredOperators(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-casino">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-casinoBlack/95 backdrop-blur-sm border-b-2 border-casinoGold/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <span className="text-4xl">🎰</span>
                <h1 className="text-3xl md:text-5xl font-heading font-bold bg-gradient-to-r from-casinoGold via-yellow-300 to-casinoGold bg-clip-text text-transparent animate-glow-gold">
                  BetRadar Hub
                </h1>
              </div>
              <p className="text-textSecondary mt-2 font-body">
                Premium Sportsbook & Casino Comparison
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/rtp-slots"
                className="bg-gradient-casino-reverse border-2 border-casinoGreen/40 text-casinoGreen px-6 py-3 rounded-lg font-heading font-semibold hover:bg-casinoGreen hover:text-white hover:shadow-glow-green transition-all duration-300 uppercase tracking-wide text-sm"
              >
                🎰 RTP Slots
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
        <FilterBar onFilterChange={setFilters} />

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-casinoGreen text-xl">✓</span>
            <p className="text-textSecondary">
              Showing <span className="font-bold text-casinoGold">{filteredOperators.length}</span> of{' '}
              <span className="font-bold text-textPrimary">{operators.length}</span> operators
            </p>
          </div>
          {filteredOperators.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-textSecondary">
              <span className="w-2 h-2 bg-casinoGreen rounded-full animate-pulse"></span>
              <span>Live offers</span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-16 h-16 border-4 border-casinoGold/30 border-t-casinoGold rounded-full animate-spin"></div>
              <p className="text-textSecondary text-lg mt-4 font-heading">Loading operators...</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredOperators.length === 0 && (
          <div className="text-center py-20 bg-gradient-casino-reverse rounded-xl border border-casinoGold/20 p-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-textSecondary text-xl font-heading mb-2">
              No operators found
            </p>
            <p className="text-textSecondary text-sm">
              Try adjusting your filters or search query
            </p>
          </div>
        )}

        {/* Operator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredOperators.map((operator) => (
            <OperatorCard key={operator.id} operator={operator} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-casinoBlack border-t-2 border-casinoGold/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            {/* Warning */}
            <div className="flex items-center justify-center gap-2 text-casinoRed">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-semibold uppercase tracking-wide">
                Gambling can be addictive
              </p>
            </div>

            {/* Responsible Gaming */}
            <p className="text-textSecondary text-sm">
              Please play responsibly. 18+ only.
            </p>

            {/* Divider */}
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-casinoGold to-transparent mx-auto"></div>

            {/* Copyright */}
            <p className="text-textSecondary text-xs">
              © {new Date().getFullYear()} BetRadar Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
