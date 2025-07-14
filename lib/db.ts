import supabase from './supabase';
import { Database } from '@/types/supabase';

// Type definitions for better type safety
export type Tables = Database['public']['Tables'];
export type Products = Tables['products']['Row'];
export type Toppings = Tables['toppings']['Row'];
export type Orders = Tables['orders']['Row'];
export type OrderItems = Tables['order_items']['Row'];
export type Carts = Tables['carts']['Row'];
export type CartItems = Tables['cart_items']['Row'];

// Products
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// Toppings
export async function getToppings() {
  const { data, error } = await supabase
    .from('toppings')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

// Orders
export async function createOrder(order: Omit<Tables['orders']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items:order_items (
        *,
        product:products (*),
        topping:toppings (*)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items:order_items (
        *,
        product:products (*),
        topping:toppings (*)
      )
    `)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Cart functions
export async function getOrCreateCart(sessionId: string) {
  // Try to find an existing cart
  const { data: existingCart } = await supabase
    .from('carts')
    .select('*')
    .eq('session_id', sessionId)
    .maybeSingle();
  
  if (existingCart) {
    return existingCart;
  }
  
  // Create a new cart if none exists
  const { data: newCart, error } = await supabase
    .from('carts')
    .insert({ session_id: sessionId })
    .select()
    .single();
  
  if (error) throw error;
  return newCart;
}

export async function getCartWithItems(cartId: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products (*),
      topping:toppings (*)
    `)
    .eq('cart_id', cartId);
  
  if (error) throw error;
  return data;
}

export async function addItemToCart(
  cartId: string, 
  productId: string, 
  quantity: number, 
  toppingId?: string
) {
  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      cart_id: cartId,
      product_id: productId,
      topping_id: toppingId || null,
      quantity
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('id', itemId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function removeCartItem(itemId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);
  
  if (error) throw error;
  return true;
}

export async function clearCart(cartId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId);
  
  if (error) throw error;
  return true;
} 