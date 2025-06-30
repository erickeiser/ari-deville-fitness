# 🚀 Quick Supabase Setup Guide

## What You Need to Do (5 minutes):

### 1. Create Supabase Account
- Go to [supabase.com](https://supabase.com)
- Click "Start your project" 
- Sign up with GitHub/Google (fastest)

### 2. Create Project
- Click "New Project"
- Name: `fitness-trainer-cms`
- Generate strong password (save it!)
- Choose region closest to you
- Click "Create new project"
- ⏰ Wait 2-3 minutes for setup

### 3. Run Database Setup
- In Supabase dashboard → "SQL Editor"
- Copy ALL content from `supabase/migrations/create_complete_schema.sql`
- Paste in SQL Editor
- Click "Run" button
- ✅ Should see "Success. No rows returned"

### 4. Get Your Credentials
- Go to Settings → API
- Copy these two values:
  - **Project URL**: `https://xxxxx.supabase.co`
  - **Anon public key**: `eyJhbGciOiJIUzI1NiIs...`

### 5. Add to Netlify
- Go to [netlify.com](https://netlify.com) → Your site → Site settings
- Environment variables → Add variable:

**Variable 1:**
- Key: `VITE_SUPABASE_URL`
- Value: Your project URL

**Variable 2:**
- Key: `VITE_SUPABASE_ANON_KEY` 
- Value: Your anon key

### 6. Redeploy
- Deploys tab → Trigger deploy → Deploy site
- Wait for green checkmark

### 7. Test
- Visit your site `/admin/login`
- Login: `admin@fitprotrainer.com` / `admin123`
- Look for green "Connected" status

## Optional: File Uploads
- Storage → Create bucket → Name: `media` → Public
- This enables video/image uploads

## That's It!
Your site is now production-ready with full database functionality.

## Need Help?
- Check Supabase project isn't paused
- Verify environment variables are exact
- Make sure migration ran successfully