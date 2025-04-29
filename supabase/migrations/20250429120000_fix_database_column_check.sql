-- Function untuk memeriksa apakah kolom ada dalam tabel
CREATE OR REPLACE FUNCTION public.check_column_exists(table_name text, column_name text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  column_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public'
      AND table_name = $1
      AND column_name = $2
  ) INTO column_exists;
  
  RETURN column_exists;
END;
$$;

-- Menambahkan kolom user_id ke tabel orders jika belum ada
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public'
          AND table_name = 'orders' 
          AND column_name = 'user_id'
    ) THEN
        ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES auth.users(id) NULL;
    END IF;
END $$;

-- Tambahkan kebijakan RLS agar pengguna dapat melihat pesanan mereka sendiri
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'orders' 
          AND policyname = 'Users can view their own orders'
    ) THEN
        CREATE POLICY "Users can view their own orders"
          ON orders FOR SELECT
          USING (auth.uid() = user_id);
    END IF;
END $$; 