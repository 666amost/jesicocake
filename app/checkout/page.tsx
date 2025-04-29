'use client';

import { useState, useEffect, useRef } from 'react';
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

// Define interface for order data
interface OrderData {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_date: string;
  total_amount: number;
  notes: string | null;
  user_id?: string; // Optional property for user_id
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  
  const isLogin = searchParams.get('login') === 'true';
  const isRegister = searchParams.get('register') === 'true';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryDate: getMinDeliveryDate(),
    notes: ''
  });
  const [checkoutType, setCheckoutType] = useState<'guest' | 'register' | 'login'>(
    isLogin ? 'login' : isRegister ? 'register' : 'guest'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    if (isRedirecting) return;
    const justOrdered = typeof window !== 'undefined' && sessionStorage.getItem('justOrdered') === 'true';
    if (cartItems.length === 0 && !isLogin && !isRegister && !justOrdered) {
      router.push('/cart');
    }
  }, [cartItems.length, router, isLogin, isRegister, isRedirecting]);
  
  const minDate = getMinDeliveryDate();
  const maxDate = getMaxDeliveryDate();
  
  // Effect untuk melakukan redirect setelah pesanan berhasil
  useEffect(() => {
    if (orderSuccess && successOrderId) {
      setIsRedirecting(true);
      // Jangan hapus flag di sini, hanya set sebelum clearCart
      const redirectTimer = setTimeout(() => {
        router.push(`/checkout/success?id=${successOrderId}`);
      }, 500);
      return () => clearTimeout(redirectTimer);
    }
  }, [orderSuccess, successOrderId, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For authentication-only actions, don't require cart items
    const isAuthOnly = (checkoutType === 'login' || checkoutType === 'register') && cartItems.length === 0;
    
    if (cartItems.length === 0 && !isAuthOnly) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items before checking out.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If user selected to register, create account first
      if (checkoutType === 'register' && email && password) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: formData.name,
              phone: formData.phone,
              address: formData.address
            }
          }
        });
        
        if (authError) {
          throw new Error(authError.message || 'Failed to create account');
        }
        
        toast({
          title: "Account Created",
          description: "Your account has been created successfully. Please check your email for verification."
        });
        
        // If auth-only (no cart items), redirect to account page
        if (isAuthOnly) {
          router.push('/account');
          return;
        }
      }
      
      // If user selected to login, authenticate them
      if (checkoutType === 'login' && email && password) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (authError) {
          throw new Error(authError.message || 'Failed to login');
        }
        
        // Get user profile data to update form
        const { data: userData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user?.id)
          .single();
          
        if (userData) {
          setFormData(prev => ({
            ...prev,
            name: userData.name || prev.name,
            phone: userData.phone || prev.phone,
            address: userData.address || prev.address
          }));
        }
        
        toast({
          title: "Login Successful",
          description: "You have been successfully logged in."
        });
        
        // If auth-only (no cart items), redirect to account page
        if (isAuthOnly) {
          router.push('/account');
          return;
        }
      }
      
      // Skip order creation if this is auth-only
      if (isAuthOnly) {
        setIsSubmitting(false);
        return;
      }
      
      // Create order
      const orderData: OrderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        delivery_date: formData.deliveryDate,
        total_amount: cartTotal,
        notes: formData.notes || null,
      };
      
      // Hanya tambahkan user_id jika pengguna login/register
      if (checkoutType === 'login' || checkoutType === 'register') {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.id) {
          // Periksa apakah kolom user_id ada di tabel orders
          const { data: columnsData, error: columnsError } = await supabase
            .rpc('check_column_exists', { table_name: 'orders', column_name: 'user_id' });
          
          if (!columnsError && columnsData) {
            // Jika kolom ada, tambahkan ke orderData
            orderData.user_id = userData.user.id;
          }
        }
      }
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();
      
      if (orderError) {
        if (orderError.message.includes('row-level security policy')) {
          console.error('Row-level security error:', orderError.message);
          toast({
            title: "Database Permission Error",
            description: "The system cannot create orders due to security settings. Please contact the administrator to enable RLS policy for orders table.",
            variant: "destructive"
          });
        } else {
          throw new Error(orderError.message || 'Failed to create order');
        }
        return;
      }
      
      if (!order) {
        throw new Error('Failed to create order - no order data returned');
      }
      
      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        topping_id: item.topping_id,
        quantity: item.quantity,
        unit_price: item.product?.price || 0,
        topping_price: item.topping?.price || 0
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        throw new Error(itemsError.message || 'Failed to create order items');
      }
      
      // Save order data to localStorage for the WhatsApp notification
      const orderWithItems = {
        ...order,
        items: cartItems.map(item => ({
          name: item.product?.name,
          price: item.product?.price,
          quantity: item.quantity,
          toppings: item.topping?.name
        }))
      };
      localStorage.setItem('lastOrder', JSON.stringify(orderWithItems));
      // Set flag justOrdered SEBELUM clearCart
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('justOrdered', 'true');
      }
      // Clear cart
      await clearCart();
      
      // Set success state dan order ID untuk triggering redirect
      setSuccessOrderId(order.id);
      setOrderSuccess(true);
      
      // Tidak langsung redirect di sini, biarkan useEffect yang menangani
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  
  // Show login/register form even with empty cart if those parameters are set
  const showAuthForm = isLogin || isRegister || cartItems.length > 0;
  
  // Jika sedang redirect, tampilkan spinner saja
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Mengalihkan ke halaman pembayaran...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!showAuthForm) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Redirecting to your cart...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            {cartItems.length === 0 ? (isLogin ? 'Login' : 'Register') : 'Checkout'}
          </h1>
          
          {cartItems.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Checkout Options</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => setCheckoutType('guest')}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    checkoutType === 'guest' 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } flex items-center justify-center gap-2`}
                >
                  <UserCircle2 className="h-5 w-5" />
                  <span>Guest Checkout</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setCheckoutType('register')}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    checkoutType === 'register' 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } flex items-center justify-center gap-2`}
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Register & Checkout</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setCheckoutType('login')}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    checkoutType === 'login' 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } flex items-center justify-center gap-2`}
                >
                  <UserCircle2 className="h-5 w-5" />
                  <span>Login & Checkout</span>
                </button>
              </div>
            </div>
          )}
          
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 p-4 md:p-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {cartItems.length === 0 ? 
                      (isLogin ? 'Login Information' : 'Registration Information') : 
                      'Customer Information'}
                  </h2>
                </div>
                
                <div className="p-4 md:p-6 space-y-4">
                  {(checkoutType === 'register' || checkoutType === 'login') && (
                    <div className="space-y-4 pb-4 border-b border-dashed border-gray-200">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
                          placeholder="your@email.com"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  )}
                
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
                      placeholder="Enter your full address"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Date (2-7 days from today)
                    </label>
                    <input
                      type="date"
                      id="deliveryDate"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      min={minDate}
                      max={maxDate}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Please select a date between {minDate} and {maxDate}
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
                      placeholder="Special instructions for your order"
                    ></textarea>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 p-4 md:p-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-md text-center font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Complete Order'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <CheckoutSummary cartItems={cartItems} cartTotal={cartTotal} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}