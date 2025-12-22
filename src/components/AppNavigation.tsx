'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ChartIcon,
  CrystalIcon,
  DollarIcon,
  CasinoIcon,
  NewsIcon,
} from '@/lib/icons';

const NAV_ITEMS = [
  { href: '/', label: 'Casino', shortLabel: 'Casino', icon: HomeIcon },
  { href: '/live-odds', label: 'Sports Odds', shortLabel: 'Odds', icon: ChartIcon },
  { href: '/prediction-markets', label: 'Predictions', shortLabel: 'Predict', icon: CrystalIcon },
  { href: '/arbitrage', label: 'Arbitrage', shortLabel: 'Arb', icon: DollarIcon },
  { href: '/news', label: 'News', shortLabel: 'News', icon: NewsIcon },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="max-w-md mx-auto px-2 pb-3">
        <div className="glass rounded-3xl shadow-card-dark border border-white/5 px-2 py-3">
          <div className="flex justify-around items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              const ItemIcon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center transition-all duration-200 flex-1 max-w-[70px]"
                >
                  <div className="mb-1">
                    <ItemIcon
                      size="sm"
                      className={active ? 'stroke-casinoGold' : 'stroke-textSecondary'}
                    />
                  </div>
                  <span
                    className={
                      active
                        ? 'px-2 py-0.5 rounded-full bg-gradient-orange text-white font-bold shadow-glow text-[9px] leading-tight whitespace-nowrap'
                        : 'text-textSecondary text-[9px] leading-tight whitespace-nowrap'
                    }
                  >
                    {item.shortLabel}
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
