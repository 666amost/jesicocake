'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon, UserCircleIcon, CakeIcon, ShoppingCartIcon, Cog6ToothIcon, SparklesIcon } from '@heroicons/react/24/outline';
import supabase from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AdminHeaderProps {
  user: any;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    
    router.push('/admin/login');
  };
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="text-xl font-bold text-orange-600">
              Jesico Cake Admin
            </Link>
          </div>
          
          <div className="flex items-center">
            {user && (
              <div className="relative">
                <button
                  className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-600 transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <UserCircleIcon className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">{user.email}</span>
                  {showUserMenu ? <XMarkIcon className="ml-1 h-4 w-4" /> : <Bars3Icon className="ml-1 h-4 w-4" />}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-800">
                    {/* Admin navigation menu */}
                    <nav className="border-b border-gray-100 dark:border-gray-800 mb-1 pb-1">
                      <Link href="/admin/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900">
                        <CakeIcon className="mr-2 h-4 w-4" /> Dashboard
                      </Link>
                      <Link href="/admin/products" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900">
                        <CakeIcon className="mr-2 h-4 w-4" /> Products
                      </Link>
                      <Link href="/admin/toppings" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900">
                        <SparklesIcon className="mr-2 h-4 w-4" /> Toppings
                      </Link>
                      <Link href="/admin/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900">
                        <ShoppingCartIcon className="mr-2 h-4 w-4" /> Orders
                      </Link>
                      <Link href="/admin/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900">
                        <Cog6ToothIcon className="mr-2 h-4 w-4" /> Settings
                      </Link>
                    </nav>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900"
                    >
                      <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}