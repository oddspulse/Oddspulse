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
    <div className="bg-gradient-casino-reverse rounded-xl shadow-card-dark p-6 mb-8 border border-casinoGold/20">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-casinoGold text-xl">🎯</span>
        <h2 className="text-lg font-heading font-bold text-casinoGold uppercase tracking-wide">
          Find Your Perfect Match
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide"
          >
            🔍 Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search operators..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGold/30 rounded-lg text-textPrimary placeholder-textSecondary focus:ring-2 focus:ring-casinoGold focus:border-casinoGold transition-all duration-200 outline-none"
          />
        </div>

        {/* Region Filter */}
        <div>
          <label
            htmlFor="region"
            className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide"
          >
            🌍 Region
          </label>
          <select
            id="region"
            value={region}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoBlue/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoBlue focus:border-casinoBlue transition-all duration-200 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23F5C242%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
          >
            <option value="all" className="bg-casinoBlack">All Regions</option>
            <option value="US" className="bg-casinoBlack">🇺🇸 United States</option>
            <option value="Canada" className="bg-casinoBlack">🇨🇦 Canada</option>
            <option value="UK" className="bg-casinoBlack">🇬🇧 United Kingdom</option>
            <option value="EU" className="bg-casinoBlack">🇪🇺 Europe</option>
            <option value="Global" className="bg-casinoBlack">🌐 Global/Offshore</option>
          </select>
        </div>

        {/* Product Filter */}
        <div>
          <label
            htmlFor="product"
            className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide"
          >
            🎲 Product Type
          </label>
          <select
            id="product"
            value={product}
            onChange={(e) => handleProductChange(e.target.value)}
            className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGreen/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoGreen focus:border-casinoGreen transition-all duration-200 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23F5C242%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
          >
            <option value="all" className="bg-casinoBlack">All Products</option>
            <option value="Sports" className="bg-casinoBlack">⚽ Sports Betting</option>
            <option value="Casino" className="bg-casinoBlack">🎰 Casino</option>
          </select>
        </div>
      </div>
    </div>
  );
}
