'use client';

import Link from 'next/link';
import { Home, ShoppingBag, Grid, Search, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BottomNavbar() {
  const pathname = usePathname();
  
  // Don't show bottom navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2">
        <Link href="/" className="flex flex-col items-center p-2">
          <Home className={`w-6 h-6 ${pathname === '/' ? 'text-orange-600' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${pathname === '/' ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>Home</span>
        </Link>
        
        <Link href="/#products" className="flex flex-col items-center p-2">
          <Grid className={`w-6 h-6 ${pathname === '/#products' ? 'text-orange-600' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${pathname === '/#products' ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>Catalog</span>
        </Link>
        
        <Link href="/search" className="flex flex-col items-center p-2">
          <Search className={`w-6 h-6 ${pathname === '/search' ? 'text-orange-600' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${pathname === '/search' ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>Search</span>
        </Link>
        
        <Link href="/cart" className="flex flex-col items-center p-2">
          <ShoppingBag className={`w-6 h-6 ${pathname === '/cart' ? 'text-orange-600' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${pathname === '/cart' ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>Cart</span>
        </Link>
        
        <Link href="/account" className="flex flex-col items-center p-2">
          <User className={`w-6 h-6 ${pathname === '/account' ? 'text-orange-600' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${pathname === '/account' ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>Account</span>
        </Link>
      </div>
    </div>
  );
} 