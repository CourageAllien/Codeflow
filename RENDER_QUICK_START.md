# 🚀 Quick Start: Deploy to Render

Your code is now on GitHub: https://github.com/CourageAllien/Codeflow

## Deploy Steps (5 minutes)

### 1. Go to Render Dashboard
Visit: https://dashboard.render.com
- Sign up (free) or log in
- **Recommended:** Click "Sign in with GitHub" for easy connection

### 2. Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**

### 3. Connect Your Repository
1. If prompted, connect your GitHub account
2. Search for: `Codeflow` or `CourageAllien/Codeflow`
3. Click **"Connect"** on your repository

### 4. Configure Service Settings

**Basic Settings:**
- **Name:** `coldflow` (or `codeflow` - your choice)
- **Region:** Choose closest (Oregon, Frankfurt, etc.)
- **Branch:** `main` (auto-selected)
- **Root Directory:** Leave empty

**Build & Deploy:**
- **Environment:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Plan:**
- **Free** - Good for testing (spins down after 15 min)
- **Starter ($7/month)** - Always on, better performance

### 5. Environment Variables (Optional)
Click "Advanced" → Add these if needed later:
- `NODE_ENV` = `production`
- `NEXT_TELEMETRY_DISABLED` = `1`

**Note:** App works without these in sandbox mode!

### 6. Deploy!
1. Click **"Create Web Service"**
2. Watch the build logs (takes 5-10 minutes first time)
3. When you see "Your service is live" - you're done! 🎉

## Your App Will Be Live At:
`https://coldflow.onrender.com` (or your chosen name)

## Test Your Deployment:
1. Visit your Render URL
2. Go to `/sandbox` to test commands
3. Try: "Give me ACTL & Booked Meeting Tracker for December 5 2024"
4. Test other commands from the guide

## Keep Free Tier Active (Optional):
Use [UptimeRobot](https://uptimerobot.com) to ping your app every 5 minutes:
- Free service
- Keeps your app awake
- Prevents cold starts

## Need Help?
- Check build logs in Render dashboard
- Check runtime logs if app crashes
- Verify all files are in GitHub repo

---

**Your Repository:** https://github.com/CourageAllien/Codeflow
**Ready to Deploy!** 🚀

