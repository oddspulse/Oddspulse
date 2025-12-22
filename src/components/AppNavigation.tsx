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
  { href: '/', label: 'Casino', icon: HomeIcon },
  { href: '/live-odds', label: 'Sports Odds', icon: ChartIcon },
  { href: '/prediction-markets', label: 'Predictions', icon: CrystalIcon },
  { href: '/arbitrage', label: 'Arbitrage', icon: DollarIcon },
  { href: '/news', label: 'News', icon: NewsIcon },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="max-w-md mx-auto px-4 pb-4">
        <div className="glass rounded-3xl shadow-card-dark border border-white/5 px-4 py-4">
          <div className="flex justify-between items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              const ItemIcon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center text-xs transition-all duration-200 min-w-[60px]"
                >
                  <div className="mb-1.5">
                    <ItemIcon
                      size="md"
                      className={active ? 'stroke-casinoGold' : 'stroke-textSecondary'}
                    />
                  </div>
                  <span
                    className={
                      active
                        ? 'px-3 py-1.5 rounded-full bg-gradient-orange text-white font-bold shadow-glow text-xs nav-label'
                        : 'text-textSecondary text-xs nav-label'
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
