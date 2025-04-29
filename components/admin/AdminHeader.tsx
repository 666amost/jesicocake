'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, LogOut, User } from 'lucide-react';
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
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
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
                  className="flex items-center text-gray-700 hover:text-orange-600 transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">{user.email}</span>
                  {showUserMenu ? <X className="ml-1 h-4 w-4" /> : <Menu className="ml-1 h-4 w-4" />}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
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