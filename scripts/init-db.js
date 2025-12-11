const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(path.join(dbDir, 'operators.db'));

// Create operators table
db.exec(`
  CREATE TABLE IF NOT EXISTS operators (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brandLogoUrl TEXT NOT NULL,
    regionTags TEXT NOT NULL,
    productTags TEXT NOT NULL,
    bonusHeadline TEXT NOT NULL,
    detailedOffer TEXT,
    affiliateUrl TEXT NOT NULL,
    rtpInfo TEXT,
    notes TEXT
  )
`);

// Seed data - 20 operators
const operators = [
  {
    id: 'fanduel',
    name: 'FanDuel',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=FanDuel',
    regionTags: JSON.stringify(['US']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: 'Bet $5, Get $150 in Bonus Bets',
    detailedOffer: 'New users only. Place your first bet of $5+ and receive $150 in bonus bets, win or lose. Terms apply.',
    affiliateUrl: 'https://example.com/track?op=fanduel',
    rtpInfo: null,
    notes: 'Leading US sportsbook with excellent mobile app'
  },
  {
    id: 'draftkings',
    name: 'DraftKings',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=DraftKings',
    regionTags: JSON.stringify(['US']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: 'Bet $5, Get $200 in Bonus Bets Instantly',
    detailedOffer: 'Sign up and bet $5 to receive $200 in bonus bets. No odds restrictions. New customers only.',
    affiliateUrl: 'https://example.com/track?op=draftkings',
    rtpInfo: null,
    notes: 'Top-tier platform with daily fantasy sports integration'
  },
  {
    id: 'betmgm',
    name: 'BetMGM',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=BetMGM',
    regionTags: JSON.stringify(['US']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: '$1,500 First Bet Offer',
    detailedOffer: 'Get up to $1,500 paid back in bonus bets if your first bet doesn\'t win. New users only.',
    affiliateUrl: 'https://example.com/track?op=betmgm',
    rtpInfo: null,
    notes: 'MGM Resorts backed platform with extensive casino options'
  },
  {
    id: 'caesars',
    name: 'Caesars Sportsbook & Casino',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=Caesars',
    regionTags: JSON.stringify(['US']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: 'Get Up to $1,000 Back on Your First Bet',
    detailedOffer: 'Place your first bet and if it doesn\'t win, get a bonus bet back up to $1,000. Terms and conditions apply.',
    affiliateUrl: 'https://example.com/track?op=caesars',
    rtpInfo: null,
    notes: 'Caesars Rewards integration for additional perks'
  },
  {
    id: 'bet365',
    name: 'bet365',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=bet365',
    regionTags: JSON.stringify(['US', 'UK', 'Global']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: 'Bet $1, Get $200 in Bonus Bets',
    detailedOffer: 'Available to new customers. Min deposit $10. Bonus bets credited upon qualifying bet settlement.',
    affiliateUrl: 'https://example.com/track?op=bet365',
    rtpInfo: null,
    notes: 'Global leader with comprehensive betting markets'
  },
  {
    id: 'fanatics',
    name: 'Fanatics Sportsbook',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=Fanatics',
    regionTags: JSON.stringify(['US']),
    productTags: JSON.stringify(['Sports']),
    bonusHeadline: 'Get Up to $1,000 in Bonus Bets',
    detailedOffer: 'New users receive matching bonus bets on first wagers over 5 days, up to $1,000 total. 1x playthrough.',
    affiliateUrl: 'https://example.com/track?op=fanatics',
    rtpInfo: null,
    notes: 'New player in market with FanCash rewards program'
  },
  {
    id: 'pointsbet',
    name: 'PointsBet',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=PointsBet',
    regionTags: JSON.stringify(['US', 'Canada']),
    productTags: JSON.stringify(['Sports']),
    bonusHeadline: '5 x $100 Second Chance Bets',
    detailedOffer: 'Get up to 5 second chance bets worth $100 each on your first 5 days of wagering. New customers only.',
    affiliateUrl: 'https://example.com/track?op=pointsbet',
    rtpInfo: null,
    notes: 'Unique PointsBetting feature for variable payouts'
  },
  {
    id: 'unibet',
    name: 'Unibet',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=Unibet',
    regionTags: JSON.stringify(['US', 'UK', 'EU']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: '$500 Risk-Free Bet',
    detailedOffer: 'Place your first bet up to $500 and get it back in bonus bets if it doesn\'t win. T&Cs apply.',
    affiliateUrl: 'https://example.com/track?op=unibet',
    rtpInfo: null,
    notes: 'Kindred Group brand with strong European presence'
  },
  {
    id: 'betway',
    name: 'Betway',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=Betway',
    regionTags: JSON.stringify(['US', 'UK', 'Global']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: '$250 Deposit Match',
    detailedOffer: 'New customers get a 100% deposit match up to $250. Minimum $10 deposit required.',
    affiliateUrl: 'https://example.com/track?op=betway',
    rtpInfo: null,
    notes: 'Established brand with esports betting focus'
  },
  {
    id: '888sport',
    name: '888sport / 888casino',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=888',
    regionTags: JSON.stringify(['US', 'UK', 'Global']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: '$500 Casino Bonus + $10 Free Bet',
    detailedOffer: '100% match up to $500 on first casino deposit plus $10 free sports bet. Wagering requirements apply.',
    affiliateUrl: 'https://example.com/track?op=888sport',
    rtpInfo: null,
    notes: 'Long-standing operator with strong casino offering'
  },
  {
    id: 'betfair',
    name: 'Betfair',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=Betfair',
    regionTags: JSON.stringify(['US', 'UK', 'Global']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: '$1,000 Risk-Free First Bet',
    detailedOffer: 'Get your first bet back as a bonus bet up to $1,000 if it doesn\'t win. New customers only.',
    affiliateUrl: 'https://example.com/track?op=betfair',
    rtpInfo: null,
    notes: 'Pioneer of betting exchange model'
  },
  {
    id: 'paddypower',
    name: 'Paddy Power',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=PaddyPower',
    regionTags: JSON.stringify(['UK', 'EU']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: '£20 in Free Bets',
    detailedOffer: 'Bet £10, get £20 in free bets. New customers only. Min odds 1/2. Valid for 7 days.',
    affiliateUrl: 'https://example.com/track?op=paddypower',
    rtpInfo: null,
    notes: 'Irish bookmaker known for creative marketing'
  },
  {
    id: 'williamhill',
    name: 'William Hill',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=WilliamHill',
    regionTags: JSON.stringify(['US', 'UK', 'Global']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: 'Bet $10, Get $100 in Bonus Bets',
    detailedOffer: 'Sign up, bet $10 and receive $100 in bonus bets. New users in eligible states only.',
    affiliateUrl: 'https://example.com/track?op=williamhill',
    rtpInfo: null,
    notes: 'Historic British bookmaker, now Caesars owned in US'
  },
  {
    id: 'stake',
    name: 'Stake',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=Stake',
    regionTags: JSON.stringify(['Global']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: '200% Deposit Bonus up to $2,000',
    detailedOffer: 'Crypto-friendly welcome bonus. Receive 200% on your first deposit up to $2,000. Wagering requirements apply.',
    affiliateUrl: 'https://example.com/track?op=stake',
    rtpInfo: null,
    notes: 'Crypto-focused platform with instant withdrawals'
  },
  {
    id: 'betrivers',
    name: 'BetRivers',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=BetRivers',
    regionTags: JSON.stringify(['US', 'Canada']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: '$500 Second Chance Bet',
    detailedOffer: 'Get up to $500 back in bonus bets if your first bet doesn\'t win. New accounts only.',
    affiliateUrl: 'https://example.com/track?op=betrivers',
    rtpInfo: null,
    notes: 'Rush Street Interactive brand with iRush Rewards'
  },
  {
    id: 'leovegas',
    name: 'LeoVegas',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=LeoVegas',
    regionTags: JSON.stringify(['UK', 'EU', 'Canada']),
    productTags: JSON.stringify(['Casino']),
    bonusHeadline: '100% up to $1,000 + 200 Free Spins',
    detailedOffer: 'Casino welcome package with matched deposit bonus and free spins. Wagering requirements: 35x bonus.',
    affiliateUrl: 'https://example.com/track?op=leovegas',
    rtpInfo: 'Average RTP: 96.5%',
    notes: 'Mobile-first casino with award-winning app'
  },
  {
    id: 'betvictor',
    name: 'BetVictor',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=BetVictor',
    regionTags: JSON.stringify(['UK', 'EU']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: '£25 Welcome Bonus',
    detailedOffer: 'Bet £10 get £25 in free bets. New customers. Min deposit £10. Qualifying bet must be placed at odds of 2/5 or greater.',
    affiliateUrl: 'https://example.com/track?op=betvictor',
    rtpInfo: null,
    notes: 'Family-owned Gibraltar-based operator'
  },
  {
    id: 'ladbrokes',
    name: 'Ladbrokes',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=Ladbrokes',
    regionTags: JSON.stringify(['UK', 'EU']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: '£20 in Free Bets',
    detailedOffer: 'Bet £5, get £20 in free bets. New customers only. Min odds 1/2. Free bets valid for 4 days.',
    affiliateUrl: 'https://example.com/track?op=ladbrokes',
    rtpInfo: null,
    notes: 'Historic UK bookmaker, part of Entain Group'
  },
  {
    id: 'wynnbet',
    name: 'WynnBET',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=WynnBET',
    regionTags: JSON.stringify(['US']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: '$100 in Free Bets',
    detailedOffer: 'New users get $100 in bonus bets after first wager. Wynn Rewards points on every bet.',
    affiliateUrl: 'https://example.com/track?op=wynnbet',
    rtpInfo: null,
    notes: 'Wynn Resorts platform with luxury casino integration'
  },
  {
    id: 'betfred',
    name: 'Betfred',
    brandLogoUrl: 'https://via.placeholder.com/150x60?text=Betfred',
    regionTags: JSON.stringify(['US', 'UK']),
    productTags: JSON.stringify(['Sports', 'Casino']),
    bonusHeadline: '$200 in Free Bets',
    detailedOffer: 'Bet $50, get $200 in free bets. New customers in select states. Terms and conditions apply.',
    affiliateUrl: 'https://example.com/track?op=betfred',
    rtpInfo: null,
    notes: 'UK-based operator expanding in US market'
  }
];

// Insert operators
const insert = db.prepare(`
  INSERT OR REPLACE INTO operators (
    id, name, brandLogoUrl, regionTags, productTags, bonusHeadline,
    detailedOffer, affiliateUrl, rtpInfo, notes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((operators) => {
  for (const op of operators) {
    insert.run(
      op.id,
      op.name,
      op.brandLogoUrl,
      op.regionTags,
      op.productTags,
      op.bonusHeadline,
      op.detailedOffer,
      op.affiliateUrl,
      op.rtpInfo,
      op.notes
    );
  }
});

insertMany(operators);

console.log('✅ Database initialized with 20 operators!');
db.close();
