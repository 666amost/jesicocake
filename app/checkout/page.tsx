'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { formatCurrency, getMinDeliveryDate, getMaxDeliveryDate, calculateCartTotal } from '@/lib/utils';
import Footer from '@/components/Footer';
import CheckoutSummary from '@/components/CheckoutSummary';
import supabase from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { UserCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import AuthForm from '@/components/AuthForm';
import { addDays, format } from 'date-fns';

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
  customer_address: string;
  delivery_date: string;
  notes: string;
  total_amount: number;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isDelivery, setIsDelivery] = useState(true);
  const totalAmount = calculateCartTotal(cartItems);
  const [formData, setFormData] = useState<OrderData>({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    delivery_date: '',
    notes: '',
    total_amount: totalAmount,
  });
  const [user, setUser] = useState<any>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Cek user login dan ambil profile
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setFormData(prev => ({
          ...prev,
          customer_name: profile?.name || '',
          customer_phone: profile?.phone || '',
          customer_address: profile?.address || '',
        }));
      }
      setProfileLoaded(true);
    };
    fetchUser();
  }, []);

  // Jika belum login, tampilkan AuthForm
  if (!user && profileLoaded) {
    return (
      <div className="min-h-screen flex flex-col bg-orange-50">        
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4">Login or Register to Checkout</h1>
            <AuthForm onSuccess={() => window.location.reload()} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const minDate = getMinDeliveryDate();
  const maxDate = getMaxDeliveryDate();
  
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
      const orderItems = cartItems.map((item) => ({
        product_id: item.product?.id,
        topping_id: item.topping?.id || null,
        quantity: item.quantity,
        unit_price: item.product?.price || 0,
        topping_price: item.topping?.price || 0,
      }));

      // Siapkan orderItems untuk invoice/WhatsApp
      const invoiceOrderItems = cartItems.map((item) => ({
        product_id: item.product?.id,
        topping_id: item.topping?.id || null,
        quantity: item.quantity,
        unit_price: item.product?.price || 0,
        topping_price: item.topping?.price || 0,
        name: item.product?.name || '',
        price: (item.product?.price || 0) + (item.topping?.price || 0),
        toppings: item.topping?.name || undefined,
      }));

      // Hanya kirim field yang sesuai database
      const orderPayload = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_address: formData.customer_address,
        delivery_date: formData.delivery_date,
        notes: formData.notes,
        total_amount: formData.total_amount,
      };

      // Insert order ke database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{ ...orderPayload, user_id: user.id }])
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Insert order items ke Supabase pakai orderItems
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems.map(item => ({ ...item, order_id: orderData.id })));
      
      if (itemsError) throw itemsError;
      
      // Setelah insert order_items
      const orderDetails = cartItems.map((item) => ({
        order_id: orderData.id,
        product_name: item.product?.name || '',
        topping_name: item.topping?.name || null,
        quantity: item.quantity,
      }));
      const { error: detailsError } = await supabase
        .from('order_details')
        .insert(orderDetails);
      if (detailsError) throw detailsError;
      
      // Simpan ke localStorage untuk invoice/WhatsApp
      localStorage.setItem('lastOrder', JSON.stringify({
        ...orderData,
        items: invoiceOrderItems
      }));
      
      // Clear cart after successful order
      clearCart();
      
      // Show success message
      toast({
        title: "Order Placed Successfully",
        description: `Your order ID is: ${orderData.id}`,
      });
      
      // Redirect to success page
      router.push(`/checkout/complete?id=${orderData.id}`);
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
              
              <div>
                <Label htmlFor="customer_address">Alamat</Label>
                <Textarea
                  id="customer_address"
                  name="customer_address"
                  value={formData.customer_address}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="delivery_date">Tanggal Pengambilan / Pengiriman (Pre-Order 2-7 Hari)</Label>
                <Input
                  id="delivery_date"
                  name="delivery_date"
                  type="date"
                  value={formData.delivery_date}
                  onChange={handleChange}
                  required
                  min={minDate}
                  max={maxDate}
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