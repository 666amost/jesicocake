/*
  # Insert sample data

  1. Sample Data
    - Insert sample products
    - Insert sample toppings
*/

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, available, stock)
VALUES
  ('Chocolate Cake', 'Rich chocolate cake with smooth ganache', 150000, 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg', 'cake', true, 10),
  ('Vanilla Cake', 'Light and fluffy vanilla sponge cake', 140000, 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg', 'cake', true, 8),
  ('Red Velvet Cake', 'Classic red velvet with cream cheese frosting', 160000, 'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg', 'cake', true, 5),
  ('Almond Brownies', 'Rich chocolate brownies topped with almonds', 120000, 'https://images.pexels.com/photos/2067436/pexels-photo-2067436.jpeg', 'brownies', true, 15),
  ('Lemon Tart', 'Tangy lemon curd in a buttery crust', 135000, 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg', 'tart', true, 6);

-- Insert sample toppings
INSERT INTO toppings (name, price, available)
VALUES
  ('Chocolate Ganache', 20000, true),
  ('Fresh Berries', 25000, true),
  ('Whipped Cream', 15000, true),
  ('Caramel Drizzle', 18000, true),
  ('Sliced Almonds', 22000, true),
  ('Chocolate Chips', 16000, true);