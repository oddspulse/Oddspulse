export type Operator = {
  id: string;
  name: string;
  brandLogoUrl: string;
  regionTags: string[];      // e.g. ["US", "Canada"]
  productTags: string[];     // e.g. ["Sports", "Casino"]
  bonusHeadline: string;     // e.g. "Bet $5, Get $150 in Bonus Bets"
  detailedOffer: string;     // longer text, optional
  affiliateUrl: string;      // my tracking link
  rtpInfo?: string;          // optional, for slots/casino focus later
  notes?: string;            // free text
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
