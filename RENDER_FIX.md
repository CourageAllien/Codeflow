# Quick Fix: Service Not Active

## Problem
Service deployed but not responding/active.

## Solution 1: Check Service Status

1. **Go to Render Dashboard:**
   - Visit your service page
   - Check the status indicator (green = active, yellow = building, red = error)

2. **Check Logs:**
   - Click "Logs" tab
   - Look for error messages
   - Check if service is listening on port

## Solution 2: Common Issues

### Issue: Service is "Sleeping" (Free Tier)
**What you'll see:**
- First request takes 30+ seconds
- Then it works fine
- Service shows as "Live" but slow to respond

**This is normal for free tier!** The service spins down after 15 minutes of inactivity.

**Fix:**
- Wait 30 seconds for first request (it's waking up)
- Or use [UptimeRobot](https://uptimerobot.com) to ping every 5 minutes
- Or upgrade to paid plan ($7/month) for always-on

### Issue: Service Crashes
**Check logs for:**
- "Cannot find module" errors
- Port errors
- Database connection errors

**Fix:**
- I've updated the config and pushed to GitHub
- Go to Render → Manual Deploy → Deploy latest commit
- Watch the logs during deployment

### Issue: Wrong Start Command
**Verify in Render settings:**
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `npm start` (NOT `npm run dev`)

## Solution 3: Force Redeploy

1. Go to Render dashboard
2. Click "Manual Deploy"
3. Select "Deploy latest commit"
4. Watch the build logs
5. Check runtime logs after deployment

## Solution 4: Check Runtime Logs

After deployment, check logs for:
- ✅ "Ready on http://localhost:3000" = Working!
- ❌ Error messages = Need to fix

## What I Just Fixed

I removed the `output: 'standalone'` setting which can cause issues with standard Render deployment. The changes are pushed to GitHub.

**Next step:** Redeploy on Render (it should auto-deploy, or manually trigger it)

## Still Not Working?

Share:
1. What status shows in Render dashboard? (Live, Building, Error?)
2. Any error messages from the logs?
3. Does the first request eventually work after waiting?

