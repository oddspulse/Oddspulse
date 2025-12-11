import { LiveEvent, ArbitrageOpportunity, ArbitrageBet, MarketOutcome } from './types';

// Convert American odds to decimal odds
export function toDecimal(americanOdds: number): number {
  if (americanOdds > 0) {
    return (americanOdds / 100) + 1;
  } else {
    return (100 / Math.abs(americanOdds)) + 1;
  }
}

// Calculate arbitrage opportunities for a set of events
export function findArbitrageOpportunities(
  events: LiveEvent[],
  minProfit: number = 0.5, // minimum 0.5% profit
  totalStake: number = 1000 // default stake amount
): ArbitrageOpportunity[] {
  const opportunities: ArbitrageOpportunity[] = [];

  events.forEach(event => {
    event.markets.forEach(market => {
      // Group outcomes by label (e.g., all "Home" outcomes, all "Away" outcomes)
      const outcomeGroups = new Map<string, MarketOutcome[]>();

      market.outcomes.forEach(outcome => {
        // Normalize label for grouping (remove team names, keep just position/type)
        const normalizedLabel = outcome.label.split('(')[0].trim();
        const group = outcomeGroups.get(normalizedLabel) || [];
        group.push(outcome);
        outcomeGroups.set(normalizedLabel, group);
      });

      // For each outcome group, find the best odds
      const bestOdds = new Map<string, MarketOutcome>();
      outcomeGroups.forEach((outcomes, label) => {
        // Find highest odds (best value)
        const best = outcomes.reduce((max, curr) =>
          toDecimal(curr.odds) > toDecimal(max.odds) ? curr : max
        );
        bestOdds.set(label, best);
      });

      // Check if there's an arbitrage opportunity
      // For 2-way markets (moneyline without draw)
      if (bestOdds.size === 2) {
        const [outcome1, outcome2] = Array.from(bestOdds.values());
        const decimal1 = toDecimal(outcome1.odds);
        const decimal2 = toDecimal(outcome2.odds);

        // Calculate implied probabilities
        const impliedProb1 = 1 / decimal1;
        const impliedProb2 = 1 / decimal2;
        const totalImpliedProb = impliedProb1 + impliedProb2;

        // If total implied probability < 1, there's an arbitrage opportunity
        if (totalImpliedProb < 1) {
          const profit = ((1 / totalImpliedProb) - 1) * 100; // percentage profit

          if (profit >= minProfit) {
            // Calculate stakes
            const stake1 = (totalStake * impliedProb1) / totalImpliedProb;
            const stake2 = (totalStake * impliedProb2) / totalImpliedProb;

            const potentialReturn1 = stake1 * decimal1;
            const potentialReturn2 = stake2 * decimal2;

            opportunities.push({
              id: `${event.id}-${market.type}`,
              sport: event.sport,
              league: event.league,
              homeTeam: event.homeTeam,
              awayTeam: event.awayTeam,
              startTime: event.startTime,
              marketType: market.type,
              profit,
              totalStake,
              bets: [
                {
                  outcome: outcome1.label,
                  operatorId: outcome1.operatorId,
                  operatorName: outcome1.operatorName,
                  odds: outcome1.odds,
                  decimalOdds: decimal1,
                  stake: stake1,
                  potentialReturn: potentialReturn1,
                  affiliateUrl: outcome1.affiliateUrl,
                },
                {
                  outcome: outcome2.label,
                  operatorId: outcome2.operatorId,
                  operatorName: outcome2.operatorName,
                  odds: outcome2.odds,
                  decimalOdds: decimal2,
                  stake: stake2,
                  potentialReturn: potentialReturn2,
                  affiliateUrl: outcome2.affiliateUrl,
                }
              ]
            });
          }
        }
      }

      // For 3-way markets (moneyline with draw, totals with push)
      if (bestOdds.size === 3) {
        const [outcome1, outcome2, outcome3] = Array.from(bestOdds.values());
        const decimal1 = toDecimal(outcome1.odds);
        const decimal2 = toDecimal(outcome2.odds);
        const decimal3 = toDecimal(outcome3.odds);

        const impliedProb1 = 1 / decimal1;
        const impliedProb2 = 1 / decimal2;
        const impliedProb3 = 1 / decimal3;
        const totalImpliedProb = impliedProb1 + impliedProb2 + impliedProb3;

        if (totalImpliedProb < 1) {
          const profit = ((1 / totalImpliedProb) - 1) * 100;

          if (profit >= minProfit) {
            const stake1 = (totalStake * impliedProb1) / totalImpliedProb;
            const stake2 = (totalStake * impliedProb2) / totalImpliedProb;
            const stake3 = (totalStake * impliedProb3) / totalImpliedProb;

            opportunities.push({
              id: `${event.id}-${market.type}`,
              sport: event.sport,
              league: event.league,
              homeTeam: event.homeTeam,
              awayTeam: event.awayTeam,
              startTime: event.startTime,
              marketType: market.type,
              profit,
              totalStake,
              bets: [
                {
                  outcome: outcome1.label,
                  operatorId: outcome1.operatorId,
                  operatorName: outcome1.operatorName,
                  odds: outcome1.odds,
                  decimalOdds: decimal1,
                  stake: stake1,
                  potentialReturn: stake1 * decimal1,
                  affiliateUrl: outcome1.affiliateUrl,
                },
                {
                  outcome: outcome2.label,
                  operatorId: outcome2.operatorId,
                  operatorName: outcome2.operatorName,
                  odds: outcome2.odds,
                  decimalOdds: decimal2,
                  stake: stake2,
                  potentialReturn: stake2 * decimal2,
                  affiliateUrl: outcome2.affiliateUrl,
                },
                {
                  outcome: outcome3.label,
                  operatorId: outcome3.operatorId,
                  operatorName: outcome3.operatorName,
                  odds: outcome3.odds,
                  decimalOdds: decimal3,
                  stake: stake3,
                  potentialReturn: stake3 * decimal3,
                  affiliateUrl: outcome3.affiliateUrl,
                }
              ]
            });
          }
        }
      }
    });
  });

  // Sort by profit descending
  return opportunities.sort((a, b) => b.profit - a.profit);
}
