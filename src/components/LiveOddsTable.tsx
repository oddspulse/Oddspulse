'use client';

import { LiveEvent, LiveMarket, MarketOutcome, Operator } from '@/lib/types';
import { formatAmericanOdds, findBestOdds } from '@/lib/oddsService';
import { format } from 'date-fns';
import OperatorLogo from '@/components/OperatorLogo';

interface LiveOddsTableProps {
  events: LiveEvent[];
  selectedMarket: string;
  operators?: Operator[];
}

export default function LiveOddsTable({ events, selectedMarket, operators = [] }: LiveOddsTableProps) {
  // Helper function to get operator logo by ID
  const getOperatorLogo = (operatorId: string): string | undefined => {
    const operator = operators.find(op => op.id === operatorId);
    return operator?.logo;
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-gradient-casino-reverse rounded-xl border border-casinoGold/20 p-12">
        <span className="text-6xl mb-4 block">📊</span>
        <p className="text-textSecondary text-xl font-heading mb-2">
          No live events available
        </p>
        <p className="text-textSecondary text-sm">
          Check back later for upcoming games
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => {
        // Find the selected market for this event
        const market = event.markets.find(m => m.type === selectedMarket);
        if (!market) return null;

        // Group outcomes by label and find best odds
        const bestOdds = findBestOdds(market.outcomes);
        const labels = Array.from(bestOdds.keys());

        return (
          <div
            key={event.id}
            className="bg-gradient-casino-reverse rounded-xl shadow-card-dark border-2 border-casinoGold/20 overflow-hidden hover:border-casinoGold/40 transition-all duration-300"
          >
            {/* Event Header */}
            <div className="bg-casinoBlack2 border-b-2 border-casinoGold/10 p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-heading font-bold text-textPrimary">
                      {event.awayTeam} @ {event.homeTeam}
                    </h3>
                    {event.isLive && (
                      <span className="px-3 py-1 bg-casinoRed/20 border border-casinoRed text-casinoRed text-xs font-bold uppercase tracking-wide rounded-full animate-pulse">
                        🔴 Live
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-textSecondary">
                    <span className="flex items-center gap-1">
                      🏆 {event.league}
                    </span>
                    <span className="flex items-center gap-1">
                      🕐 {format(new Date(event.startTime), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2 bg-casinoGold/10 border border-casinoGold/30 rounded-lg">
                  <div className="text-xs text-textSecondary uppercase tracking-wide">Market</div>
                  <div className="text-sm font-heading font-bold text-casinoGold capitalize">
                    {selectedMarket}
                  </div>
                </div>
              </div>
            </div>

            {/* Odds Grid */}
            <div className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {labels.map((label) => {
                  const labelOutcomes = market.outcomes.filter(o => o.label === label);
                  const best = bestOdds.get(label);

                  return (
                    <div key={label} className="space-y-3">
                      {/* Outcome Label */}
                      <div className="flex items-center justify-between bg-casinoBlack3 px-4 py-2 rounded-lg border border-casinoGold/20">
                        <span className="font-heading font-semibold text-textPrimary">
                          {label}
                        </span>
                        {best && (
                          <span className="text-xs text-casinoGreen font-semibold uppercase tracking-wide">
                            Best: {formatAmericanOdds(best.odds)}
                          </span>
                        )}
                      </div>

                      {/* Operator Odds */}
                      <div className="space-y-2">
                        {labelOutcomes.map((outcome, idx) => {
                          const isBest = best && outcome.operatorId === best.operatorId;
                          return (
                            <a
                              key={`${outcome.operatorId}-${idx}`}
                              href={outcome.affiliateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`
                                flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200
                                ${isBest
                                  ? 'bg-casinoGreen/10 border-casinoGreen hover:bg-casinoGreen/20 hover:shadow-glow-green'
                                  : 'bg-casinoBlack border-casinoGold/20 hover:border-casinoGold/40 hover:bg-casinoBlack2'
                                }
                              `}
                            >
                              <div className="flex items-center gap-3">
                                {/* Operator Logo */}
                                {getOperatorLogo(outcome.operatorId) && (
                                  <OperatorLogo
                                    src={getOperatorLogo(outcome.operatorId)!}
                                    alt={`${outcome.operatorName} logo`}
                                  />
                                )}
                                {/* Operator Name */}
                                <span className={`font-semibold ${isBest ? 'text-casinoGreen' : 'text-textPrimary'}`}>
                                  {outcome.operatorName}
                                </span>
                                {isBest && (
                                  <span className="px-2 py-0.5 bg-casinoGreen text-casinoBlack text-xs font-bold rounded uppercase">
                                    Best
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                {outcome.point !== undefined && (
                                  <span className="text-textSecondary text-sm font-semibold">
                                    {outcome.point > 0 ? '+' : ''}{outcome.point}
                                  </span>
                                )}
                                <span className={`text-lg font-heading font-bold ${isBest ? 'text-casinoGreen' : 'text-casinoGold'}`}>
                                  {formatAmericanOdds(outcome.odds)}
                                </span>
                                <span className="text-casinoGold">→</span>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
