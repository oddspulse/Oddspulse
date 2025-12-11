'use client';

import { useState } from 'react';

interface FilterBarProps {
  onFilterChange: (filters: {
    search: string;
    region: string;
    product: string;
  }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');
  const [product, setProduct] = useState('all');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, region, product });
  };

  const handleRegionChange = (value: string) => {
    setRegion(value);
    onFilterChange({ search, region: value, product });
  };

  const handleProductChange = (value: string) => {
    setProduct(value);
    onFilterChange({ search, region, product: value });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search operators..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Region Filter */}
        <div>
          <label
            htmlFor="region"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Region
          </label>
          <select
            id="region"
            value={region}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Regions</option>
            <option value="US">United States</option>
            <option value="Canada">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="EU">Europe</option>
            <option value="Global">Global/Offshore</option>
          </select>
        </div>

        {/* Product Filter */}
        <div>
          <label
            htmlFor="product"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Product Type
          </label>
          <select
            id="product"
            value={product}
            onChange={(e) => handleProductChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Products</option>
            <option value="Sports">Sports Betting</option>
            <option value="Casino">Casino</option>
          </select>
        </div>
      </div>
    </div>
  );
}
