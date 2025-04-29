/*
  # Fix storage permissions for foto bucket

  1. Updates
    - Add proper storage policies for foto bucket
    - Enable public access and authenticated uploads
*/

-- Drop existing policies for foto bucket
DELETE FROM storage.policies WHERE bucket_id = 'foto';

-- Add comprehensive storage policies
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES
  ('foto', 'Public Access', '{
    "Version": "1.0",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": "*",
        "Action": ["select"],
        "Resource": ["foto/*"]
      }
    ]
  }'),
  ('foto', 'Auth Upload', '{
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
  }');