# Render Deployment Setup Guide

## Step 1: Check Your Current Deployment Method

### In Render Dashboard:

1. **Go to your service** (the "coldflow" web service)
2. **Check the "Settings" tab**
3. Look for:
   - **"Docker" section** → If you see Docker settings, Docker is enabled
   - **"Build & Deploy" section** → Shows build/start commands

### Determine Your Setup:

**If you see Docker settings:**
- You're using Docker deployment
- Make sure Docker is enabled
- The Dockerfile should work now

**If you DON'T see Docker settings:**
- You're using standard Next.js deployment
- This is simpler and recommended
- Uses `render.yaml` configuration

## Step 2: Configure Based on Your Method

### Option A: Standard Next.js Deployment (Recommended)

**Settings to verify:**

1. **Build Command:**
   ```
   npm install && npx prisma generate && npm run build
   ```

2. **Start Command:**
   ```
   npm start
   ```

3. **Environment Variables:**
   - `NODE_ENV` = `production`
   - `NEXT_TELEMETRY_DISABLED` = `1`
   - `DATABASE_URL` = `file:./dev.db` (or your database URL)

4. **Node Version:**
   - Should be Node 20 (or 18+)

5. **Docker:**
   - Should be **DISABLED** or not present

### Option B: Docker Deployment

**Settings to verify:**

1. **Docker:**
   - Should be **ENABLED**
   - Dockerfile path: `Dockerfile` (or leave default)

2. **Environment Variables:**
   - Same as Option A

3. **Port:**
   - Should be `3000` (or auto-detected)

## Step 3: Recommended Configuration

### For Standard Deployment (Recommended):

1. **Disable Docker** (if enabled):
   - Settings → Docker → Disable

2. **Verify Build/Start Commands:**
   - Build: `npm install && npx prisma generate && npm run build`
   - Start: `npm start`

3. **Set Environment Variables:**
   ```
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   DATABASE_URL=file:./dev.db
   ```

4. **Auto-Deploy:**
   - Enable "Auto-Deploy" from main branch
   - This will deploy when you push to GitHub

## Step 4: Deploy

### Manual Deploy:
1. Go to your service
2. Click "Manual Deploy"
3. Select "Deploy latest commit"
4. Watch the build logs

### Auto-Deploy:
- If enabled, it will deploy automatically after you push to GitHub
- Check the "Events" tab to see deployment status

## Step 5: Verify Deployment

### After Deployment:

1. **Check Status:**
   - Should show "Live" (green)
   - If "Building" (yellow), wait for it to finish
   - If "Error" (red), check logs

2. **Check Logs:**
   - Go to "Logs" tab
   - Look for: "Ready on http://localhost:3000"
   - No red error messages

3. **Test the Site:**
   - Visit your Render URL
   - Try `/test` page first (simple test)
   - Then try main page `/`

## Troubleshooting

### If Build Fails:

**Check build logs for:**
- Missing dependencies → Add to `package.json`
- Prisma errors → Check `DATABASE_URL`
- TypeScript errors → Should be ignored (configured)

### If Service Won't Start:

**Check runtime logs for:**
- Port errors → Should use PORT env var (auto-set by Render)
- Module not found → Rebuild service
- Database errors → Check `DATABASE_URL`

### If Page is Blank:

1. **Check browser console** (F12)
2. **Check Render logs** for errors
3. **Try `/test` page** to verify basic rendering
4. **Check if CSS is loading** (Network tab)

## Quick Checklist

- [ ] Service created in Render
- [ ] Connected to GitHub repo
- [ ] Build command set correctly
- [ ] Start command set correctly
- [ ] Environment variables configured
- [ ] Docker disabled (for standard deployment)
- [ ] Auto-deploy enabled (optional)
- [ ] Service shows "Live" status
- [ ] Logs show "Ready" message
- [ ] Site loads in browser

## Need Help?

If something doesn't work:
1. Share the error from Render logs
2. Share the error from browser console (F12)
3. Share what you see when visiting the site

