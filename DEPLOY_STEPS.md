# Step-by-Step Render Deployment Guide

Follow these steps in order to deploy ColdFlow to Render.

## ✅ Step 1: Git Repository Initialized
**Status:** ✅ DONE - Git repository has been initialized and files committed.

## 📤 Step 2: Create GitHub Repository

1. **Go to GitHub:**
   - Visit [github.com](https://github.com)
   - Sign in or create an account

2. **Create New Repository:**
   - Click the "+" icon (top right) → "New repository"
   - Repository name: `coldflow` (or any name you prefer)
   - Description: "ColdFlow - AI-powered cold email command center"
   - Choose: **Public** (or Private if you prefer)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

3. **Copy the repository URL:**
   - GitHub will show you commands - copy the HTTPS URL
   - It will look like: `https://github.com/YOUR_USERNAME/coldflow.git`

## 🔗 Step 3: Connect and Push to GitHub

Run these commands in your terminal (replace YOUR_USERNAME with your GitHub username):

```bash
cd "/Users/benefitnwaogwugwu/Desktop/Cursor Test Project 5"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/coldflow.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**Or I can help you do this - just provide your GitHub username!**

## 🚀 Step 4: Deploy on Render

1. **Go to Render Dashboard:**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Sign up (free) or log in
   - Use GitHub to sign in (recommended for easy repo connection)

2. **Create New Web Service:**
   - Click the **"New +"** button (top right)
   - Select **"Web Service"**

3. **Connect Repository:**
   - If not connected, click "Connect account" to link GitHub
   - Search for and select your `coldflow` repository
   - Click "Connect"

4. **Configure Service:**
   - **Name:** `coldflow` (or your preferred name)
   - **Region:** Choose closest to you (e.g., Oregon, Frankfurt)
   - **Branch:** `main` (should be auto-selected)
   - **Root Directory:** Leave empty
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** 
     - **Free** - Good for testing (spins down after 15 min inactivity)
     - **Starter ($7/month)** - Always on, better performance

5. **Environment Variables (Optional - for later):**
   Click "Advanced" → "Add Environment Variable" to add:
   - `NODE_ENV` = `production`
   - `NEXT_TELEMETRY_DISABLED` = `1`
   - (Add `ANTHROPIC_API_KEY` later if you want AI features)
   - (Add Clerk keys later if you want authentication)

6. **Deploy:**
   - Click **"Create Web Service"**
   - Render will start building (takes 5-10 minutes first time)
   - Watch the build logs - you'll see progress
   - When it says "Your service is live", you're done!

## 🎉 Step 5: Access Your App

After deployment completes, you'll get a URL like:
- `https://coldflow.onrender.com` (or your custom name)

**Test it:**
- Visit the URL
- Try `/sandbox` for sandbox mode
- Test some commands!

## 📝 Step 6: Keep Free Tier Active (Optional)

If using free tier, it spins down after 15 minutes. To keep it awake:

1. **Use UptimeRobot (Free):**
   - Go to [uptimerobot.com](https://uptimerobot.com)
   - Sign up (free)
   - Add new monitor:
     - Type: HTTP(s)
     - URL: Your Render URL
     - Interval: 5 minutes
   - This will ping your app every 5 minutes to keep it awake

## 🔧 Troubleshooting

### Build Fails:
- Check build logs in Render dashboard
- Common issues: Missing dependencies, TypeScript errors
- Our build should work - we tested it!

### App Won't Start:
- Check runtime logs
- Verify `npm start` works locally
- Ensure PORT is configured (Render sets this automatically)

### Slow First Load:
- Normal on free tier (cold start takes ~30 seconds)
- Subsequent loads are faster
- Upgrade to paid for instant response

## 📞 Need Help?

If you get stuck:
1. Check Render build logs (in dashboard)
2. Check Render runtime logs
3. Verify your GitHub repo is public (or Render has access)
4. Make sure all files are pushed to GitHub

## Next Steps After Deployment

1. ✅ Test the live app
2. ✅ Share the URL with testers
3. ✅ Set up uptime monitoring (optional)
4. ✅ Add custom domain (optional)
5. ✅ Add environment variables for AI features (optional)

