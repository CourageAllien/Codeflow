# Deploy ColdFlow to Render

This guide will help you deploy ColdFlow to Render.com.

## Prerequisites

1. A GitHub account
2. A Render account (free at [render.com](https://render.com))

## Step 1: Push Code to GitHub

If you haven't already:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/coldflow.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Render

### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard:**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Sign up or log in

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select your repository (`coldflow`)

3. **Configure Settings:**
   - **Name:** `coldflow` (or your preferred name)
   - **Environment:** `Node`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** Leave empty (or `.` if needed)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid for better performance)

4. **Environment Variables (Optional):**
   Add these if you want to use authentication or AI features:
   - `NODE_ENV` = `production`
   - `NEXT_TELEMETRY_DISABLED` = `1`
   - `ANTHROPIC_API_KEY` = (your Claude API key - optional)
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = (optional)
   - `CLERK_SECRET_KEY` = (optional)

5. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Wait 5-10 minutes for the first deployment

### Option B: Using render.yaml (Infrastructure as Code)

1. **The `render.yaml` file is already created in your project**

2. **Deploy:**
   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`
   - Click "Apply" to deploy

## Step 3: Access Your App

After deployment, Render will provide you with a URL like:
- `https://coldflow.onrender.com` (or your custom name)

## Important Notes for Render

### Free Tier Limitations:
- **Spins down after 15 minutes of inactivity** (takes ~30 seconds to wake up)
- **Limited to 750 hours/month** (enough for testing)
- **512MB RAM** (should be fine for this app)

### To Keep Free Tier Active:
- Use a service like [UptimeRobot](https://uptimerobot.com) to ping your app every 5 minutes
- Or upgrade to paid plan ($7/month) for always-on

### Custom Domain:
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as instructed

## Troubleshooting

### Build Fails:
- Check build logs in Render dashboard
- Ensure `package.json` has correct scripts
- Verify Node.js version (Render uses Node 18+ by default)

### App Crashes:
- Check runtime logs
- Verify environment variables are set
- Ensure port is correctly configured (Render uses PORT env var automatically)

### Slow First Load:
- Normal on free tier (cold starts)
- Consider upgrading for better performance

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | No | Set to `production` |
| `NEXT_TELEMETRY_DISABLED` | No | Disable Next.js telemetry |
| `ANTHROPIC_API_KEY` | No | Claude API for email generation |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | No | Clerk auth (public key) |
| `CLERK_SECRET_KEY` | No | Clerk auth (secret key) |

**Note:** App works in sandbox mode without any of these!

## Post-Deployment Checklist

- [ ] Test the live URL
- [ ] Try sandbox mode at `/sandbox`
- [ ] Test a few commands
- [ ] Set up uptime monitoring (optional)
- [ ] Add custom domain (optional)

## Support

- Render Docs: https://render.com/docs
- Render Status: https://status.render.com
- Render Community: https://community.render.com

