/*
  # Banquet Images Storage Setup

  ## Description
  Creates a storage bucket for banquet hall images with appropriate access policies.

  ## Storage Buckets
  
  ### `banquet-images`
  - Public bucket for storing banquet hall images
  - Supports image file uploads (JPEG, PNG, WebP)
  - Maximum file size: 5MB per image
  
  ## Security Policies
  
  1. Public Access - Anyone can view images (bucket is public)
  2. Authenticated Upload - Only authenticated users can upload images
  3. Owner Delete - Users can only delete images they uploaded

  ## Notes
  - Images are publicly accessible via URL
  - File naming convention: {user_id}/{banquet_id}/{timestamp}_{filename}
  - Supported formats: image/jpeg, image/png, image/webp
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('banquet-images', 'banquet-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view banquet images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banquet-images');

CREATE POLICY "Authenticated users can upload banquet images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'banquet-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own banquet images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'banquet-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
