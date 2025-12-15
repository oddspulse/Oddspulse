# Deployment Guide - Vercel

## Quick Setup for Vercel Deployment

### 1. Environment Variables (CRITICAL)

You **MUST** set these environment variables in your Vercel project dashboard:

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project (or create a new one)
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `ODDS_API_KEY` | `1b1d21e839c2a8df50ab7c74ea31a297` | Production, Preview, Development |
| `ODDS_API_BASE_URL` | `https://api.the-odds-api.com/v4` | Production, Preview, Development |
| `ODDS_API_REGION` | `us` | Production, Preview, Development |
| `ODDS_API_FORMAT` | `american` | Production, Preview, Development |

⚠️ **IMPORTANT**: Make sure to check all three environments (Production, Preview, Development) for each variable.

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Option B: Deploy via GitHub (Recommended)
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Add environment variables (see step 1 above)
6. Click "Deploy"

### 3. Get Your Domain

After deployment, Vercel will give you:
- **Automatic domain**: `your-project-name.vercel.app`
- **Custom domain**: You can add your own domain in **Settings** → **Domains**

### 4. Verify Deployment

After deployment, check:
- ✅ Home page loads with operators
- ✅ Live Odds page works
- ✅ Arbitrage page works
- ✅ RTP Slots page works

### Troubleshooting

**Issue**: API calls fail with 500 error
- **Solution**: Check that all environment variables are set correctly in Vercel dashboard

**Issue**: "ODDS_API_KEY is not configured" error
- **Solution**: Make sure `ODDS_API_KEY` is set in Vercel environment variables for all environments

**Issue**: Domain not working
- **Solution**: Vercel automatically provides a `.vercel.app` domain. Check your deployment URL in the Vercel dashboard.

## Redeploying

To redeploy after making changes:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically redeploy on every push to your main branch (if connected via GitHub).
