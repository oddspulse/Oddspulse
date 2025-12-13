export type Operator = {
  id: string;
  name: string;
  brandLogoUrl: string;
  logo?: string;             // auto-mapped logo from /public/logos/
  regionTags: string[];      // e.g. ["US", "Canada"]
  productTags: string[];     // e.g. ["Sports", "Casino"]
  bonusHeadline: string;     // e.g. "Bet $5, Get $150 in Bonus Bets"
  detailedOffer: string;     // longer text, optional
  affiliateUrl: string;      // my tracking link
  rtpInfo?: string;          // optional, for slots/casino focus later
  notes?: string;            // free text
  promoSource?: "affiliate_feed" | "official_api" | "manual"; // where promo data comes from
  promoLastUpdated?: string; // ISO timestamp of last promo update
  termsUrl?: string;         // optional link to T&Cs
};

export type OperatorFilters = {
  search?: string;
  region?: string;
  product?: string;
  bonusType?: string;
};

export type SlotGame = {
  id: string;
  gameName: string;
  provider: string;
  rtp: number;
  volatility?: "Low" | "Medium" | "High" | "Extreme";
  hasBonusBuy?: boolean;
  maxWinMultiplier?: number;
  mechanicTags?: string[]; // e.g., ["Megaways", "xNudge", "Bonus Buy"]
  supportedCasinos: string[]; // IDs of operators that offer this slot
  releaseYear?: number;
  paylines?: number | string; // Can be "up to 117,649" for Megaways
  minBet?: number;
  maxBet?: number;
  theme?: string;
  features?: string[];
  popularityRank?: number; // 1-5 for top popular slots per provider
};

export type SlotFilters = {
  search?: string;
  provider?: string;
  minRtp?: number;
  volatility?: string;
  hasBonusBuy?: boolean;
  minMaxWin?: number;
  mechanic?: string;
  casino?: string;
};

export type ProviderInfo = {
  id: string;
  name: string;
  color: string; // Badge color
  logoUrl?: string;
};

// Live Odds Types

export type BookmakerMapping = {
  operatorId: string; // internal operator ID (e.g., "fanduel")
  apiBookmakerKey: string; // bookmaker key from odds API (e.g., "fanduel")
  displayName: string;
};

export type MarketType = "moneyline" | "spread" | "total";

export type MarketOutcome = {
  label: string; // "Home", "Away", "Over 225.5", etc.
  operatorId: string;
  operatorName: string;
  odds: number; // American odds (e.g., -110, +150)
  price?: number; // Decimal odds (e.g., 1.91, 2.50)
  point?: number; // Spread point or total (e.g., -3.5, 225.5)
  affiliateUrl: string;
};

export type LiveMarket = {
  type: MarketType;
  outcomes: MarketOutcome[];
};

export type LiveEvent = {
  id: string;
  sport: string;
  sportKey: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;  // ISO
  isLive: boolean;
  markets: LiveMarket[];
};

export type Sport = {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  hasOutrights: boolean;
};

export type OddsFilters = {
  sport: string;
  market: MarketType;
  region?: string;
  oddsFormat?: 'american' | 'decimal';
};

// Arbitrage types
export type ArbitrageOpportunity = {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  marketType: MarketType;
  profit: number; // percentage profit (e.g., 2.5 for 2.5%)
  totalStake: number; // recommended total stake amount
  bets: ArbitrageBet[];
};

export type ArbitrageBet = {
  outcome: string; // e.g., "Home Win", "Away +3.5", "Over 45.5"
  operatorId: string;
  operatorName: string;
  odds: number; // American odds
  decimalOdds: number;
  stake: number; // recommended stake amount
  potentialReturn: number;
  affiliateUrl: string;
};
