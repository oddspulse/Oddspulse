'use client';

import { Operator } from '@/lib/types';

interface OperatorCardProps {
  operator: Operator;
}

export default function OperatorCard({ operator }: OperatorCardProps) {
  return (
    <div className="group rounded-xl2 shadow-card-dark hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-white/10 hover:border-white/20 card-3d bg-gradient-to-br from-casinoSurface to-casinoSurfaceAlt relative">
      {/* Logo Section */}
      <div className="glass border-b border-white/5 p-6 flex items-center justify-center h-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-casinoOrange/5 to-transparent"></div>
        <img
          src={operator.brandLogoUrl}
          alt={`${operator.name} logo`}
          className="max-h-16 max-w-full object-contain relative z-10 filter drop-shadow-lg"
        />
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Brand Name */}
        <h3 className="text-xl font-heading font-bold text-textPrimary mb-3">
          {operator.name}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {operator.regionTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 glass text-casinoBlue border border-casinoBlue/30 text-xs font-semibold rounded-full uppercase tracking-wide"
            >
              {tag}
            </span>
          ))}
          {operator.productTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 glass text-casinoGreen border border-casinoGreen/30 text-xs font-semibold rounded-full uppercase tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bonus Headline */}
        <div className="mb-5">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-casinoOrange text-lg mt-0.5">💰</span>
            <p className="text-lg font-heading font-bold gradient-text leading-tight">
              {operator.bonusHeadline}
            </p>
          </div>
          {operator.detailedOffer && (
            <p className="text-sm text-textSecondary line-clamp-3 leading-relaxed">
              {operator.detailedOffer}
            </p>
          )}
        </div>

        {/* RTP Info (if casino) */}
        {operator.rtpInfo && (
          <div className="mb-4 p-3 glass rounded-lg border border-casinoGreen/20">
            <p className="text-sm text-casinoGreen">
              <span className="font-semibold">🎰 RTP:</span> {operator.rtpInfo}
            </p>
          </div>
        )}

        {/* Promo Source Badge (if from feed) */}
        {operator.promoSource && operator.promoSource !== 'manual' && (
          <div className="mb-4 flex items-center gap-2 text-xs text-textSecondary">
            <span className="w-2 h-2 bg-casinoGreen rounded-full shadow-glow"></span>
            <span>Verified offer</span>
          </div>
        )}

        {/* CTA Button - Neon Green */}
        <a
          href={operator.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-medium bg-[#1ED760] text-black hover:bg-[#19C653] shadow-soft transition-all duration-200"
        >
          Join Now
        </a>

        {/* Trust Signal */}
        <p className="text-[10px] text-textSecondary text-center mt-2">
          Official site • 18+ • T&Cs apply
        </p>

        {/* Optional: "Hot Offer" badge for featured operators */}
        {operator.notes?.toLowerCase().includes('leading') && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-casinoRed to-casinoOrange text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-glow">
            🔥 Hot
          </div>
        )}
      </div>
    </div>
  );
}
