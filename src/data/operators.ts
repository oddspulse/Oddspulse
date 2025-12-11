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
    name: "Stake",
    affiliateUrl: "https://stake.com/?c=betradarhub",
    bonusHeadline: "200% Bonus up to $2000"
  },
  {
    id: "bet365",
    name: "bet365",
    affiliateUrl: "https://www.bet365.com",
    bonusHeadline: "Bet $10 Get $200 in Bonus Bets"
  },
  {
    id: "betway",
    name: "Betway",
    affiliateUrl: "https://betway.com",
    bonusHeadline: "100% Match up to $1000"
  },
  {
    id: "888",
    name: "888casino",
    affiliateUrl: "https://www.888casino.com",
    bonusHeadline: "$888 Welcome Bonus"
  },
  {
    id: "pinnacle",
    name: "Pinnacle",
    affiliateUrl: "https://www.pinnacle.com",
    bonusHeadline: "Best Odds Guaranteed"
  },
  {
    id: "leovegas",
    name: "LeoVegas",
    affiliateUrl: "https://www.leovegas.com",
    bonusHeadline: "Up to $1000 + 200 Free Spins"
  },
  {
    id: "rivalry",
    name: "Rivalry",
    affiliateUrl: "https://www.rivalry.com",
    bonusHeadline: "100% Match Bonus"
  },
  {
    id: "sportingbet",
    name: "Sportingbet",
    affiliateUrl: "https://www.sportingbet.com",
    bonusHeadline: "Welcome Offer Available"
  },
  {
    id: "bodog",
    name: "Bodog",
    affiliateUrl: "https://www.bodog.com",
    bonusHeadline: "100% Sports Bonus"
  },
  {
    id: "bodogcasino",
    name: "Bodog Casino",
    affiliateUrl: "https://www.bodog.com/casino",
    bonusHeadline: "600% Casino Bonus"
  },
  {
    id: "partycasino",
    name: "PartyCasino",
    affiliateUrl: "https://www.partycasino.com",
    bonusHeadline: "Up to $1000 Bonus"
  },
  {
    id: "spin",
    name: "Spin Casino",
    affiliateUrl: "https://www.spincasino.com",
    bonusHeadline: "$1000 Welcome Package"
  },
  {
    id: "jackpotcity",
    name: "JackpotCity",
    affiliateUrl: "https://www.jackpotcitycasino.com",
    bonusHeadline: "Up to $1600 Bonus"
  },
  {
    id: "playojo",
    name: "PlayOJO",
    affiliateUrl: "https://www.playojo.com",
    bonusHeadline: "50 Free Spins - No Wagering"
  },
  {
    id: "royalpanda",
    name: "Royal Panda",
    affiliateUrl: "https://www.royalpanda.com",
    bonusHeadline: "100% up to $1000"
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
