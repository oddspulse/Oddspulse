# BetRadar Hub - Gambling Comparison Dashboard

A comprehensive, casino-themed web application for comparing online sportsbooks and casino operators. Features live odds comparison, slot RTP database, affiliate link tracking, smart filtering, and a simple admin panel.

## Features

### 🏠 Casino Operators Comparison
- **Homepage Dashboard**: Card-based grid layout showing 20+ operators
- **Smart Filtering**: Search and filter by region, product type (Sports/Casino)
- **Operator Details**: Each card displays:
  - Brand logo and name
  - Regional availability tags
  - Product offerings (Sports, Casino, or both)
  - Welcome bonus/promo headline
  - Detailed offer description
  - RTP info (for casino operators)
  - "Claim Offer" button with your affiliate tracking link

### 📊 Live Odds Comparison
- **Real-Time Odds**: Live odds from top sportsbooks via The Odds API
- **Multiple Sports**: NFL, NBA, NHL, MLB, Soccer (EPL, Champions League), UFC, Tennis, Golf
- **Market Types**: Moneyline, Spread, Totals (Over/Under)
- **Best Odds Highlighting**: Automatically highlights the best odds for each outcome
- **Auto-Refresh**: Updates every 30 seconds to keep odds current
- **Affiliate Integration**: Direct links to place bets with tracked affiliate URLs

### 🎰 RTP Slots Database
- **Comprehensive Slot Database**: 20+ high-RTP slot games from 34+ providers
- **Provider Coverage**: NetEnt, Microgaming, Pragmatic Play, Nolimit City, Hacksaw Gaming, Big Time Gaming, and more
- **Advanced Filtering**:
  - Search by game name
  - Filter by provider, RTP %, volatility
  - Bonus buy feature filter
  - Max win multiplier filter
  - Game mechanic tags (Megaways, xWays, Cluster Pays, etc.)
- **Casino Availability**: Shows which operators offer each slot game
- **Detailed Stats**: RTP %, volatility, max win, paylines, release year, mechanics

### ⚙️ Admin Panel
- Simple CRUD interface to:
  - Edit operator details, bonuses, and affiliate URLs
  - Add new operators and slot games
  - Delete existing entries
  - Update tags and categorization

### 🎨 Casino-Inspired UI
- **Dark Theme**: Professional casino aesthetics with dark backgrounds
- **Color Palette**: Emerald green, gold, neon red, electric blue accents
- **Glow Effects**: Hover animations and shadow effects
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS
- **Unified Navigation**: Consistent header across all pages

### 💾 JSON Storage
- Simple file-based storage, perfect for Vercel serverless deployment
- No database configuration required

## Tech Stack

- **Frontend**: Next.js 14 (React) with TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: JSON file (perfect for Vercel serverless)
- **Deployment**: Vercel-ready (also works on Netlify, Render, etc.)

## Project Structure

```
betradar-hub/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── admin/
│   │   │   └── page.tsx                # Admin panel
│   │   ├── api/
│   │   │   └── operators/
│   │   │       ├── route.ts            # GET all, POST new
│   │   │       └── [id]/route.ts       # GET, PUT, DELETE by ID
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── OperatorCard.tsx            # Individual operator card
│   │   └── FilterBar.tsx               # Search and filter controls
│   ├── data/
│   │   └── operators.json              # Operator data (20 pre-loaded)
│   └── lib/
│       ├── db.ts                       # Data access functions
│       └── types.ts                    # TypeScript types
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. **Clone or download this repository**

```bash
cd betradar-hub
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Configure The Odds API (for Live Odds feature)**

To use the live odds comparison feature, you'll need a free API key from The Odds API:

