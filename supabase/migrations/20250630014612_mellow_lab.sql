/*
  # Fix Media Files RLS Policy
  
  This migration ensures the correct RLS policy exists for media file uploads.
  It handles the case where the policy might already exist.
*/

-- Drop the policy if it exists, then recreate it
DO $$ 
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Authenticated users can insert media files" ON media_files;
  
  -- Create the policy
  CREATE POLICY "Authenticated users can insert media files"
    ON media_files
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
    
EXCEPTION WHEN OTHERS THEN
  -- If there's any error, just create the policy (in case table doesn't exist yet)
  CREATE POLICY "Authenticated users can insert media files"
    ON media_files
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
END $$;