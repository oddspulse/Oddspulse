'use client';

import { useState } from 'react';
import providersData from '@/data/providers.json';

interface SlotFilterBarProps {
  onFilterChange: (filters: {
    search: string;
    provider: string;
    minRtp: number;
    volatility: string;
    hasBonusBuy: string;
    minMaxWin: number;
    mechanic: string;
  }) => void;
}

export default function SlotFilterBar({ onFilterChange }: SlotFilterBarProps) {
  const [search, setSearch] = useState('');
  const [provider, setProvider] = useState('all');
  const [minRtp, setMinRtp] = useState(0);
  const [volatility, setVolatility] = useState('all');
  const [hasBonusBuy, setHasBonusBuy] = useState('all');
  const [minMaxWin, setMinMaxWin] = useState(0);
  const [mechanic, setMechanic] = useState('all');

  const handleFilterChange = (updates: Partial<typeof filters>) => {
    const newFilters = { ...filters, ...updates };
    onFilterChange(newFilters);
  };

  const filters = {
    search,
    provider,
    minRtp,
    volatility,
    hasBonusBuy,
    minMaxWin,
    mechanic,
  };

  return (
    <div className="bg-gradient-casino-reverse rounded-xl shadow-card-dark p-6 mb-8 border border-casinoGold/20">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-casinoGold text-xl">🎰</span>
        <h2 className="text-lg font-heading font-bold text-casinoGold uppercase tracking-wide">
          Find High-RTP Slots
        </h2>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label
            htmlFor="search"
            className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide"
          >
            🔍 Search Game
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search slot names..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleFilterChange({ search: e.target.value });
            }}
            className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGold/30 rounded-lg text-textPrimary placeholder-textSecondary focus:ring-2 focus:ring-casinoGold focus:border-casinoGold transition-all duration-200 outline-none"
          />
        </div>

        {/* Provider */}
        <div className="lg:col-span-2">
          <label
            htmlFor="provider"
            className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide"
          >
            🏢 Provider
          </label>
          <select
            id="provider"
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              handleFilterChange({ provider: e.target.value });
            }}
            className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGold/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoGold focus:border-casinoGold transition-all duration-200 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23F5C242%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
          >
            <option value="all" className="bg-casinoBlack">All Providers</option>
            {providersData.map((p) => (
              <option key={p.id} value={p.id} className="bg-casinoBlack">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Min RTP */}
        <div>
          <label
            htmlFor="minRtp"
            className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide"
          >
            💎 Min RTP
          </label>
          <select
            id="minRtp"
            value={minRtp}
            onChange={(e) => {
              const value = Number(e.target.value);
              setMinRtp(value);
              handleFilterChange({ minRtp: value });
            }}
            className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGreen/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoGreen focus:border-casinoGreen transition-all duration-200 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23F5C242%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
          >
            <option value="0" className="bg-casinoBlack">All RTPs</option>
            <option value="95" className="bg-casinoBlack">95%+</option>
            <option value="96" className="bg-casinoBlack">96%+</option>
            <option value="96.5" className="bg-casinoBlack">96.5%+</option>
            <option value="97" className="bg-casinoBlack">97%+</option>
          </select>
        </div>

        {/* Volatility */}
        <div>
          <label
            htmlFor="volatility"
            className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide"
          >
            ⚡ Volatility
          </label>
          <select
            id="volatility"
            value={volatility}
            onChange={(e) => {
              setVolatility(e.target.value);
              handleFilterChange({ volatility: e.target.value });
            }}
            className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoBlue/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoBlue focus:border-casinoBlue transition-all duration-200 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23F5C242%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
          >
            <option value="all" className="bg-casinoBlack">All Volatility</option>
            <option value="Low" className="bg-casinoBlack">Low</option>
            <option value="Medium" className="bg-casinoBlack">Medium</option>
            <option value="High" className="bg-casinoBlack">High</option>
            <option value="Extreme" className="bg-casinoBlack">Extreme</option>
          </select>
        </div>

        {/* Bonus Buy */}
        <div>
          <label
            htmlFor="bonusBuy"
            className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide"
          >
            💰 Bonus Buy
          </label>
          <select
            id="bonusBuy"
            value={hasBonusBuy}
            onChange={(e) => {
              setHasBonusBuy(e.target.value);
              handleFilterChange({ hasBonusBuy: e.target.value });
            }}
            className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoRed/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoRed focus:border-casinoRed transition-all duration-200 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23F5C242%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
          >
            <option value="all" className="bg-casinoBlack">All Slots</option>
            <option value="yes" className="bg-casinoBlack">Bonus Buy Only</option>
            <option value="no" className="bg-casinoBlack">No Bonus Buy</option>
          </select>
        </div>

        {/* Max Win */}
        <div>
          <label
            htmlFor="maxWin"
            className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide"
          >
            🚀 Min Max Win
          </label>
          <select
            id="maxWin"
            value={minMaxWin}
            onChange={(e) => {
              const value = Number(e.target.value);
              setMinMaxWin(value);
              handleFilterChange({ minMaxWin: value });
            }}
            className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGold/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoGold focus:border-casinoGold transition-all duration-200 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23F5C242%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
          >
            <option value="0" className="bg-casinoBlack">All Max Wins</option>
            <option value="5000" className="bg-casinoBlack">5,000x+</option>
            <option value="10000" className="bg-casinoBlack">10,000x+</option>
            <option value="20000" className="bg-casinoBlack">20,000x+</option>
            <option value="50000" className="bg-casinoBlack">50,000x+</option>
            <option value="100000" className="bg-casinoBlack">100,000x+</option>
          </select>
        </div>

        {/* Mechanics */}
        <div>
          <label
            htmlFor="mechanic"
            className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide"
          >
            🎮 Mechanic
          </label>
          <select
            id="mechanic"
            value={mechanic}
            onChange={(e) => {
              setMechanic(e.target.value);
              handleFilterChange({ mechanic: e.target.value });
            }}
            className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGreen/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoGreen focus:border-casinoGreen transition-all duration-200 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23F5C242%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
          >
            <option value="all" className="bg-casinoBlack">All Mechanics</option>
            <option value="Megaways" className="bg-casinoBlack">Megaways</option>
            <option value="xWays" className="bg-casinoBlack">xWays</option>
            <option value="xNudge" className="bg-casinoBlack">xNudge</option>
            <option value="Cluster Pays" className="bg-casinoBlack">Cluster Pays</option>
            <option value="Cascading Reels" className="bg-casinoBlack">Cascading Reels</option>
          </select>
        </div>
      </div>

      {/* Quick Filter Pills */}
      <div className="pt-4 border-t border-casinoGold/10">
        <div className="text-xs text-textSecondary uppercase tracking-wide mb-3">Quick Filters</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setMinRtp(96.5);
              handleFilterChange({ minRtp: 96.5 });
            }}
            className="px-4 py-2 bg-casinoGreen/20 hover:bg-casinoGreen/30 border border-casinoGreen/30 text-casinoGreen rounded-lg text-xs font-semibold uppercase tracking-wide transition-all duration-200"
          >
            High RTP (96.5%+)
          </button>
          <button
            onClick={() => {
              setHasBonusBuy('yes');
              handleFilterChange({ hasBonusBuy: 'yes' });
            }}
            className="px-4 py-2 bg-casinoRed/20 hover:bg-casinoRed/30 border border-casinoRed/30 text-casinoRed rounded-lg text-xs font-semibold uppercase tracking-wide transition-all duration-200"
          >
            Bonus Buy Slots
          </button>
          <button
            onClick={() => {
              setMechanic('Megaways');
              handleFilterChange({ mechanic: 'Megaways' });
            }}
            className="px-4 py-2 bg-casinoGold/20 hover:bg-casinoGold/30 border border-casinoGold/30 text-casinoGold rounded-lg text-xs font-semibold uppercase tracking-wide transition-all duration-200"
          >
            Megaways
          </button>
          <button
            onClick={() => {
              setMinMaxWin(50000);
              handleFilterChange({ minMaxWin: 50000 });
            }}
            className="px-4 py-2 bg-casinoBlue/20 hover:bg-casinoBlue/30 border border-casinoBlue/30 text-casinoBlue rounded-lg text-xs font-semibold uppercase tracking-wide transition-all duration-200"
          >
            50,000x+ Max Win
          </button>
        </div>
      </div>
    </div>
  );
}
