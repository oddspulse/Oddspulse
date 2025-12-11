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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">BetRadar Hub</h1>
              <p className="text-blue-100 mt-2">
                Compare the best sportsbook & casino offers
              </p>
            </div>
            <Link
              href="/admin"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <FilterBar onFilterChange={setFilters} />

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredOperators.length}</span> of{' '}
            <span className="font-semibold">{operators.length}</span> operators
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading operators...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredOperators.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No operators found matching your filters.
            </p>
          </div>
        )}

        {/* Operator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOperators.map((operator) => (
            <OperatorCard key={operator.id} operator={operator} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Gambling can be addictive. Please play responsibly. 18+ only.
          </p>
        </div>
      </footer>
    </div>
  );
}
