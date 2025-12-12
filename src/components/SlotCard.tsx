'use client';

import { SlotGame, Operator } from '@/lib/types';
import providersData from '@/data/providers.json';

interface SlotCardProps {
  slot: SlotGame;
  operators: Operator[];
}

export default function SlotCard({ slot, operators }: SlotCardProps) {
  // Get provider info
  const provider = providersData.find(p => p.id === slot.provider);
  const providerColor = provider?.color || '#9E9E9E';
  const providerName = provider?.name || slot.provider;

  // Get volatility color
  const getVolatilityColor = (vol?: string) => {
    switch (vol) {
      case 'Low': return 'text-casinoGreen border-casinoGreen/30 bg-casinoGreen/20';
      case 'Medium': return 'text-casinoBlue border-casinoBlue/30 bg-casinoBlue/20';
      case 'High': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/20';
      case 'Extreme': return 'text-casinoRed border-casinoRed/30 bg-casinoRed/20';
      default: return 'text-textSecondary border-textSecondary/30 bg-textSecondary/20';
    }
  };

  // Get supported casino operators
  const supportedOperators = operators.filter(op =>
    slot.supportedCasinos.includes(op.id)
  );

  return (
    <div className="group bg-gradient-casino rounded-xl shadow-card-dark hover:shadow-card-hover transition-all duration-300 overflow-hidden border-2 border-casinoGold/20 hover:border-casinoGold/60">
      {/* Header with Provider Badge */}
      <div className="bg-casinoBlack2 border-b-2 border-casinoGold/10 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-heading font-bold text-textPrimary mb-2 group-hover:text-casinoGold transition-colors duration-200">
              {slot.gameName}
            </h3>
            <div
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
              style={{ backgroundColor: `${providerColor}20`, color: providerColor, borderColor: `${providerColor}40`, borderWidth: '1px' }}
            >
              {providerName}
            </div>
          </div>

          {/* RTP Badge */}
          <div className="flex flex-col items-end gap-1">
            <div className="bg-casinoGold/20 border-2 border-casinoGold px-4 py-2 rounded-lg">
              <div className="text-xs text-textSecondary uppercase tracking-wide">RTP</div>
              <div className="text-xl font-heading font-bold text-casinoGold">{slot.rtp}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Volatility */}
          {slot.volatility && (
            <div className={`px-3 py-2 rounded-lg border ${getVolatilityColor(slot.volatility)}`}>
              <div className="text-xs opacity-80 uppercase tracking-wide">Volatility</div>
              <div className="font-heading font-bold text-sm">{slot.volatility}</div>
            </div>
          )}

          {/* Max Win */}
          {slot.maxWinMultiplier && (
            <div className="px-3 py-2 rounded-lg border border-casinoGreen/30 bg-casinoGreen/20 text-casinoGreen">
              <div className="text-xs opacity-80 uppercase tracking-wide">Max Win</div>
              <div className="font-heading font-bold text-sm">{slot.maxWinMultiplier.toLocaleString()}x</div>
            </div>
          )}

          {/* Paylines */}
          {slot.paylines && (
            <div className="px-3 py-2 rounded-lg border border-casinoBlue/30 bg-casinoBlue/20 text-casinoBlue">
              <div className="text-xs opacity-80 uppercase tracking-wide">Paylines</div>
              <div className="font-heading font-bold text-sm">{slot.paylines}</div>
            </div>
          )}

          {/* Release Year */}
          {slot.releaseYear && (
            <div className="px-3 py-2 rounded-lg border border-textSecondary/30 bg-textSecondary/10 text-textSecondary">
              <div className="text-xs opacity-80 uppercase tracking-wide">Released</div>
              <div className="font-heading font-bold text-sm">{slot.releaseYear}</div>
            </div>
          )}
        </div>

        {/* Mechanic Tags */}
        {slot.mechanicTags && slot.mechanicTags.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-2">Features</div>
            <div className="flex flex-wrap gap-2">
              {slot.mechanicTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-casinoGold/20 text-casinoGold border border-casinoGold/30 text-xs font-semibold rounded uppercase tracking-wide"
                >
                  {tag}
                </span>
              ))}
              {slot.hasBonusBuy && (
                <span className="px-2 py-1 bg-casinoRed/20 text-casinoRed border border-casinoRed/30 text-xs font-semibold rounded uppercase tracking-wide">
                  💰 Bonus Buy
                </span>
              )}
            </div>
          </div>
        )}

        {/* Supported Casinos */}
        {supportedOperators.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-textSecondary uppercase tracking-wide mb-2">
              Available at {supportedOperators.length} casino{supportedOperators.length !== 1 ? 's' : ''}
            </div>
            <div className="flex flex-wrap gap-2">
              {supportedOperators.slice(0, 3).map((op) => (
                <a
                  key={op.id}
                  href={op.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-casinoSurfaceAlt border border-white/10 text-textPrimary text-xs font-medium rounded hover:bg-casinoSurface hover:border-white/20 transition-all duration-200"
                >
                  {op.name}
                </a>
              ))}
              {supportedOperators.length > 3 && (
                <span className="px-3 py-1.5 bg-casinoBlack3 border border-textSecondary/30 text-textSecondary text-xs font-semibold rounded">
                  +{supportedOperators.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Join Now Button - Professional Style */}
        {supportedOperators.length > 0 && (
          <div>
            <a
              href={supportedOperators[0].affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-medium bg-casinoSurfaceAlt text-textPrimary border border-white/10 shadow-soft hover:bg-casinoSurface hover:border-white/20 transition-all duration-200"
            >
              Join Now
            </a>
            <p className="text-[10px] text-textSecondary text-center mt-2">
              Official site • 18+ • T&Cs apply
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
