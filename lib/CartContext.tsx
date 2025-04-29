'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import supabase from '@/lib/supabase';
import { Product, Topping, CartItem, Cart } from '@/types';
import { calculateCartTotal } from '@/lib/utils';

type CartContextType = {
  cart: Cart | null;
  cartItems: CartItem[];
  cartTotal: number;
  itemCount: number;
  addToCart: (product: Product, quantity: number, topping: Topping | null) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [itemCount, setItemCount] = useState<number>(0);

  useEffect(() => {
    const initializeCart = async () => {
      try {
        let sessionId = localStorage.getItem('cartSessionId');
        
        if (!sessionId) {
          sessionId = uuidv4();
          localStorage.setItem('cartSessionId', sessionId);
        }

        // First, try to fetch existing cart
        const { data: existingCart, error: fetchError } = await supabase
          .from('carts')
          .select('*')
          .eq('session_id', sessionId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error fetching cart:', fetchError);
          return;
        }

        // If cart exists, use it
        if (existingCart) {
          setCart(existingCart as Cart);
          await fetchCartItems(existingCart.id);
          return;
        }

        // If no cart exists, create a new one
        const { data: newCart, error: insertError } = await supabase
          .from('carts')
          .upsert({ session_id: sessionId })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating cart:', insertError);
          
          // One final attempt to fetch the cart if upsert failed
          const { data: finalAttemptCart, error: finalError } = await supabase
            .from('carts')
            .select('*')
            .eq('session_id', sessionId)
            .single();
            
          if (finalError) {
            console.error('Final attempt to fetch cart failed:', finalError);
            return;
          }
          
          if (finalAttemptCart) {
            setCart(finalAttemptCart as Cart);
            await fetchCartItems(finalAttemptCart.id);
          }
        } else if (newCart) {
          setCart(newCart as Cart);
          await fetchCartItems(newCart.id);
        }
      } catch (error) {
        console.error('Unexpected error during cart initialization:', error);
      }
    };

    initializeCart();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      const total = calculateCartTotal(cartItems);
      setCartTotal(total);
      
      const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setItemCount(count);
    } else {
      setCartTotal(0);
      setItemCount(0);
    }
  }, [cartItems]);

  const fetchCartItems = async (cartId: string) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:product_id(id, name, description, price, image_url, category, available, stock),
          topping:topping_id(id, name, price, available)
        `)
        .eq('cart_id', cartId);
      
      if (error) {
        console.error('Error fetching cart items:', error);
        return;
      }

      setCartItems(data as CartItem[]);
    } catch (error) {
      console.error('Unexpected error fetching cart items:', error);
    }
  };

  const addToCart = async (product: Product, quantity: number, topping: Topping | null) => {
    if (!cart) return;
    
    try {
      // Check if item already exists with same product and topping
      const existingItemIndex = cartItems.findIndex(
        (item) => 
          item.product_id === product.id && 
          item.topping_id === (topping ? topping.id : null)
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        const item = cartItems[existingItemIndex];
        await updateCartItem(item.id, item.quantity + quantity);
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cart.id,
            product_id: product.id,
            topping_id: topping ? topping.id : null,
            quantity: quantity
          });
        
        if (error) {
          console.error('Error adding item to cart:', error);
          return;
        }

        await fetchCartItems(cart.id);
      }
    } catch (error) {
      console.error('Unexpected error adding to cart:', error);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    if (!cart || quantity < 1) return;
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);
      
      if (error) {
        console.error('Error updating cart item:', error);
        return;
      }

      await fetchCartItems(cart.id);
    } catch (error) {
      console.error('Unexpected error updating cart item:', error);
    }
  };

  const removeCartItem = async (itemId: string) => {
    if (!cart) return;
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);
      
      if (error) {
        console.error('Error removing cart item:', error);
        return;
      }

      await fetchCartItems(cart.id);
    } catch (error) {
      console.error('Unexpected error removing cart item:', error);
    }
  };

  const clearCart = async () => {
    if (!cart) return;
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id);
      
      if (error) {
        console.error('Error clearing cart:', error);
        return;
      }

      setCartItems([]);
    } catch (error) {
      console.error('Unexpected error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartItems,
      cartTotal,
      itemCount,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};