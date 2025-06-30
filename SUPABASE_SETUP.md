# 🗄️ Complete Supabase Setup Guide

## Step 1: Create Supabase Project

1. **Go to Supabase**
   - Visit [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign up or log in

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project details:
     - **Name**: `fitness-trainer-cms`
     - **Database Password**: Generate a strong password (save this!)
     - **Region**: Choose closest to your users
   - Click "Create new project"
   - Wait 2-3 minutes for setup to complete

## Step 2: Get Your Credentials

1. **Navigate to Settings**
   - In your project dashboard, click "Settings" (gear icon)
   - Go to "API" section

2. **Copy Your Credentials**
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Configure Environment Variables

1. **Create .env file** (if not exists):
   ```bash
   cp .env.example .env
   ```

2. **Edit .env file** with your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 4: Run Database Migration

1. **Go to SQL Editor**
   - In your Supabase dashboard
   - Click "SQL Editor" in the sidebar

2. **Run the Initial Migration**
   - Copy the entire content from `supabase/migrations/20250629223101_foggy_darkness.sql`
   - Paste it in the SQL Editor
   - Click "Run" button

3. **Run the Fix Migration**
   - Copy the entire content from `supabase/migrations/fix_auth_and_rls_policies.sql`
   - Paste it in the SQL Editor
   - Click "Run" button

4. **Verify Tables Created**
   - Go to "Table Editor"
   - You should see these tables:
     - `contact_messages`
     - `intake_submissions`
     - `services`
     - `testimonials`
     - `media_files`
     - `site_content`

## Step 5: Set Up Storage

1. **Create Storage Bucket**
   - Go to "Storage" in sidebar
   - Click "Create bucket"
   - Name: `media`
   - Make it **Public**
   - Click "Create bucket"

2. **Verify Storage Policies**
   - The migration should have created the necessary policies
   - Go to Storage > media bucket > Policies
   - You should see policies for:
     - Public read access
     - Authenticated upload
     - Authenticated update/delete

## Step 6: Set Up Authentication

1. **Create Admin User**
   - Go to "Authentication" in sidebar
   - Click "Add user"
   - Email: `admin@fitprotrainer.com`
   - Password: `admin123`
   - Click "Create user"

2. **Verify User Creation**
   - The user should appear in the Users table
   - Note the user ID for reference

## Step 7: Test Connection

1. **Restart Development Server**
   ```bash
   npm run dev
   ```

2. **Check Admin Panel**
   - Go to `/admin/login`
   - Login with: `admin@fitprotrainer.com` / `admin123`
   - Look for "Connected" status in top right
   - Green database icon = Success!

## Step 8: Verify Functionality

1. **Test Authentication**
   - Login should work without "Invalid credentials" error
   - Should see "Connected" status instead of "Demo Mode"

2. **Test Media Upload**
   - Go to Admin > Media Library
   - Try uploading an image
   - Should work without RLS policy errors

3. **Test Forms**
   - Submit a contact form on the public site
   - Check if it appears in Admin > Messages

4. **Test Content Management**
   - Go to Admin > Site Content
   - Edit some content and save
   - Verify changes appear on public site

## Troubleshooting

### Authentication Issues:

**1. "Invalid login credentials" Error**
- Ensure you created the admin user in Supabase Authentication
- Verify email and password match exactly
- Check that user is confirmed (not pending)

**2. Still Shows "Demo Mode"**
- Check `.env` file has correct credentials
- Restart development server after changing `.env`
- Verify Supabase project is active (not paused)

### RLS Policy Issues:

**1. "Row-level security policy" Errors**
- Ensure you ran the `fix_auth_and_rls_policies.sql` migration
- Check that RLS is enabled on all tables
- Verify policies exist in Table Editor > Policies

**2. Media Upload Errors**
- Ensure storage bucket `media` exists and is public
- Check storage policies are created
- Verify user is authenticated when uploading

### Connection Issues:

**1. "Local Only" Message Still Showing**
- Double-check environment variables
- Ensure project URL and API key are correct
- Restart development server

**2. Supabase Project Paused**
- Free tier projects pause after inactivity
- Go to Supabase dashboard and resume project

## Production Checklist

- [ ] Supabase project created and active
- [ ] Environment variables configured correctly
- [ ] Initial database migration completed
- [ ] RLS fix migration completed
- [ ] Storage bucket `media` created and public
- [ ] Admin user created in Authentication
- [ ] Connection verified (green "Connected" status)
- [ ] Authentication working (no "Invalid credentials")
- [ ] Media uploads working (no RLS errors)
- [ ] Forms working (contact/intake submissions)
- [ ] Content management working

## Security Notes

- The RLS policies ensure only authenticated users can manage content
- Public users can only read active content and submit forms
- Media files are publicly readable but only authenticated users can upload
- All sensitive operations require authentication

## Next Steps

Once Supabase is fully set up:
1. Customize content through admin panel
2. Upload your own images/videos
3. Configure additional users if needed
4. Deploy to production hosting

Your site will be fully production-ready with secure database backend once this setup is complete!