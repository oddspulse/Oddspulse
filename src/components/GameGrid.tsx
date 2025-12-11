'use client';

import Link from 'next/link';

const GAMES = [
  { label: 'Live Odds', href: '/live-odds', emoji: '📊', gradient: 'from-casinoBlue to-casinoPurple' },
  { label: 'Arbitrage', href: '/arbitrage', emoji: '💰', gradient: 'from-casinoGreen to-casinoBlue' },
  { label: 'RTP Slots', href: '/rtp-slots', emoji: '🎰', gradient: 'from-casinoOrange to-casinoRed' },
  { label: 'Operators', href: '/', emoji: '🏢', gradient: 'from-casinoPurple to-casinoOrange' },
];

export function GameGrid() {
  return (
    <section className="mb-20">
      <h3 className="text-lg font-bold mb-4 font-heading text-textPrimary">
        Popular Games
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {GAMES.map((game, i) => (
          <Link
            key={i}
            href={game.href}
            className="block"
          >
            <div className="rounded-xl2 p-4 shadow-card bg-gradient-to-br from-casinoSurface to-casinoSurfaceAlt relative overflow-hidden card-3d border border-white/5 hover:border-white/10 transition-all duration-300">
              <span className="inline-flex px-3 py-1.5 rounded-full bg-black/40 text-xs shadow-soft backdrop-blur-sm font-medium">
                {game.label}
              </span>

              {/* Colorful gradient art */}
              <div className={`mt-4 h-24 rounded-xl bg-gradient-to-tr ${game.gradient} shadow-soft flex items-center justify-center relative overflow-hidden`}>
                <span className="text-5xl z-10">{game.emoji}</span>
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Decorative glow */}
              <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-casinoOrange/10 rounded-full blur-2xl" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
