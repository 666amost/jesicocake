'use client';

import { useState, useEffect } from 'react';
import { Product, Topping } from '@/types';
import { useCart } from '@/lib/CartContext';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/lib/supabase';
import AuthForm from '@/components/AuthForm';

interface AddToCartFormProps {
  product: Product;
  toppings: Topping[];
  maxQuantity: number;
}

export default function AddToCartForm({ product, toppings, maxQuantity }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedToppingId, setSelectedToppingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  // Cek login user (perbaikan: gunakan useEffect)
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);
  
  const selectedTopping = selectedToppingId 
    ? toppings.find(t => t.id === selectedToppingId) || null 
    : null;
  
  const totalPrice = (product.price + (selectedTopping?.price || 0)) * quantity;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    if (maxQuantity < 1) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive"
      });
      return;
    }
    
    if (quantity < 1 || quantity > maxQuantity) {
      toast({
        title: "Invalid Quantity",
        description: `Please select a quantity between 1 and ${maxQuantity}.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addToCart(product, quantity, selectedTopping);
      
      toast({
        title: "Added to Cart",
        description: `${quantity} ${product.name} added to your cart!`,
      });
      
      // Reset form
      setQuantity(1);
      setSelectedToppingId(null);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="topping" className="block text-sm font-medium text-gray-700 mb-1">
            Select Topping (Optional)
          </label>
          <select
            id="topping"
            value={selectedToppingId || ''}
            onChange={(e) => setSelectedToppingId(e.target.value || null)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
          >
            <option value="">No Topping</option>
            {toppings.map((topping) => (
              <option key={topping.id} value={topping.id}>
                {topping.name} (+{formatCurrency(topping.price)})
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              id="quantity"
              min="1"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-20 text-center border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
            />
            <button
              type="button"
              onClick={() => setQuantity(q => Math.min(maxQuantity, q + 1))}
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={quantity >= maxQuantity}
            >
              +
            </button>
            <span className="ml-3 text-sm text-gray-500">
              {maxQuantity} available
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-orange-600">
            Total: {formatCurrency(totalPrice)}
          </span>
          
          <button
            type="submit"
            disabled={isSubmitting || maxQuantity < 1}
            className={`px-5 py-2 rounded-md ${
              maxQuantity < 1 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-orange-600 hover:bg-orange-700'
            } text-white font-medium transition-colors`}
          >
            {isSubmitting ? 'Processing...' : maxQuantity < 1 ? 'Stok Habis' : 'Pre-Order Sekarang'}
          </button>
        </div>
      </form>
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md mx-auto">
            <AuthForm onSuccess={() => { setShowAuth(false); window.location.reload(); }} />
            <button className="mt-2 w-full text-center text-orange-600 font-bold" onClick={() => setShowAuth(false)}>Batal</button>
          </div>
        </div>
      )}
    </>
  );
}