'use client';

import { LiveScore } from '@/lib/types';

interface LiveScoreBannerProps {
  score: LiveScore;
}

/**
 * LiveScoreBanner Component
 *
 * Displays live score information inline under game titles
 * - Only shown when game is LIVE
 * - Shows current score and period/clock
 * - Subtle styling to not interfere with odds display
 * - No countdown timers or progress bars
 */
export default function LiveScoreBanner({ score }: LiveScoreBannerProps) {
  // Only show for live games
  if (score.status !== 'live') {
    return null;
  }

  // Don't show if no scores available
  if (score.homeScore === null || score.awayScore === null) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 py-2 px-4 bg-casinoRed/10 border border-casinoRed/30 rounded-lg mb-3">
      {/* LIVE indicator */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-casinoRed rounded-full animate-pulse shadow-glow"></span>
        <span className="text-casinoRed text-xs font-bold uppercase tracking-wide">
          LIVE
        </span>
      </div>

      {/* Score */}
      <div className="flex items-center gap-2 text-textPrimary">
        <span className="font-heading font-bold text-lg">
          {score.homeTeam}
        </span>
        <span className="text-casinoGold font-bold text-xl px-2">
          {score.homeScore}
        </span>
        <span className="text-textSecondary">—</span>
        <span className="text-casinoGold font-bold text-xl px-2">
          {score.awayScore}
        </span>
        <span className="font-heading font-bold text-lg">
          {score.awayTeam}
        </span>
      </div>

      {/* Period/Clock */}
      {score.displayClock && (
        <div className="ml-auto">
          <span className="text-textSecondary text-sm font-semibold">
            {score.displayClock}
          </span>
        </div>
      )}
    </div>
  );
}
