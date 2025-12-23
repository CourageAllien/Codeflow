# Step-by-Step: Create Fresh Render Service

Follow these steps exactly to create a clean deployment.

---

## Step 1: Go to Render Dashboard

1. Open your browser
2. Go to: **https://dashboard.render.com**
3. Log in (or sign up if you don't have an account)

---

## Step 2: Create New Web Service

1. Click the **"New +"** button (top right)
2. Select **"Web Service"** from the dropdown

---

## Step 3: Connect Your GitHub Repository

1. You'll see "Connect a repository" section
2. Click **"Connect GitHub"** (or "Connect GitLab" if using GitLab)
3. If this is your first time:
   - Authorize Render to access your GitHub
   - Select the repositories you want to give access to
   - Click "Install" or "Authorize"
4. In the repository list, find and select: **`CourageAllien/Codeflow`**
5. Click **"Connect"**

---

## Step 4: Configure Basic Settings

Fill in these fields:

### Name
- **Field:** Name
- **Value:** `coldflow` (or any name you prefer)
- **Note:** This will be part of your URL: `coldflow.onrender.com`

### Region
- **Field:** Region
- **Value:** Choose the region closest to you (e.g., "Oregon (US West)" or "Frankfurt (EU)")

### Branch
- **Field:** Branch
- **Value:** `main` (should be selected by default)

### Root Directory
- **Field:** Root Directory
- **Value:** Leave **EMPTY** (don't fill this in)

---

## Step 5: Configure Runtime

### Environment
- **Field:** Environment
- **Value:** Select **"Node"**

### Build Command
- **Field:** Build Command
- **Value:** Copy and paste exactly:
  ```
  npm install && npx prisma generate && npm run build
  ```

### Start Command
- **Field:** Start Command
- **Value:** Copy and paste exactly:
  ```
  npm start
  ```

### Plan
- **Field:** Plan
- **Value:** Select **"Free"** (or choose a paid plan if you want)

---

## Step 6: Configure Environment Variables

1. Scroll down to the **"Environment Variables"** section
2. Click **"Add Environment Variable"** for each one:

### Variable 1:
- **Key:** `NODE_ENV`
- **Value:** `production`
- Click "Save"

### Variable 2:
- **Key:** `NEXT_TELEMETRY_DISABLED`
- **Value:** `1`
- Click "Save"

### Variable 3:
- **Key:** `DATABASE_URL`
- **Value:** `file:./dev.db`
- Click "Save"

**Optional Variables (only if you have them):**
- `ANTHROPIC_API_KEY` = your Anthropic API key (for AI features)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = your Clerk publishable key
- `CLERK_SECRET_KEY` = your Clerk secret key

---

## Step 7: Disable Docker (IMPORTANT!)

1. Scroll down to find **"Docker"** section
2. Make sure Docker is **DISABLED** or **NOT ENABLED**
3. If you see a toggle for Docker, make sure it's **OFF**
4. **Important:** We're using standard Next.js deployment, not Docker

---

## Step 8: Review and Create

1. Review all your settings:
   - ✅ Repository: `CourageAllien/Codeflow`
   - ✅ Name: `coldflow`
   - ✅ Build Command: `npm install && npx prisma generate && npm run build`
   - ✅ Start Command: `npm start`
   - ✅ Environment Variables: 3 added
   - ✅ Docker: Disabled

2. Click the **"Create Web Service"** button (bottom of page)

---

## Step 9: Watch the Build

1. You'll be taken to your service dashboard
2. You'll see the build process starting
3. Watch the **"Logs"** tab to see progress
4. The build will:
   - Install dependencies
   - Generate Prisma client
   - Build Next.js app
   - Start the service

5. Wait for status to change to **"Live"** (green indicator)
   - This usually takes 3-5 minutes

---

## Step 10: Get Your URL

1. Once status shows **"Live"**, you'll see your service URL
2. It will look like: `https://coldflow.onrender.com`
3. Copy this URL

---

## Step 11: Test Your Deployment

### Test 1: Simple Test Page
1. Visit: `https://your-url.onrender.com/test`
2. You should see: "Test Page - If you can see this, the app is working!"
3. ✅ If this works, basic setup is correct

### Test 2: Main Page
1. Visit: `https://your-url.onrender.com/`
2. You should see the ColdFlow landing page
3. ✅ If this works, everything is deployed correctly

### Test 3: Sandbox Page
1. Visit: `https://your-url.onrender.com/sandbox`
2. You should see the sandbox terminal
3. ✅ If this works, all features are working

---

## Troubleshooting

### If Build Fails:

1. **Check Build Logs:**
   - Go to "Logs" tab
   - Look for red error messages
   - Common issues:
     - Missing dependencies → Check package.json
     - Prisma errors → Check DATABASE_URL
     - Build errors → Check for TypeScript errors

2. **Common Fixes:**
   - Make sure build command is exactly: `npm install && npx prisma generate && npm run build`
   - Make sure Docker is disabled
   - Check that all environment variables are set

### If Service Won't Start:

1. **Check Runtime Logs:**
   - Go to "Logs" tab
   - Look for "Ready on http://localhost:PORT"
   - If you see errors, share them

2. **Common Issues:**
   - Port conflicts → Render handles this automatically
   - Missing modules → Rebuild the service
   - Database errors → Check DATABASE_URL

### If Page is Blank:

1. **Check Browser Console:**
   - Press F12
   - Go to "Console" tab
   - Look for red errors
   - Share any errors you see

2. **Check Render Logs:**
   - Look for runtime errors
   - Check if service is actually running

---

## Success Checklist

After deployment, verify:

- [ ] Service status shows "Live" (green)
- [ ] Build completed without errors
- [ ] `/test` page loads correctly
- [ ] Main page (`/`) loads correctly
- [ ] `/sandbox` page loads correctly
- [ ] No errors in browser console (F12)
- [ ] No errors in Render logs

---

## Next Steps After Deployment

1. **Bookmark your URL** for easy access
2. **Test all features:**
   - Try commands in sandbox
   - Test different pages
   - Verify everything works

3. **Optional: Set up custom domain**
   - Go to Settings → Custom Domains
   - Add your domain (if you have one)

4. **Monitor:**
   - Check Render dashboard regularly
   - Review logs if issues occur
   - Set up uptime monitoring (optional)

---

## Quick Reference

**Your Service URL:** `https://coldflow.onrender.com` (or your custom name)

**Build Command:**
```
npm install && npx prisma generate && npm run build
```

**Start Command:**
```
npm start
```

**Required Environment Variables:**
- `NODE_ENV=production`
- `NEXT_TELEMETRY_DISABLED=1`
- `DATABASE_URL=file:./dev.db`

---

## Need Help?

If you get stuck at any step:
1. Share which step you're on
2. Share any error messages you see
3. Share what you see in the Render logs

I'll help you troubleshoot!

