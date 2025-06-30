/*
  # Fix Media Upload RLS Policies

  This migration fixes the Row Level Security policies that are preventing media uploads.

  ## Changes Made

  1. **Storage Bucket Policies**
     - Ensure proper policies for the 'media' storage bucket
     - Allow public read access to media files
     - Allow authenticated users to upload files
     - Allow authenticated users to update/delete their uploads

  2. **Media Files Table Policies**
     - Update existing policies to properly allow authenticated users to insert records
     - Ensure authenticated users can read all media files
     - Allow authenticated users to delete media files

  ## Security Notes
  - Public read access is enabled for the media bucket (required for displaying images/videos)
  - Only authenticated users can upload, update, or delete files
  - All authenticated users can manage media files (suitable for admin interface)
*/

-- First, ensure the media storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media', 'media', true, 104857600, ARRAY['image/*', 'video/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 104857600,
  allowed_mime_types = ARRAY['image/*', 'video/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Create storage policies for the media bucket
CREATE POLICY "Public read access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated users can update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated users can delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'media');

-- Drop existing media_files table policies if they exist
DROP POLICY IF EXISTS "Anyone can read media files" ON media_files;
DROP POLICY IF EXISTS "Authenticated users can manage media files" ON media_files;

-- Create new policies for media_files table
CREATE POLICY "Anyone can read media files"
  ON media_files
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert media files"
  ON media_files
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update media files"
  ON media_files
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete media files"
  ON media_files
  FOR DELETE
  TO authenticated
  USING (true);

-- Ensure RLS is enabled on media_files table
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;