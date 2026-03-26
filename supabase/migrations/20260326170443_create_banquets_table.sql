/*
  # Hotel Banquet Booking Platform Schema

  ## Description
  Creates the core database structure for managing hotel banquet halls across multiple locations.

  ## New Tables
  
  ### `banquets`
  Main table for storing banquet hall information
  - `id` (uuid, primary key) - Unique identifier for each banquet
  - `name` (text, required) - Name of the banquet hall
  - `description` (text, required) - Detailed description of the banquet
  - `price` (numeric, required) - Price per event/day
  - `location` (text, required) - City location (Delhi, Mumbai, Indore, etc.)
  - `images` (text[], required) - Array of image URLs
  - `published` (boolean, default false) - Visibility status on frontend
  - `user_id` (uuid, required) - Reference to auth.users (owner/creator)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - Enable RLS on `banquets` table
  - Public can view published banquets only
  - Authenticated users can create banquets
  - Users can only update/delete their own banquets
  
  ### Policies
  1. SELECT - Anyone can view published banquets
  2. INSERT - Authenticated users can create banquets
  3. UPDATE - Users can update their own banquets
  4. DELETE - Users can delete their own banquets

  ## Notes
  - Images are stored as text array containing Supabase Storage URLs
  - Location values are restricted to specific cities
  - Only published banquets appear on frontend (max 5 per location)
  - User authentication required for admin operations
*/

CREATE TABLE IF NOT EXISTS banquets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  location text NOT NULL CHECK (location IN ('Delhi', 'Mumbai', 'Indore', 'Lucknow', 'Noida', 'Gurgaon', 'Banaras', 'Ahmedabad')),
  images text[] NOT NULL DEFAULT '{}',
  published boolean DEFAULT false,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE banquets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published banquets"
  ON banquets FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can view all their banquets"
  ON banquets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create banquets"
  ON banquets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own banquets"
  ON banquets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own banquets"
  ON banquets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_banquets_location ON banquets(location);
CREATE INDEX IF NOT EXISTS idx_banquets_published ON banquets(published);
CREATE INDEX IF NOT EXISTS idx_banquets_user_id ON banquets(user_id);
