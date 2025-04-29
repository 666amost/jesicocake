/*
  # Update Storage and RLS Policies

  1. Storage
    - Create 'foto' storage bucket for admin uploads
  
  2. Security Changes
    - Update RLS policies for products table to allow authenticated users to insert
*/

-- Create foto storage bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('foto', 'foto')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Set storage bucket public policy
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES
  ('foto', 'Public Read Access', '{"Version": "1.0", "Statement": [{"Effect": "Allow", "Principal": "*", "Action": "select", "Resource": ["foto/*"]}]}')
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Update RLS policies for products table
DROP POLICY IF EXISTS "Only admins can insert products" ON products;

-- Create new policy to allow authenticated users to insert products
CREATE POLICY "Allow authenticated users to insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add storage policies for authenticated users
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES
  ('foto', 'Authenticated Upload Access', '{
    "Version": "1.0",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Claims": {
            "role": "authenticated"
          }
        },
        "Action": ["insert", "update", "delete"],
        "Resource": ["foto/*"]
      }
    ]
  }')
ON CONFLICT (bucket_id, name) DO NOTHING;