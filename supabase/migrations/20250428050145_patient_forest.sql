/*
  # Storage and RLS Policy Updates

  1. Storage
    - Create 'products' storage bucket for product images
  
  2. Security Changes
    - Update RLS policies for products table to properly check admin role
    - Add storage bucket policies
*/

-- Create products storage bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('products', 'products')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Set storage bucket public policy
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES
  ('products', 'Public Read Access', '{"Version": "1.0", "Statement": [{"Effect": "Allow", "Principal": "*", "Action": "select", "Resource": ["products/*"]}]}')
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Update RLS policies for products table
DROP POLICY IF EXISTS "Anyone can view available products" ON products;
DROP POLICY IF EXISTS "Only admins can insert products" ON products;
DROP POLICY IF EXISTS "Only admins can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;

-- Create new policies with better role checking
CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  USING (
    available = true OR 
    (auth.role() = 'authenticated' AND auth.jwt() ->> 'user_role' = 'admin')
  );

CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND 
    auth.jwt() ->> 'user_role' = 'admin'
  );

CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND 
    auth.jwt() ->> 'user_role' = 'admin'
  );

CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  USING (
    auth.role() = 'authenticated' AND 
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- Add storage policies for admin users
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES
  ('products', 'Admin Upload Access', '{
    "Version": "1.0",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Claims": {
            "role": "authenticated",
            "user_role": "admin"
          }
        },
        "Action": ["insert", "update", "delete"],
        "Resource": ["products/*"]
      }
    ]
  }')
ON CONFLICT (bucket_id, name) DO NOTHING;