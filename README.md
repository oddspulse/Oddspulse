# BetRadar Hub - Gambling Comparison Dashboard

A modern, clean web application for comparing online sportsbooks and casino operators. Features affiliate link tracking, filtering by region/product, and a simple admin panel for managing operator data.

## Features

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
- **Admin Panel**: Simple CRUD interface to:
  - Edit operator details, bonuses, and affiliate URLs
  - Add new operators
  - Delete existing operators
  - Update tags and categorization
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS
- **SQLite Database**: Simple, file-based database - no external DB server needed

## Tech Stack

- **Frontend**: Next.js 14 (React) with TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
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
│   └── lib/
│       ├── db.ts                       # Database functions
│       └── types.ts                    # TypeScript types
├── scripts/
│   └── init-db.js                      # Database initialization script
├── database/
│   └── operators.db                    # SQLite database (auto-generated)
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

3. **Initialize the database with seed data**

This will create a SQLite database with 20 pre-populated operators:

```bash
npm run db:init
```

You should see: `✅ Database initialized with 20 operators!`

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

You should see the BetRadar Hub homepage with all 20 operators!

## Usage

### Homepage

- **Search**: Type operator names or bonus keywords in the search bar
- **Filter by Region**: Select US, Canada, UK, EU, or Global
- **Filter by Product**: Choose Sports Betting or Casino
- **Claim Offers**: Click "Claim Offer" buttons to test affiliate links (currently placeholder URLs)

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

1. **Install Vercel CLI** (optional)

```bash
npm install -g vercel
```

2. **Deploy**

```bash
vercel
```

Or connect your GitHub repo to Vercel via their web dashboard.

**Important**: Make sure your `database/operators.db` file is committed to git before deploying, or re-run `npm run db:init` after deploying.

### Deploy to Netlify

1. Build the project:

```bash
npm run build
```

2. Deploy the `.next` folder to Netlify

3. Set the build command to `npm run build` and publish directory to `.next`

### Deploy to Render/Railway/Other Platforms

Most platforms that support Node.js will work:

1. Set build command: `npm install && npm run build && npm run db:init`
2. Set start command: `npm start`
3. Ensure the `database` directory is writable (may require configuration)

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

1. Go to `/admin`
2. Click "+ Add New Operator"
3. Fill in the form and save

Or edit `scripts/init-db.js` to add operators to the seed data.

### Modify Logo Placeholders

Replace placeholder logo URLs in the admin panel with real logo images:
- Upload logos to a CDN or public folder
- Update the `brandLogoUrl` field for each operator

## Troubleshooting

### Database Not Found Error

If you see `Error: unable to open database file`:

```bash
npm run db:init
```

This creates the `database/operators.db` file.

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

## Development

### Adding New Features

- **Components**: Add to `src/components/`
- **API Routes**: Add to `src/app/api/`
- **Pages**: Add to `src/app/`
- **Database Functions**: Edit `src/lib/db.ts`

### Database Schema Changes

If you modify the schema in `scripts/init-db.js`:

1. Delete `database/operators.db`
2. Run `npm run db:init` again

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

**Built with Next.js + TypeScript + Tailwind CSS + SQLite**
