# ColdFlow Deployment Guide

This guide will help you deploy ColdFlow to production.

## Quick Start: Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications. It's free for personal projects and provides automatic deployments.

### Step 1: Prepare Your Code

1. **Test locally first:**
   ```bash
   npm run build
   npm start
   ```
   Visit `http://localhost:3000` to make sure everything works.

2. **Initialize Git (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (Press Enter for default: `coldflow`)
   - Directory? (Press Enter for `./`)
   - Override settings? **No**

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

**Option B: Using GitHub + Vercel Dashboard**

1. **Push to GitHub:**
   ```bash
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/coldflow.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

### Step 3: Configure Environment Variables (Optional)

If you want to use Clerk authentication or Claude API, add these in Vercel dashboard:

1. Go to your project settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (if using Clerk)
   - `CLERK_SECRET_KEY` (if using Clerk)
   - `ANTHROPIC_API_KEY` (if using Claude API)

**Note:** The app works in sandbox mode without these keys, so they're optional for testing.

### Step 4: Access Your Deployed App

After deployment, Vercel will give you a URL like:
- `https://coldflow.vercel.app` (production)
- `https://coldflow-xyz.vercel.app` (preview)

## Alternative Deployment Options

### Option 2: Deploy to Netlify

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod --dir=.next
   ```

### Option 3: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway will auto-detect Next.js
5. Add environment variables if needed

### Option 4: Self-Hosted (VPS/Docker)

1. **Build Docker image:**
   ```bash
   # Create Dockerfile (see below)
   docker build -t coldflow .
   docker run -p 3000:3000 coldflow
   ```

2. **Or use PM2:**
   ```bash
   npm run build
   pm2 start npm --name "coldflow" -- start
   ```

## Pre-Deployment Checklist

- [ ] Test `npm run build` locally
- [ ] Test `npm start` locally
- [ ] Verify all routes work
- [ ] Check that sandbox mode works without API keys
- [ ] Review `.gitignore` to ensure secrets aren't committed
- [ ] Update any hardcoded URLs (localhost → production URL)

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | No | Clerk authentication (public key) |
| `CLERK_SECRET_KEY` | No | Clerk authentication (secret key) |
| `ANTHROPIC_API_KEY` | No | Claude API for email generation |
| `DATABASE_URL` | No | Database connection (if using Prisma) |

**Note:** All are optional - the app works in sandbox mode without them.

## Troubleshooting

### Build Errors

If you get build errors:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Make sure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new environment variables
- Check Vercel dashboard → Settings → Environment Variables

### Database Issues

If using Prisma:
```bash
# Generate Prisma client
npm run db:generate

# Push schema (for SQLite, not needed for production)
npm run db:push
```

## Post-Deployment

1. **Test the live URL:**
   - Visit your deployed app
   - Test sandbox mode
   - Try a few commands

2. **Set up custom domain (optional):**
   - In Vercel dashboard → Settings → Domains
   - Add your custom domain

3. **Monitor:**
   - Check Vercel dashboard for deployment status
   - Review logs if issues occur

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Test locally first to isolate issues
3. Review Next.js deployment docs: https://nextjs.org/docs/deployment

