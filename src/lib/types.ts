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
