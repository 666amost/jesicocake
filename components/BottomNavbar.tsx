'use client';

import Link from 'next/link';
import {
  HomeIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

export default function BottomNavbar() {
  const pathname = usePathname();
  
  // Don't show bottom navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        <Link href="/" className="flex flex-col items-center p-2 text-center">
          <HomeIcon className={`w-6 h-6 ${pathname === '/' ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`} />
          <span className={`text-xs mt-1 ${pathname === '/' ? 'text-orange-600 font-semibold' : 'text-gray-500 group-hover:text-orange-600'}`}>Home</span>
        </Link>
        
        <Link href="/#products" className="flex flex-col items-center p-2 text-center">
          <Squares2X2Icon className={`w-6 h-6 ${pathname === '/#products' ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`} />
          <span className={`text-xs mt-1 ${pathname === '/#products' ? 'text-orange-600 font-semibold' : 'text-gray-500 group-hover:text-orange-600'}`}>Catalog</span>
        </Link>
        
        <Link href="/search" className="flex flex-col items-center p-2 text-center">
          <MagnifyingGlassIcon className={`w-6 h-6 ${pathname === '/search' ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`} />
          <span className={`text-xs mt-1 ${pathname === '/search' ? 'text-orange-600 font-semibold' : 'text-gray-500 group-hover:text-orange-600'}`}>Search</span>
        </Link>
        
        <Link href="/cart" className="flex flex-col items-center p-2 text-center">
          <ShoppingBagIcon className={`w-6 h-6 ${pathname === '/cart' ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`} />
          <span className={`text-xs mt-1 ${pathname === '/cart' ? 'text-orange-600 font-semibold' : 'text-gray-500 group-hover:text-orange-600'}`}>Cart</span>
        </Link>
        
        <Link href="/account" className="flex flex-col items-center p-2 text-center">
          <UserIcon className={`w-6 h-6 ${pathname === '/account' ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`} />
          <span className={`text-xs mt-1 ${pathname === '/account' ? 'text-orange-600 font-semibold' : 'text-gray-500 group-hover:text-orange-600'}`}>Account</span>
        </Link>
      </div>
    </div>
  );
} 