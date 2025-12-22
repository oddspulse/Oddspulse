'use client';

import { SPORT_KEYS } from '@/lib/oddsService';
import { MarketType } from '@/lib/types';
import {
  FootballIcon,
  BasketballIcon,
  HockeyIcon,
  BaseballIcon,
  SoccerIcon,
  ChampionsLeagueIcon,
  UfcIcon,
  TennisIcon,
  GolfIcon,
  MoneylineIcon,
  SpreadIcon,
  TotalIcon,
  TrophyIconExport,
  ChartLineIcon,
} from '@/lib/icons';

interface SportSelectorProps {
  selectedSport: string;
  selectedMarket: MarketType;
  onSportChange: (sport: string) => void;
  onMarketChange: (market: MarketType) => void;
}

const SPORTS = [
  { key: SPORT_KEYS.NFL, name: 'NFL', icon: FootballIcon },
  { key: SPORT_KEYS.NBA, name: 'NBA', icon: BasketballIcon },
  { key: SPORT_KEYS.NHL, name: 'NHL', icon: HockeyIcon },
  { key: SPORT_KEYS.MLB, name: 'MLB', icon: BaseballIcon },
  { key: SPORT_KEYS.EPL, name: 'EPL', icon: SoccerIcon },
  { key: SPORT_KEYS.UCL, name: 'Champions League', icon: ChampionsLeagueIcon },
  { key: SPORT_KEYS.UFC, name: 'UFC', icon: UfcIcon },
  { key: SPORT_KEYS.TENNIS_ATP, name: 'Tennis (ATP)', icon: TennisIcon },
  { key: SPORT_KEYS.GOLF_PGA, name: 'PGA Golf', icon: GolfIcon },
];

const MARKETS: { key: MarketType; name: string; icon: React.ComponentType<any>; description: string }[] = [
  { key: 'moneyline', name: 'Moneyline', icon: MoneylineIcon, description: 'Win outright' },
  { key: 'spread', name: 'Spread', icon: SpreadIcon, description: 'Point spread' },
  { key: 'total', name: 'Totals', icon: TotalIcon, description: 'Over/Under' },
];

export default function SportSelector({
  selectedSport,
  selectedMarket,
  onSportChange,
  onMarketChange,
}: SportSelectorProps) {
  return (
    <div className="bg-gradient-casino-reverse rounded-xl shadow-card-dark p-6 border border-casinoGold/20">
      {/* Sports Selection */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrophyIconExport size="sm" className="stroke-casinoGold" />
          <h2 className="text-lg font-heading font-bold text-casinoGold section-title">
            Select Sport
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SPORTS.map((sport) => {
            const SportIcon = sport.icon;
            return (
              <button
                key={sport.key}
                onClick={() => onSportChange(sport.key)}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-lg border-2 font-heading font-semibold text-sm transition-all duration-200
                  ${selectedSport === sport.key
                    ? 'bg-casinoGold/20 border-casinoGold text-casinoGold shadow-glow-gold'
                    : 'bg-casinoBlack border-casinoGold/20 text-textSecondary hover:border-casinoGold/40 hover:bg-casinoBlack2'
                  }
                `}
              >
                <div className="mb-2">
                  <SportIcon
                    size="lg"
                    className={selectedSport === sport.key ? 'stroke-casinoGold' : 'stroke-textSecondary'}
                  />
                </div>
                <span className="nav-label text-xs">{sport.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Market Type Selection */}
      <div className="pt-6 border-t border-casinoGold/10">
        <div className="flex items-center gap-2 mb-4">
          <ChartLineIcon size="sm" className="stroke-casinoGreen" />
          <h2 className="text-lg font-heading font-bold text-casinoGreen section-title">
            Market Type
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MARKETS.map((market) => {
            const MarketIcon = market.icon;
            return (
              <button
                key={market.key}
                onClick={() => onMarketChange(market.key)}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border-2 font-heading transition-all duration-200
                  ${selectedMarket === market.key
                    ? 'bg-casinoGreen/20 border-casinoGreen text-casinoGreen shadow-glow-green'
                    : 'bg-casinoBlack border-casinoGreen/20 text-textSecondary hover:border-casinoGreen/40 hover:bg-casinoBlack2'
                  }
                `}
              >
                <MarketIcon
                  size="md"
                  className={selectedMarket === market.key ? 'stroke-casinoGreen' : 'stroke-textSecondary'}
                />
                <div className="flex-1 text-left">
                  <div className="font-bold nav-label text-sm">
                    {market.name}
                  </div>
                  <div className="text-xs opacity-80 mt-0.5">
                    {market.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
