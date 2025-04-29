export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string | null
  available: boolean
  stock: number
  created_at: string
  updated_at: string
}

export interface Topping {
  id: string
  name: string
  price: number
  available: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  topping_id: string | null
  quantity: number
  product?: Product
  topping?: Topping | null
}

export interface Cart {
  id: string
  session_id: string
  items: CartItem[]
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  delivery_date: string
  total_amount: number
  status: string
  payment_status: string
  notes: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  topping_id: string | null
  quantity: number
  unit_price: number
  topping_price: number
  product?: Product | null
  topping?: Topping | null
}