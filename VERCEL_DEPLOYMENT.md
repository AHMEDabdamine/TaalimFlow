# 🚀 Deploying Taalim Flow to Vercel

This guide will help you deploy your Taalim Flow school management platform to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Prepare your notification settings

## 🔧 Pre-Deployment Setup

### 1. Choose Your Data Storage Option

**Option A: In-Memory Storage (Simple but data resets)**
- Use the existing `api/leads.js` file
- ⚠️ **Warning**: Data will reset on each deployment
- Good for testing and demonstration

**Option B: Persistent Storage with Vercel KV (Recommended)**
- Replace `api/leads.js` with `api/leads-with-kv.js`
- Set up Vercel KV in your project dashboard
- Data persists between deployments

### 2. Environment Variables Setup

You'll need to configure these in Vercel's dashboard:

#### Required for Telegram Notifications:
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_IDS=chat_id1,chat_id2
```

#### Required for Email Notifications:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your.email@gmail.com
ADMIN_EMAILS=admin@school.dz,director@school.dz
```

#### Optional:
```
NODE_ENV=production
```

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
# If not already done, initialize git repository
git init
git add .
git commit -m "Prepare for Vercel deployment"

# Push to your GitHub repository
git remote add origin https://github.com/yourusername/taalim-flow.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. **Login to Vercel**: Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Import Project**: Click "New Project" → "Import Git Repository"
3. **Select Repository**: Choose your Taalim Flow repository
4. **Framework**: Vercel should auto-detect as "Vite"
5. **Root Directory**: Leave as default (`.`)

### Step 3: Configure Build Settings

**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`

### Step 4: Set Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add all your environment variables from the list above
3. Make sure to add them for all environments (Production, Preview, Development)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-3 minutes)
3. Your app will be available at `https://your-project-name.vercel.app`

## 🔄 Setting Up Persistent Storage (Optional but Recommended)

### Option 1: Vercel KV (Easiest)

1. **Enable KV**: In your Vercel dashboard, go to **Storage** → **Create Database** → **KV**
2. **Install Package**: Add to your project:
   ```bash
   npm install @vercel/kv
   ```
3. **Replace API File**: 
   - Delete `api/leads.js`
   - Rename `api/leads-with-kv.js` to `api/leads.js`
4. **Redeploy**: Push changes to trigger new deployment

### Option 2: External Database

You can connect to any external database:
- **PostgreSQL**: Vercel Postgres, Railway, PlanetScale
- **MongoDB**: MongoDB Atlas
- **Supabase**: Full backend-as-a-service

## 🧪 Testing Your Deployment

### 1. Check Health Endpoint
Visit: `https://your-app.vercel.app/api/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "platform": "vercel"
}
```

### 2. Test Contact Form
1. Visit your deployed app
2. Fill out the contact form
3. Check if notifications are received (Telegram/Email)

### 3. Check Logs
- Go to Vercel Dashboard → Your Project → Functions
- Check logs for any errors

## 🔧 Common Issues & Solutions

### Build Fails
- **Check Node version**: Ensure you're using Node 18+
- **Dependencies**: Run `npm install` locally to check for issues
- **Environment**: Make sure all required env vars are set

### API Routes Not Working
- **Check paths**: API routes should be in `/api` folder
- **CORS errors**: The API includes CORS headers, but check browser console
- **Function timeout**: Increase in `vercel.json` if needed

### Notifications Not Sending
- **Environment Variables**: Double-check all values in Vercel dashboard
- **Telegram Bot**: Ensure bot token is active and has permissions
- **Email SMTP**: Test SMTP settings locally first

### Data Not Persisting
- **In-memory storage**: Switch to Vercel KV or external database
- **KV not connected**: Ensure KV database is properly linked in Vercel

## 📱 Post-Deployment

### 1. Custom Domain (Optional)
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed

### 2. Analytics
- Enable Vercel Analytics in your project settings
- Monitor performance and usage

### 3. Monitoring
- Set up alerts for function errors
- Monitor response times

## 🎯 Production Checklist

- [ ] All environment variables configured
- [ ] Telegram notifications working
- [ ] Email notifications working  
- [ ] Contact form submissions saving
- [ ] Health endpoint responding
- [ ] Custom domain configured (if needed)
- [ ] Analytics enabled
- [ ] Error monitoring set up

## 🆘 Need Help?

1. **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **Function Logs**: Check in Vercel dashboard for error details
3. **Contact Support**: Use Vercel's support if needed

Your Taalim Flow platform is now ready for production use on Vercel! 🎉