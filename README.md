# Ari Deville Fitness - Complete Fitness Website & CMS

A modern, production-ready fitness trainer website with a complete content management system built with React, TypeScript, and Supabase.

## 🚀 Features

### Public Website
- **Hero Section** with image/video support
- **About Section** with trainer information
- **Services** with pricing and features
- **Client Testimonials** with video support
- **Intake Form** for new clients
- **Contact Form** with business information
- **Responsive Design** for all devices

### Admin Dashboard
- **Content Management** - Edit all website content
- **Services Management** - Add/edit training services
- **Testimonials Management** - Manage client success stories
- **Media Library** - Upload and manage images/videos
- **Intake Forms** - View and manage client submissions
- **Contact Messages** - Handle customer inquiries
- **User Management** - Manage admin users

### Technical Features
- **Real-time Database** with Supabase
- **File Upload** with cloud storage
- **Authentication** system
- **Row Level Security** (RLS)
- **Responsive Design** with Tailwind CSS
- **TypeScript** for type safety
- **Production Ready** deployment

## 🛠️ Setup Instructions

### 1. Clone and Install
```bash
git clone <repository-url>
cd ari-deville-fitness
npm install
```

### 2. Set Up Supabase (Required for Production)

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the database to be ready

2. **Get Your Credentials**
   - Go to Settings > API
   - Copy your Project URL and anon public key

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Database Migrations**
   - In your Supabase dashboard, go to SQL Editor
   - Copy and run the migration from `supabase/migrations/create_complete_schema.sql`
   - This creates all tables, policies, and default data

5. **Set Up Storage (Optional)**
   - Go to Storage in your Supabase dashboard
   - Create a bucket named `media`
   - Set it to public for file uploads

### 3. Development
```bash
npm run dev
```

### 4. Production Deployment

The site is already configured for Netlify deployment:

```bash
npm run build
```

Deploy the `dist` folder to your hosting provider.

## 📱 Mobile Support

The application is fully responsive and works on all devices. The admin panel is optimized for mobile management.

## 🔐 Default Admin Credentials

- **Email:** ari@aridevillefitness.com
- **Password:** admin123

**Important:** Change these credentials in production!

## 🗃️ Database Schema

The application uses the following main tables:
- `contact_messages` - Contact form submissions
- `intake_submissions` - Client intake forms
- `services` - Training services
- `testimonials` - Client testimonials
- `media_files` - Uploaded files
- `site_content` - Dynamic website content

## 🎨 Customization

### Branding
- Update colors in `tailwind.config.js`
- Replace logo and images in the admin panel
- Modify content through the CMS

### Content
- All website content is editable through the admin panel
- No code changes needed for content updates
- Support for images, videos, and rich text

## 🚀 Production Checklist

- [ ] Set up Supabase project
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Change default admin credentials
- [ ] Test file uploads
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Test contact forms
- [ ] Verify mobile responsiveness

## 📞 Support

For technical support or customization requests, please contact the development team.

## 📄 License

This project is licensed under the MIT License.# ari-deville-fitness
