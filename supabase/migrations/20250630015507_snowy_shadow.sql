-- First, ensure RLS is enabled on all tables
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload policy" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated read policy" ON storage.objects;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.media_files;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.media_files;
DROP POLICY IF EXISTS "Enable update for authenticated users on own files" ON public.media_files;
DROP POLICY IF EXISTS "Enable delete for authenticated users on own files" ON public.media_files;
DROP POLICY IF EXISTS "Anyone can read media files" ON public.media_files;
DROP POLICY IF EXISTS "Authenticated users can insert media files" ON public.media_files;
DROP POLICY IF EXISTS "Authenticated users can update media files" ON public.media_files;
DROP POLICY IF EXISTS "Authenticated users can delete media files" ON public.media_files;

-- Simple storage bucket policies for media files (avoid UUID casting issues)
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated upload policy" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Media files table policies - allow public read, authenticated write
CREATE POLICY "Anyone can read media files" ON public.media_files
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert media files" ON public.media_files
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update media files" ON public.media_files
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete media files" ON public.media_files
FOR DELETE USING (auth.role() = 'authenticated');

-- Contact messages: anyone can insert, authenticated can read/update
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read contact messages" ON public.contact_messages
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update contact messages" ON public.contact_messages
FOR UPDATE USING (auth.role() = 'authenticated');

-- Intake submissions: anyone can insert, authenticated can read/update
DROP POLICY IF EXISTS "Anyone can insert intake submissions" ON public.intake_submissions;
DROP POLICY IF EXISTS "Authenticated users can read intake submissions" ON public.intake_submissions;
DROP POLICY IF EXISTS "Authenticated users can update intake submissions" ON public.intake_submissions;

CREATE POLICY "Anyone can insert intake submissions" ON public.intake_submissions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read intake submissions" ON public.intake_submissions
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update intake submissions" ON public.intake_submissions
FOR UPDATE USING (auth.role() = 'authenticated');

-- Site content: public can read, authenticated can manage
DROP POLICY IF EXISTS "Anyone can read site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can manage site content" ON public.site_content;

CREATE POLICY "Anyone can read site content" ON public.site_content
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage site content" ON public.site_content
FOR ALL USING (auth.role() = 'authenticated');

-- Services: public can read active services, authenticated can manage all
DROP POLICY IF EXISTS "Anyone can read active services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can manage services" ON public.services;

CREATE POLICY "Anyone can read active services" ON public.services
FOR SELECT USING (active = true);

CREATE POLICY "Authenticated users can manage services" ON public.services
FOR ALL USING (auth.role() = 'authenticated');

-- Testimonials: public can read active testimonials, authenticated can manage all
DROP POLICY IF EXISTS "Anyone can read active testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON public.testimonials;

CREATE POLICY "Anyone can read active testimonials" ON public.testimonials
FOR SELECT USING (active = true);

CREATE POLICY "Authenticated users can manage testimonials" ON public.testimonials
FOR ALL USING (auth.role() = 'authenticated');