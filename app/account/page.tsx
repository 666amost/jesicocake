'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import EditProfileModal from '@/components/EditProfileModal';



export default function AccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [editOpen, setEditOpen] = useState(false);

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
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading account information...</p>
          </div>
        </main>
      </div>
    );
  }
  
  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col bg-orange-50">        
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4">Login or Register to view your account</h1>
            <AuthForm onSuccess={() => window.location.reload()} />
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-orange-50">      
      <main className="flex-grow pt-4 pb-16 px-2">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 rounded-full p-3">
                <span className="text-3xl font-bold text-orange-500">{userData.name[0]}</span>
              </div>
              <div>
                <div className="font-bold text-lg text-orange-700">{userData.name}</div>
                <div className="text-sm text-gray-500">{userData.email}</div>
              </div>
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Phone</span>
              <span className="block font-medium">{userData.phone}</span>
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Address</span>
              <span className="block font-medium">{userData.address}</span>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setEditOpen(true)}>Edit Profile</Button>
            <Button variant="outline" className="w-full mt-2" onClick={handleLogout}>Logout</Button>
          </div>
          <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} profile={{ id: userData.id, name: userData.name, phone: userData.phone, address: userData.address }} onSuccess={() => window.location.reload()} />
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="font-bold text-lg mb-2 text-orange-700">Order History</div>
            {orders.length > 0 ? (
              <div className="divide-y">
                {orders.map((order) => (
                  <div key={order.id} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">Order #{order.id.substring(0, 8)}</div>
                      <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">{formatCurrency(order.total_amount)}</div>
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
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400">No orders yet.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 