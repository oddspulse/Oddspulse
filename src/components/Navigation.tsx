'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  HomeIcon,
  ChartIcon,
  CrystalIcon,
  DollarIcon,
  CasinoIcon,
  NewsIcon,
  SettingsIcon,
} from '@/lib/icons';

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  hoverColor: string;
}

const NAV_LINKS: NavLink[] = [
  {
    href: '/',
    label: 'Casino',
    icon: HomeIcon,
    color: 'casinoGreen',
    hoverColor: 'hover:shadow-glow-green hover:scale-105',
  },
  {
    href: '/live-odds',
    label: 'Live Odds',
    icon: ChartIcon,
    color: 'casinoBlue',
    hoverColor: 'hover:shadow-glow hover:scale-105',
  },
  {
    href: '/prediction-markets',
    label: 'Prediction Markets',
    icon: CrystalIcon,
    color: 'casinoGold',
    hoverColor: 'hover:shadow-glow-gold hover:scale-105',
  },
  {
    href: '/arbitrage',
    label: 'Arbitrage',
    icon: DollarIcon,
    color: 'casinoGreen',
    hoverColor: 'hover:shadow-glow-green hover:scale-105',
  },
  {
    href: '/news',
    label: 'News',
    icon: NewsIcon,
    color: 'casinoOrange',
    hoverColor: 'hover:shadow-glow-orange hover:scale-105',
  },
  {
    href: '/admin',
    label: 'Admin',
    icon: SettingsIcon,
    color: 'casinoRed',
    hoverColor: 'hover:shadow-glow hover:scale-105',
  },
];

interface NavigationProps {
  title: string;
  subtitle: string;
  icon?: React.ComponentType<any>;
  currentPage?: string;
}

export default function Navigation({ title, subtitle, icon: Icon }: NavigationProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Filter nav links: Show Admin link ONLY if user is admin
  const visibleLinks = NAV_LINKS.filter((link) => {
    if (link.href === '/admin') {
      return session?.user?.isAdmin === true;
    }
    return true; // Show all other links
  });

  return (
    <header className="relative glass border-b border-white/5 shadow-card-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Title Section */}
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              {Icon && (
                <div className="flex items-center justify-center">
                  <Icon size="xl" />
                </div>
              )}
              <h1 className="text-3xl md:text-5xl font-heading font-bold gradient-text drop-shadow-lg page-title">
                {title}
              </h1>
            </div>
            <p className="text-textSecondary mt-2 font-sans text-sm">
              {subtitle}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-3 justify-center">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href;
              const LinkIcon = link.icon;

              if (isActive) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-6 py-3 rounded-full font-heading font-semibold transition-all duration-300 nav-label text-xs bg-gradient-green text-white shadow-glow-green border border-casinoGreen animate-pulse flex items-center gap-2"
                  >
                    <LinkIcon size="sm" />
                    <span>{link.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-3 rounded-full font-heading font-semibold transition-all duration-300 nav-label text-xs glass border border-white/10 text-textSecondary ${link.hoverColor} flex items-center gap-2`}
                >
                  <LinkIcon size="sm" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
