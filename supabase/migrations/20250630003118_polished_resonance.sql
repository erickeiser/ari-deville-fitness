/*
  # Complete Database Schema for Fitness Trainer CMS
  
  1. New Tables
    - `contact_messages` - Store contact form submissions
    - `intake_submissions` - Store client intake forms  
    - `services` - Training services with pricing
    - `testimonials` - Client success stories
    - `media_files` - Uploaded images and videos
    - `site_content` - Dynamic website content
    
  2. Security
    - Enable RLS on all tables
    - Public can insert forms and read active content
    - Authenticated users can manage all content
    
  3. Performance
    - Indexes on frequently queried columns
    - Optimized for real-time updates
    
  4. Default Data
    - Sample services and testimonials
    - Default site content
*/

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  priority text NOT NULL DEFAULT 'medium',
  "submittedAt" timestamptz NOT NULL DEFAULT now(),
  "repliedAt" timestamptz
);

-- Intake Submissions Table
CREATE TABLE IF NOT EXISTS intake_submissions (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "firstName" text NOT NULL,
  "lastName" text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  age integer NOT NULL,
  "fitnessLevel" text NOT NULL,
  goals text NOT NULL,
  injuries text,
  availability jsonb NOT NULL DEFAULT '[]'::jsonb,
  "preferredService" text NOT NULL,
  budget text,
  "additionalInfo" text,
  status text NOT NULL DEFAULT 'new',
  notes text,
  "submittedAt" timestamptz NOT NULL DEFAULT now(),
  "lastContactedAt" timestamptz
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  price text NOT NULL,
  description text NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  icon text NOT NULL,
  popular boolean DEFAULT false,
  active boolean DEFAULT true,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  title text NOT NULL,
  image text NOT NULL,
  "videoThumb" text NOT NULL,
  "videoUrl" text,
  quote text NOT NULL,
  rating integer DEFAULT 5,
  results text NOT NULL,
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

-- Media Files Table
CREATE TABLE IF NOT EXISTS media_files (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  filename text NOT NULL,
  "originalName" text NOT NULL,
  url text NOT NULL,
  type text NOT NULL,
  size integer NOT NULL,
  "uploadedAt" timestamptz DEFAULT now(),
  "uploadedBy" text NOT NULL
);

-- Site Content Table
CREATE TABLE IF NOT EXISTS site_content (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  section text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  type text DEFAULT 'text',
  "updatedAt" timestamptz DEFAULT now(),
  "updatedBy" text NOT NULL,
  UNIQUE(section, key)
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then create new ones
-- Contact Messages Policies
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can read contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "contact_messages_insert_policy" ON contact_messages;
DROP POLICY IF EXISTS "contact_messages_select_policy" ON contact_messages;
DROP POLICY IF EXISTS "contact_messages_update_policy" ON contact_messages;

CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Authenticated users can read contact messages" ON contact_messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update contact messages" ON contact_messages
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Intake Submissions Policies
DROP POLICY IF EXISTS "Anyone can insert intake submissions" ON intake_submissions;
DROP POLICY IF EXISTS "Authenticated users can read intake submissions" ON intake_submissions;
DROP POLICY IF EXISTS "Authenticated users can update intake submissions" ON intake_submissions;
DROP POLICY IF EXISTS "intake_submissions_insert_policy" ON intake_submissions;
DROP POLICY IF EXISTS "intake_submissions_select_policy" ON intake_submissions;
DROP POLICY IF EXISTS "intake_submissions_update_policy" ON intake_submissions;

CREATE POLICY "Anyone can insert intake submissions" ON intake_submissions
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Authenticated users can read intake submissions" ON intake_submissions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update intake submissions" ON intake_submissions
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Services Policies
DROP POLICY IF EXISTS "Anyone can read active services" ON services;
DROP POLICY IF EXISTS "Authenticated users can manage services" ON services;
DROP POLICY IF EXISTS "services_select_public_policy" ON services;
DROP POLICY IF EXISTS "services_all_authenticated_policy" ON services;

CREATE POLICY "Anyone can read active services" ON services
  FOR SELECT TO public USING (active = true);

CREATE POLICY "Authenticated users can manage services" ON services
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Testimonials Policies
DROP POLICY IF EXISTS "Anyone can read active testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON testimonials;
DROP POLICY IF EXISTS "testimonials_select_public_policy" ON testimonials;
DROP POLICY IF EXISTS "testimonials_all_authenticated_policy" ON testimonials;

CREATE POLICY "Anyone can read active testimonials" ON testimonials
  FOR SELECT TO public USING (active = true);

CREATE POLICY "Authenticated users can manage testimonials" ON testimonials
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Media Files Policies
DROP POLICY IF EXISTS "Anyone can read media files" ON media_files;
DROP POLICY IF EXISTS "Authenticated users can manage media files" ON media_files;
DROP POLICY IF EXISTS "media_files_select_policy" ON media_files;
DROP POLICY IF EXISTS "media_files_all_authenticated_policy" ON media_files;

CREATE POLICY "Anyone can read media files" ON media_files
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage media files" ON media_files
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Site Content Policies
DROP POLICY IF EXISTS "Anyone can read site content" ON site_content;
DROP POLICY IF EXISTS "Authenticated users can manage site content" ON site_content;
DROP POLICY IF EXISTS "site_content_select_policy" ON site_content;
DROP POLICY IF EXISTS "site_content_all_authenticated_policy" ON site_content;

CREATE POLICY "Anyone can read site content" ON site_content
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage site content" ON site_content
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_submitted_at ON contact_messages ("submittedAt" DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages (email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_priority ON contact_messages (priority);

CREATE INDEX IF NOT EXISTS idx_intake_submissions_submitted_at ON intake_submissions ("submittedAt" DESC);
CREATE INDEX IF NOT EXISTS idx_intake_submissions_status ON intake_submissions (status);
CREATE INDEX IF NOT EXISTS idx_intake_submissions_email ON intake_submissions (email);

CREATE INDEX IF NOT EXISTS idx_services_active ON services (active);
CREATE INDEX IF NOT EXISTS idx_services_popular ON services (popular);

CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials (active);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials (featured);

CREATE INDEX IF NOT EXISTS idx_media_files_type ON media_files (type);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_at ON media_files ("uploadedAt" DESC);

CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content (section);
CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content (key);
CREATE INDEX IF NOT EXISTS idx_site_content_section_key ON site_content (section, key);

-- Insert Default Services (only if they don't exist)
INSERT INTO services (id, title, price, description, features, icon, popular, active) VALUES
('1', 'Personal Training', '$80/session', 'One-on-one personalized training sessions tailored to your specific goals and fitness level.', '["Customized workout plans", "Form correction & technique", "Progress tracking", "Flexible scheduling", "Nutritional guidance"]', 'User', true, true),
('2', 'Small Group Training', '$45/session', 'Train with 2-4 people in a motivating group environment while receiving personalized attention.', '["Groups of 2-4 people", "Cost-effective training", "Social motivation", "Varied workout styles", "Team building"]', 'Users', false, true),
('3', 'Virtual Training', '$60/session', 'Get professional training from anywhere with live virtual sessions via video call.', '["Train from home", "Live video sessions", "Equipment adaptations", "Digital workout plans", "Progress monitoring"]', 'Video', false, true),
('4', 'Nutrition Coaching', '$120/month', 'Comprehensive nutrition guidance to complement your training and accelerate results.', '["Personalized meal plans", "Macro tracking guidance", "Supplement recommendations", "Weekly check-ins", "Recipe suggestions"]', 'Utensils', false, true)
ON CONFLICT (id) DO NOTHING;

-- Insert Default Testimonials (only if they don't exist)
INSERT INTO testimonials (id, name, title, image, "videoThumb", quote, rating, results, featured, active) VALUES
('1', 'Sarah Chen', 'Marketing Manager', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://images.pexels.com/photos/4761792/pexels-photo-4761792.jpeg?auto=compress&cs=tinysrgb&w=600', 'Lost 30 pounds in 4 months while building the strongest I''ve ever been. Alex''s approach is sustainable and actually enjoyable!', 5, 'Lost 30 lbs | Gained Confidence', true, true),
('2', 'Michael Rodriguez', 'Software Engineer', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=600', 'As a busy dad, I thought I''d never find time for fitness. Alex helped me create a routine that works with my schedule.', 5, 'Built Muscle | Better Energy', false, true),
('3', 'Jessica Thompson', 'Teacher', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://images.pexels.com/photos/4058316/pexels-photo-4058316.jpeg?auto=compress&cs=tinysrgb&w=600', 'After my injury, I was afraid to exercise. Alex guided me back to full strength safely and confidently.', 5, 'Injury Recovery | Strength Gained', false, true)
ON CONFLICT (id) DO NOTHING;

-- Insert Default Site Content (only if it doesn't exist)
INSERT INTO site_content (section, key, value, type, "updatedBy") VALUES
('hero', 'title', 'Transform Your Body, Transform Your Life', 'text', 'system'),
('hero', 'subtitle', 'Professional personal training with proven results. I help busy professionals achieve their fitness goals through personalized workout plans, nutrition guidance, and unwavering support.', 'text', 'system'),
('hero', 'heroImage', 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=800', 'image', 'system'),
('hero', 'heroMediaType', 'image', 'text', 'system'),
('hero', 'heroVideo', '', 'text', 'system'),
('hero', 'ctaText', 'Start Your Journey', 'text', 'system'),
('hero', 'secondaryCtaText', 'Learn More', 'text', 'system'),
('about', 'title', 'Meet Your Dedicated Fitness Partner', 'text', 'system'),
('about', 'description', 'Hi, I''m Alex Johnson, a certified personal trainer with over 5 years of experience helping people transform their lives through fitness. My journey began when I overcame my own health challenges, and now I''m passionate about guiding others on their path to wellness.', 'text', 'system'),
('about', 'trainerImage', 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800', 'image', 'system'),
('about', 'trainerName', 'Alex Johnson', 'text', 'system'),
('about', 'experience', '5+', 'text', 'system'),
('contact', 'email', 'alex@fitprotrainer.com', 'text', 'system'),
('contact', 'phone', '(555) 123-4567', 'text', 'system'),
('contact', 'address', 'Downtown Fitness Center', 'text', 'system'),
('contact', 'addressLine2', '123 Main Street, City State 12345', 'text', 'system'),
('contact', 'hours', 'Monday - Friday: 6:00 AM - 8:00 PM\nSaturday: 7:00 AM - 6:00 PM\nSunday: 8:00 AM - 4:00 PM', 'text', 'system')
ON CONFLICT (section, key) DO NOTHING;