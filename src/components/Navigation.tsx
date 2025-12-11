'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLink {
  href: string;
  label: string;
  emoji: string;
  color: string;
  hoverColor: string;
}

const NAV_LINKS: NavLink[] = [
  {
    href: '/',
    label: 'Casinos',
    emoji: '🏠',
    color: 'casinoGreen',
    hoverColor: 'hover:bg-casinoGreen hover:text-white hover:shadow-glow-green',
  },
  {
    href: '/live-odds',
    label: 'Live Odds',
    emoji: '📊',
    color: 'casinoBlue',
    hoverColor: 'hover:bg-casinoBlue hover:text-white',
  },
  {
    href: '/arbitrage',
    label: 'Arbitrage',
    emoji: '💰',
    color: 'casinoGreen',
    hoverColor: 'hover:bg-casinoGreen hover:text-white hover:shadow-glow-green',
  },
  {
    href: '/rtp-slots',
    label: 'RTP Slots',
    emoji: '🎰',
    color: 'casinoGold',
    hoverColor: 'hover:bg-casinoGold hover:text-casinoBlack hover:shadow-glow-gold',
  },
  {
    href: '/admin',
    label: 'Admin',
    emoji: '⚙️',
    color: 'casinoRed',
    hoverColor: 'hover:bg-casinoRed hover:text-white',
  },
];

interface NavigationProps {
  title: string;
  subtitle: string;
  emoji: string;
  currentPage?: string;
}

export default function Navigation({ title, subtitle, emoji, currentPage }: NavigationProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-casinoBlack/95 backdrop-blur-sm border-b-2 border-casinoGold/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Title Section */}
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <span className="text-4xl">{emoji}</span>
              <h1 className="text-3xl md:text-5xl font-heading font-bold bg-gradient-to-r from-casinoGold via-yellow-300 to-casinoGold bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
            <p className="text-textSecondary mt-2 font-body">
              {subtitle}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-3 justify-center">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const baseClasses = "px-6 py-3 rounded-lg font-heading font-semibold transition-all duration-300 uppercase tracking-wide text-sm border-2";

              if (isActive) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${baseClasses} bg-${link.color} text-white border-${link.color} shadow-glow-gold`}
                  >
                    {link.emoji} {link.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${baseClasses} bg-gradient-casino-reverse border-${link.color}/40 text-${link.color} ${link.hoverColor}`}
                >
                  {link.emoji} {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