1. Visit [the-odds-api.com](https://the-odds-api.com/)
2. Sign up for a free account (includes 500 API calls per month)
3. Copy your API key
4. Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.example .env.local
```

5. Add your API key to `.env.local`:

```bash
ODDS_API_KEY=your_api_key_here
ODDS_API_BASE_URL=https://api.the-odds-api.com/v4
ODDS_API_REGION=us
ODDS_API_FORMAT=american
```

**Note**: The live odds feature will show an error message if the API key is not configured. The casino comparison and RTP slots features work without it.

5. **Run the development server**

```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

You should see the BetRadar Hub homepage with all 20 operators!

**Note**: All operator and slot data is stored in JSON files (`src/data/operators.json`, `src/data/slots.json`) and is ready to use out of the box. No database initialization needed!

## Usage

### Homepage (Casino Operators)

- **Search**: Type operator names or bonus keywords in the search bar
- **Filter by Region**: Select US, Canada, UK, EU, or Global
- **Filter by Product**: Choose Sports Betting or Casino
- **Claim Offers**: Click "Claim Offer" buttons with tracked affiliate links

### Live Odds Page

Access at [http://localhost:3000/live-odds](http://localhost:3000/live-odds)

- **Select Sport**: Choose from NFL, NBA, NHL, MLB, Soccer, UFC, Tennis, or Golf
- **Select Market**: Pick Moneyline, Spread, or Totals
- **View Odds**: See real-time odds from multiple sportsbooks
- **Best Odds**: Automatically highlighted in green with "Best" badge
- **Place Bets**: Click any odds row to visit the sportsbook via affiliate link
- **Auto-Refresh**: Page automatically updates every 30 seconds

### RTP Slots Database

Access at [http://localhost:3000/rtp-slots](http://localhost:3000/rtp-slots)

- **Search**: Find slots by game name
- **Filter by Provider**: Select from 34+ slot providers
- **Filter by RTP**: Set minimum RTP percentage (95%+, 96%+, etc.)
- **Filter by Volatility**: Low, Medium, High, or Extreme
- **Bonus Buy**: Show only slots with bonus buy feature
- **Max Win**: Filter by minimum max win multiplier
- **Mechanics**: Filter by game mechanics (Megaways, Cluster Pays, etc.)
- **Quick Filters**: One-click presets for common searches
- **Play Now**: Click to play at available casinos via affiliate links

### Admin Panel

Access at [http://localhost:3000/admin](http://localhost:3000/admin)

**Edit an Operator:**
1. Click "Edit" next to any operator
2. Modify fields (bonus headline, affiliate URL, tags, etc.)
3. Click "Save"

**Add a New Operator:**
1. Click "+ Add New Operator"
2. Fill in all required fields:
   - ID: Unique identifier (lowercase, no spaces, e.g., "mybookie")
   - Name: Display name (e.g., "MyBookie")
   - Logo URL: Image URL for the operator logo
   - Affiliate URL: Your tracking link
   - Region Tags: Comma-separated (e.g., "US, Canada")
   - Product Tags: Comma-separated (e.g., "Sports, Casino")
   - Bonus Headline: Short promo text
   - Detailed Offer: Full terms and conditions
3. Click "Save"

**Delete an Operator:**
1. Click "Delete" next to any operator
2. Confirm the deletion

### Updating Affiliate Links

Replace the placeholder URLs (`https://example.com/track?op=...`) with your real affiliate tracking links:

1. Go to `/admin`
2. Click "Edit" on each operator
3. Update the "Affiliate URL" field with your tracking link
4. Click "Save"

## Data Model

Each operator has the following structure:

```typescript
type Operator = {
  id: string;                // Unique identifier (e.g., "fanduel")
  name: string;              // Display name (e.g., "FanDuel")
  brandLogoUrl: string;      // Logo image URL
  regionTags: string[];      // e.g., ["US", "Canada"]
  productTags: string[];     // e.g., ["Sports", "Casino"]
  bonusHeadline: string;     // e.g., "Bet $5, Get $150 in Bonus Bets"
  detailedOffer: string;     // Full offer description
  affiliateUrl: string;      // Your affiliate tracking link
  rtpInfo?: string;          // Optional RTP % (for casino operators)
  notes?: string;            // Internal notes
};
```

## Deployment

### Deploy to Vercel (Recommended)

**Option 1: Via GitHub (Easiest)**

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "Add New..." → "Project"
4. Import your repository
5. **Configure Environment Variables** (for Live Odds feature):
   - Go to "Environment Variables" section
   - Add `ODDS_API_KEY` with your API key from the-odds-api.com
   - Add `ODDS_API_BASE_URL` = `https://api.the-odds-api.com/v4`
   - Add `ODDS_API_REGION` = `us`
   - Add `ODDS_API_FORMAT` = `american`
6. Click "Deploy" (Vercel auto-detects Next.js settings)

**Option 2: Via CLI**

```bash
npm install -g vercel
vercel
```

Then configure environment variables in the Vercel dashboard under Settings → Environment Variables.

**Note**: The app uses JSON file storage which works perfectly with Vercel's serverless environment. However, admin changes won't persist in production (file writes are ephemeral). For production use with persistent admin changes, consider using Vercel KV or a database.

Your app will be live at: `https://your-project.vercel.app`

**Live Odds API Rate Limits**: The free tier of The Odds API includes 500 requests per month. Each page load on the live-odds page uses 1 request. With auto-refresh every 30 seconds, plan accordingly for production use.

### Deploy to Netlify

1. Push your code to GitHub
2. Sign in to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy"

### Deploy to Render/Railway/Other Platforms

Most platforms that support Node.js will work:

1. Set build command: `npm install && npm run build`
2. Set start command: `npm start`

## Customization

### Change Site Name

Edit `src/app/page.tsx` and `src/app/layout.tsx`:

```typescript
// In page.tsx
<h1 className="text-3xl md:text-4xl font-bold">Your Site Name</h1>

// In layout.tsx
export const metadata: Metadata = {
  title: 'Your Site Name',
  description: 'Your description',
}
```

### Modify Colors/Theme

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    },
  },
},
```

### Add More Operators

**Option 1: Via Admin Panel**
1. Go to `/admin`
2. Click "+ Add New Operator"
3. Fill in the form and save

**Option 2: Edit JSON Directly**
Edit `src/data/operators.json` and add a new operator object to the array.

### Modify Logo Placeholders

Replace placeholder logo URLs in the admin panel with real logo images:
- Upload logos to a CDN (like Cloudinary, Imgur, etc.)
- Or use direct URLs from operator websites
- Update the `brandLogoUrl` field for each operator

## Troubleshooting

### No Data Showing

If you see no operators on the homepage:
- Check that `src/data/operators.json` exists
- Verify the JSON is valid (no syntax errors)
- Check browser console for errors

### Port Already in Use

If port 3000 is taken:

```bash
npm run dev -- -p 3001
```

### Build Errors

Make sure all dependencies are installed:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Admin Changes Not Persisting on Vercel

Note: In Vercel's serverless environment, file system writes are ephemeral. For production use with Vercel, consider:
- Using Vercel KV for storage
- Using a cloud database (MongoDB, PostgreSQL, etc.)
- Using a CMS (Sanity, Contentful, etc.)

For now, the JSON file works great for local development and initial testing!

## Development

### Adding New Features

- **Components**: Add to `src/components/`
- **API Routes**: Add to `src/app/api/`
- **Pages**: Add to `src/app/`
- **Data Functions**: Edit `src/lib/db.ts`
- **Data**: Edit `src/data/operators.json`

### Working with Data

The app reads and writes from `src/data/operators.json`:
- **Read**: Data is loaded on each request
- **Write**: Changes are saved immediately via the admin panel
- **Format**: Standard JSON array of operator objects

## License

This project is open source and available for personal or commercial use.

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the code comments in each file
- Ensure Node.js 18+ is installed

## Disclaimer

Gambling can be addictive. This tool is for informational and affiliate marketing purposes only. Users should comply with local gambling laws and regulations. 18+ only.

---

**Built with Next.js + TypeScript + Tailwind CSS + JSON Storage**

Perfect for Vercel serverless deployment! 🚀
