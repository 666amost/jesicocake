-- Migration: Create order_details table for storing order item details
CREATE TABLE IF NOT EXISTS order_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  topping_name TEXT,
  quantity INTEGER NOT NULL
); 