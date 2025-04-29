'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // If no user is logged in, show login options
          setIsLoading(false);
          return;
        }
        
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        // Fetch user orders
        const { data: userOrders } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        setUserData({
          id: user.id,
          email: user.email,
          name: profile?.name || 'Guest User',
          phone: profile?.phone || '-',
          address: profile?.address || '-'
        });
        
        setOrders(userOrders || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };
  
  const handleLogin = () => {
    router.push('/checkout?login=true');
  };
  
  const handleRegister = () => {
    router.push('/checkout?register=true');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading account information...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20">
          <div className="container max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">My Account</h1>
            
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Please Login or Register</h2>
              <p className="text-gray-600 mb-6">You need to login or create an account to view this page.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleLogin}
                  className="bg-orange-600 text-white hover:bg-orange-700"
                >
                  Login
                </Button>
                <Button
                  onClick={handleRegister}
                  className="bg-gray-600 text-white hover:bg-gray-700"
                >
                  Register
                </Button>
              </div>
            </div>
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
        <div className="container max-w-4xl mx-auto py-10 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Account</h1>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Name</p>
                    <p className="text-gray-700">{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Email</p>
                    <p className="text-gray-700">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Phone</p>
                    <p className="text-gray-700">{userData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Address</p>
                    <p className="text-gray-700">{userData.address}</p>
                  </div>
                  <Button variant="outline" className="mt-2">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View your past orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length > 0 ? (
                    <div className="divide-y">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="py-3">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                order.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : order.status === 'processing'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700">No orders yet.</p>
                  )}
                  
                  {orders.length > 0 && (
                    <Button 
                      onClick={() => router.push('/account/orders')}
                      variant="outline" 
                      className="mt-2 w-full"
                    >
                      View All Orders
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Delivery Addresses</CardTitle>
                <CardDescription>Manage your delivery addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.address ? (
                    <div className="p-3 border rounded-md">
                      <p className="font-medium">Default Address</p>
                      <p className="text-gray-700">{userData.address}</p>
                    </div>
                  ) : (
                    <p className="text-gray-700">No saved addresses.</p>
                  )}
                  <Button variant="outline" className="mt-2">Add New Address</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 