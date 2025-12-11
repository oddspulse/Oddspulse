'use client';

import { OPERATORS } from '@/data/operators';

export function CasinoList() {
  return (
    <section className="mt-6 pb-6">
      <h3 className="text-sm font-semibold text-textSecondary mb-4 uppercase tracking-wide">
        Top Casinos
      </h3>

      <div className="space-y-3">
        {OPERATORS.map((op) => (
          <div
            key={op.id}
            className="rounded-xl2 bg-gradient-to-br from-casinoSurface to-casinoSurfaceAlt shadow-card p-4 flex items-center justify-between border border-white/5 hover:border-casinoOrange/30 transition-all duration-300"
          >
            <div className="flex-1">
              <p className="text-base font-bold text-textPrimary mb-1">{op.name}</p>
              {op.bonusHeadline && (
                <p className="text-xs text-textSecondary">{op.bonusHeadline}</p>
              )}
            </div>

            <a
              href={op.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2.5 rounded-full bg-gradient-to-b from-casinoOrangeLight to-casinoOrange text-black text-xs font-bold shadow-glow hover:shadow-glow-orange transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              Click to Claim →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
