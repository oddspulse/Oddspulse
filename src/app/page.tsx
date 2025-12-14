'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { AppNavigation } from '@/components/AppNavigation';
import { AdPlaceholder } from '@/components/AdPlaceholder';
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

    // Auto-refresh every 10 minutes (backend cache controls actual external calls)
    const refreshInterval = setInterval(() => {
      console.log('[Home] Auto-refreshing operators...');
      fetchOperators();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [operators, filters]);

  const fetchOperators = async () => {
    try {
      // Fetch from promos API for auto-updated offers
      const response = await fetch('/api/promos');
      const data = await response.json();

      if (data.operators) {
        setOperators(data.operators);
        setFilteredOperators(data.operators);
        console.log(`[Home] Loaded ${data.operators.length} operators (${data.fromCache ? 'cached' : 'fresh'} data)`);
      }
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
    <div className="min-h-screen bg-gradient-casino pb-24">
      {/* Header */}
      <Navigation
        title="Odds Pulse"
        subtitle="Premium Sportsbook & Casino Comparison"
        emoji="🎰"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ad Placeholder */}
        <AdPlaceholder />

        {/* Original Operators Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 font-heading text-textPrimary">
            All Operators
          </h3>

          {/* Filter Bar */}
          <div className="rounded-xl2 bg-casinoSurface shadow-card p-6 mb-6 card-3d border border-white/5">
            <FilterBar onFilterChange={setFilters} />
          </div>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-casinoOrangeLight text-xl">✓</span>
              <p className="text-textSecondary">
                Showing <span className="font-bold gradient-text">{filteredOperators.length}</span> of{' '}
                <span className="font-bold text-textPrimary">{operators.length}</span> operators
              </p>
            </div>
            {filteredOperators.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-textSecondary">
                <span className="w-2 h-2 bg-casinoOrangeLight rounded-full animate-pulse shadow-glow"></span>
                <span>Live offers</span>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block">
                <div className="w-16 h-16 border-4 border-casinoOrange/30 border-t-casinoOrange rounded-full animate-spin shadow-glow"></div>
                <p className="text-textSecondary text-lg mt-4 font-heading">Loading operators...</p>
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && filteredOperators.length === 0 && (
            <div className="text-center py-20 rounded-xl2 bg-casinoSurface shadow-card border border-white/5 p-12">
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
        </div>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/5 mt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            {/* Warning */}
            <div className="flex items-center justify-center gap-2 text-casinoOrangeLight">
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
            <div className="w-24 h-0.5 bg-gradient-orange mx-auto rounded-full"></div>

            {/* Copyright */}
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
