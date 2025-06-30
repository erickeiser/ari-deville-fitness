/*
  # Add RLS policy for media files insertion

  1. Security
    - Add policy for authenticated users to insert media files
    - This allows authenticated users to upload media files to the database
*/

CREATE POLICY "Authenticated users can insert media files"
  ON media_files
  FOR INSERT
  TO authenticated
  WITH CHECK (true);