'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Casino', icon: '🏠' },
  { href: '/live-odds', label: 'Live Odds', icon: '📊' },
  { href: '/arbitrage', label: 'Arbitrage', icon: '💰' },
  { href: '/rtp-slots', label: 'Slots', icon: '🎰' },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="max-w-md mx-auto px-4 pb-4">
        <div className="glass rounded-3xl shadow-card-dark border border-white/5 px-6 py-3">
          <div className="flex justify-between items-center">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center text-xs transition-all duration-200"
                >
                  <span className="text-xl mb-1">{item.icon}</span>
                  <span
                    className={
                      active
                        ? 'px-3 py-1 rounded-full bg-gradient-orange text-casinoBlack font-semibold shadow-glow text-xs'
                        : 'text-textSecondary text-xs'
                    }
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
