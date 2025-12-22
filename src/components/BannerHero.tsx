'use client';

import { DollarIcon } from '@/lib/icons';

export default function BannerHero() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-casinoBlack via-casinoBlack2 to-casinoBlack border-y border-casinoGold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {/* Main Brand Text */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-4">
            <span className="gradient-text">ODDS PULSE</span>
          </h1>

          {/* Pulse Line Graphic */}
          <div className="mb-6 w-full max-w-md">
            <svg
              viewBox="0 0 400 60"
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M0,30 L80,30 L100,10 L120,50 L140,20 L160,40 L180,30 L400,30"
                fill="none"
                stroke="url(#pulseGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F5C242" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#F5C242" stopOpacity="1" />
                  <stop offset="100%" stopColor="#F5C242" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Tagline */}
          <p className="text-textSecondary text-base sm:text-lg font-semibold uppercase tracking-wider">
            Compare • Analyze • Win
          </p>
        </div>

        {/* Decorative Elements - Coins and Sports Icons */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {/* Coins - Left Side */}
          <div className="absolute top-1/4 left-[5%] hidden sm:block animate-pulse">
            <DollarIcon size="xl" className="stroke-casinoGold" />
          </div>
          <div className="absolute bottom-1/4 left-[10%] hidden md:block animate-pulse">
            <DollarIcon size="lg" className="stroke-casinoOrange" />
          </div>

          {/* Coins - Right Side */}
          <div className="absolute top-1/3 right-[8%] hidden sm:block animate-pulse">
            <DollarIcon size="lg" className="stroke-casinoGold" />
          </div>
          <div className="absolute bottom-1/3 right-[12%] hidden md:block animate-pulse">
            <DollarIcon size="xl" className="stroke-casinoOrange" />
          </div>

          {/* Sports Icons - Subtle Background */}
          <div className="absolute top-[15%] left-[20%] hidden lg:block">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" className="stroke-casinoGold"/>
            </svg>
          </div>
          <div className="absolute bottom-[20%] right-[20%] hidden lg:block">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" className="stroke-casinoOrange"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
