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
    hoverColor: 'hover:shadow-glow-green hover:scale-105',
  },
  {
    href: '/live-odds',
    label: 'Live Odds',
    emoji: '📊',
    color: 'casinoBlue',
    hoverColor: 'hover:shadow-glow hover:scale-105',
  },
  {
    href: '/arbitrage',
    label: 'Arbitrage',
    emoji: '💰',
    color: 'casinoGreen',
    hoverColor: 'hover:shadow-glow-green hover:scale-105',
  },
  {
    href: '/rtp-slots',
    label: 'RTP Slots',
    emoji: '🎰',
    color: 'casinoGold',
    hoverColor: 'hover:shadow-glow-gold hover:scale-105',
  },
  {
    href: '/admin',
    label: 'Admin',
    emoji: '⚙️',
    color: 'casinoRed',
    hoverColor: 'hover:shadow-glow hover:scale-105',
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
    <header className="relative glass border-b border-white/5 shadow-card-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Title Section */}
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <span className="text-4xl drop-shadow-lg">{emoji}</span>
              <h1 className="text-3xl md:text-5xl font-heading font-bold gradient-text drop-shadow-lg">
                {title}
              </h1>
            </div>
            <p className="text-textSecondary mt-2 font-sans text-sm">
              {subtitle}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-3 justify-center">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              if (isActive) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-6 py-3 rounded-full font-heading font-semibold transition-all duration-300 uppercase tracking-wide text-xs bg-gradient-green text-white shadow-glow-green border border-casinoGreen animate-pulse"
                  >
                    {link.emoji} {link.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-3 rounded-full font-heading font-semibold transition-all duration-300 uppercase tracking-wide text-xs glass border border-white/10 text-textSecondary ${link.hoverColor}`}
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
