/*
  # Initial schema setup for Jesico Cake

  1. New Tables
    - `products` - Stores cake products info
    - `toppings` - Stores available toppings
    - `orders` - Stores customer orders
    - `order_items` - Stores items in each order
    - `carts` - Stores shopping cart data
    - `cart_items` - Stores items in shopping carts
  
  2. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  available BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Toppings table
CREATE TABLE IF NOT EXISTS toppings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  topping_id UUID REFERENCES toppings(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  topping_price DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Carts table
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  topping_id UUID REFERENCES toppings(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  USING (available = true OR (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin'));

CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for toppings
CREATE POLICY "Anyone can view available toppings"
  ON toppings FOR SELECT
  USING (available = true OR (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin'));

CREATE POLICY "Only admins can insert toppings"
  ON toppings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update toppings"
  ON toppings FOR UPDATE
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete toppings"
  ON toppings FOR DELETE
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for order_items
CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- RLS Policies for carts
CREATE POLICY "Anyone can view carts"
  ON carts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert carts"
  ON carts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update carts"
  ON carts FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete carts"
  ON carts FOR DELETE
  USING (true);

-- RLS Policies for cart_items
CREATE POLICY "Anyone can view cart items"
  ON cart_items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert cart items"
  ON cart_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update cart items"
  ON cart_items FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete cart items"
  ON cart_items FOR DELETE
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_toppings_modtime
BEFORE UPDATE ON toppings
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_orders_modtime
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_carts_modtime
BEFORE UPDATE ON carts
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_cart_items_modtime
BEFORE UPDATE ON cart_items
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();