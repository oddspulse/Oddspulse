export type Operator = {
  id: string;
  name: string;
  affiliateUrl: string;
  logoUrl?: string;
  bonusHeadline?: string;
};

export const OPERATORS: Operator[] = [
  {
    id: "stake",
    name: "Stake.com",
    affiliateUrl: "https://stake.com",
    bonusHeadline: "Crypto Casino & Sportsbook"
  },
  {
    id: "bet365",
    name: "Bet365",
    affiliateUrl: "https://www.bet365.com",
    bonusHeadline: "World's Favorite Online Sportsbook"
  },
  {
    id: "betway",
    name: "Betway",
    affiliateUrl: "https://www.betway.com",
    bonusHeadline: "Sports Betting & Casino"
  },
  {
    id: "888sport",
    name: "888sport",
    affiliateUrl: "https://www.888sport.com",
    bonusHeadline: "Online Sports Betting"
  },
  {
    id: "888casino",
    name: "888 Casino",
    affiliateUrl: "https://www.888casino.com",
    bonusHeadline: "Online Casino Games"
  },
  {
    id: "pinnacle",
    name: "Pinnacle",
    affiliateUrl: "https://www.pinnacle.com",
    bonusHeadline: "Best Odds, Higher Limits"
  },
  {
    id: "leovegas",
    name: "LeoVegas",
    affiliateUrl: "https://www.leovegas.com",
    bonusHeadline: "King of Mobile Casino"
  },
  {
    id: "betvictor",
    name: "BetVictor",
    affiliateUrl: "https://www.betvictor.com",
    bonusHeadline: "Sports, Casino & Live Betting"
  },
  {
    id: "unibet",
    name: "Unibet",
    affiliateUrl: "https://www.unibet.com",
    bonusHeadline: "Sports Betting & Casino Games"
  },
  {
    id: "williamhill",
    name: "William Hill",
    affiliateUrl: "https://www.williamhill.com",
    bonusHeadline: "Established Sports Betting"
  },
  {
    id: "betfair",
    name: "Betfair",
    affiliateUrl: "https://www.betfair.com",
    bonusHeadline: "Betting Exchange & Sportsbook"
  },
  {
    id: "paddypower",
    name: "Paddy Power",
    affiliateUrl: "https://www.paddypower.com",
    bonusHeadline: "Sports & Entertainment Betting"
  },
  {
    id: "bwin",
    name: "bwin",
    affiliateUrl: "https://www.bwin.com",
    bonusHeadline: "Sports Betting & Casino"
  },
  {
    id: "betfred",
    name: "Betfred",
    affiliateUrl: "https://www.betfred.com",
    bonusHeadline: "Sports Betting & Casino"
  },
  {
    id: "ladbrokes",
    name: "Ladbrokes",
    affiliateUrl: "https://www.ladbrokes.com",
    bonusHeadline: "Sports Betting & Gaming"
  }
];

// Helper function to get operator by ID
export function getOperatorById(id: string): Operator | undefined {
  return OPERATORS.find(op => op.id === id);
}

// Helper function to get affiliate URL by operator name
export function getAffiliateUrl(operatorName: string): string {
  const operator = OPERATORS.find(
    op => op.name.toLowerCase() === operatorName.toLowerCase()
  );
  return operator?.affiliateUrl || '#';
}
