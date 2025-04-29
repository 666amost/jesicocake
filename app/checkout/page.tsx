'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { formatCurrency, getMinDeliveryDate, getMaxDeliveryDate } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutSummary from '@/components/CheckoutSummary';
import supabase from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { UserCircle2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Topping {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedTopping?: Topping;
}

type Cart = CartItem[];

interface OrderData {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_date: string;
  delivery_time: string;
  notes: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  status: string;
  is_delivery: boolean;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDelivery, setIsDelivery] = useState(true);
  const total = searchParams.get('total') || '0';
  const totalAmount = parseFloat(total);
  const [formData, setFormData] = useState<OrderData>({
    customer_name: '',
    customer_phone: '',
    delivery_address: '',
    delivery_date: '',
    delivery_time: '',
    notes: '',
    total_amount: totalAmount,
    payment_method: 'cash',
    payment_status: 'pending',
    status: 'pending',
    is_delivery: true,
  });
  
  useEffect(() => {
    const total = searchParams.get('total');
    if (total) {
      setFormData(prev => ({
        ...prev,
        total_amount: parseFloat(total) || 0
      }));
    }
  }, [searchParams]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const orderItems = cartItems.map((item: CartItem) => ({
        product_id: item.product.id,
        topping_id: item.selectedTopping?.id || null,
        quantity: item.quantity,
        unit_price: item.product.price + (item.selectedTopping?.price || 0)
      }));

      // Insert order into database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([formData])
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Insert order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Clear cart after successful order
      clearCart();
      
      // Show success message
      toast({
        title: "Order Placed Successfully",
        description: `Your order ID is: ${orderData.id}`,
      });
      
      // Redirect to success page
      router.push(`/checkout/success?id=${orderData.id}`);
    } catch (error: any) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit order",
        variant: "destructive"
      });
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>
          
          <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer_name">Name</Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="customer_phone">Phone Number</Label>
                <Input
                  id="customer_phone"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_delivery"
                  name="is_delivery"
                  checked={isDelivery}
                  onCheckedChange={(checked) => {
                    setIsDelivery(checked);
                    setFormData(prev => ({ ...prev, is_delivery: checked }));
                  }}
                />
                <Label htmlFor="is_delivery">Delivery</Label>
              </div>
              
              {isDelivery && (
                <div>
                  <Label htmlFor="delivery_address">Delivery Address</Label>
                  <Textarea
                    id="delivery_address"
                    name="delivery_address"
                    value={formData.delivery_address}
                    onChange={handleChange}
                    required={isDelivery}
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="delivery_date">Delivery/Pickup Date</Label>
                <Input
                  id="delivery_date"
                  name="delivery_date"
                  type="date"
                  value={formData.delivery_date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="delivery_time">Delivery/Pickup Time</Label>
                <Input
                  id="delivery_time"
                  name="delivery_time"
                  type="time"
                  value={formData.delivery_time}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special requests or notes for your order"
                />
              </div>
              
              <div>
                <Label>Total Amount</Label>
                <p className="text-2xl font-bold text-orange-600">
                  Rp {formData.total_amount.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="pt-4 space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Place Order'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push('/cart')}
              >
                Back to Cart
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}