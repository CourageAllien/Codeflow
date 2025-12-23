# Render Deployment Troubleshooting

## Service Deployed But Not Active

If your service shows as "deployed" but isn't accessible, try these solutions:

### 1. Check Service Status

In Render Dashboard:
- Go to your service
- Check the "Events" or "Logs" tab
- Look for any error messages

### 2. Common Issues & Fixes

#### Issue: Service is "Sleeping" (Free Tier)
**Symptom:** First request takes 30+ seconds, then works
**Solution:** 
- This is normal for free tier
- Service spins down after 15 min inactivity
- Use UptimeRobot to keep it awake (free)
- Or upgrade to paid plan

#### Issue: Service Crashes on Start
**Check:**
- Runtime logs in Render dashboard
- Look for error messages
- Common causes:
  - Missing environment variables
  - Port configuration issues
  - Database connection errors

#### Issue: Build Succeeded But Service Won't Start
**Check:**
- Verify `npm start` command is correct
- Check if PORT environment variable is set (Render sets this automatically)
- Look for "Application failed to respond" errors

### 3. Verify Configuration

**Build Command:**
```
npm install && npx prisma generate && npm run build
```

**Start Command:**
```
npm start
```

**Environment Variables (Optional):**
- `NODE_ENV` = `production`
- `NEXT_TELEMETRY_DISABLED` = `1`
- `PORT` = (Auto-set by Render, don't override)

### 4. Check Runtime Logs

1. Go to your Render service
2. Click "Logs" tab
3. Look for:
   - "Server listening on port..."
   - Error messages
   - Crash reports

### 5. Common Error Messages

**"Cannot find module"**
- Solution: Rebuild the service
- Check that all dependencies are in package.json

**"Port already in use"**
- Solution: Don't set PORT manually, Render handles this

**"Application failed to respond"**
- Solution: Check start command is `npm start`
- Verify the app is listening on the correct port

### 6. Force Redeploy

1. Go to Render dashboard
2. Click "Manual Deploy"
3. Select "Deploy latest commit"
4. Watch the logs for errors

### 7. Test Locally First

Before deploying, test locally:
```bash
npm run build
npm start
# Visit http://localhost:3000
```

If it works locally but not on Render, check:
- Environment differences
- Missing files in .gitignore
- Build vs runtime issues

### 8. Quick Fixes to Try

1. **Redeploy:**
   - Manual Deploy → Deploy latest commit

2. **Check Logs:**
   - Look for specific error messages
   - Share error if you need help

3. **Verify Start Command:**
   - Should be: `npm start`
   - Not: `npm run dev` or `next dev`

4. **Check Service Health:**
   - Render dashboard → Your service
   - Look for health status indicators

### 9. Still Not Working?

Share:
- The exact error from Render logs
- Service status (deployed, building, crashed?)
- Any error messages you see

