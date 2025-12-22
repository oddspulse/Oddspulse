'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import {
  HomeIcon,
  ChartIcon,
  DollarIcon,
  CasinoIcon,
} from '@/lib/icons';

const TABS = [
  { href: '/', label: 'Casino', icon: HomeIcon },
  { href: '/live-odds', label: 'Live Odds', icon: ChartIcon },
  { href: '/arbitrage', label: 'Arbitrage', icon: DollarIcon },
];

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-casinoBg">
      <main className="flex-1 px-4 pt-4 pb-24 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-50">
        <div className="max-w-md mx-auto bg-casinoSurfaceAlt/95 backdrop-blur-xl shadow-card rounded-2xl px-6 py-3 flex justify-between items-center mb-3 mx-4">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            const TabIcon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center text-xs transition-all duration-200"
              >
                <div className="mb-1">
                  <TabIcon size="md" />
                </div>
                <span
                  className={
                    active
                      ? 'px-3 py-1 rounded-full bg-gradient-to-b from-casinoOrangeLight to-casinoOrange text-black font-semibold shadow-glow text-xs nav-label'
                      : 'text-textSecondary text-xs nav-label'
                  }
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
