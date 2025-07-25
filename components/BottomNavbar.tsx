'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  CakeIcon, 
  MagnifyingGlassIcon, 
  ShoppingCartIcon, 
  UserIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid,
  CakeIcon as CakeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';

const navItems = [
  { 
    href: '/', 
    label: 'Home', 
    icon: HomeIcon, 
    iconSolid: HomeIconSolid,
    color: 'orange'
  },
  { 
    href: '/catalog', 
    label: 'Katalog', 
    icon: CakeIcon, 
    iconSolid: CakeIconSolid,
    color: 'amber'
  },
  { 
    href: '/search', 
    label: 'Cari', 
    icon: MagnifyingGlassIcon, 
    iconSolid: MagnifyingGlassIconSolid,
    color: 'orange'
  },
  { 
    href: '/cart', 
    label: 'Keranjang', 
    icon: ShoppingCartIcon, 
    iconSolid: ShoppingCartIconSolid,
    color: 'red'
  },
  { 
    href: '/account', 
    label: 'Akun', 
    icon: UserIcon, 
    iconSolid: UserIconSolid,
    color: 'blue'
  },
];

export default function BottomNavbar() {
  const pathname = usePathname();
  
  // Hide on admin routes
  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-20 md:hidden" />
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Backdrop blur effect */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-t border-orange-200"></div>
        
        {/* Navigation content */}
        <div className="relative flex justify-around items-center h-20 px-2">
          {navItems.map(({ href, label, icon: Icon, iconSolid: IconSolid, color }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? `bg-orange-500/10 text-orange-600` 
                    : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                <div className={`relative transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  {isActive ? (
                    <IconSolid className="w-6 h-6 text-orange-600" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
                  )}
                </div>
                
                <span className={`text-xs font-medium mt-1 transition-colors duration-200 ${
                  isActive ? 'text-orange-600 font-semibold' : 'text-gray-500'
                }`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
        
        {/* Pre-order floating button */}
        <Link
          href="/checkout"
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <ClockIcon className="w-6 h-6" />
        </Link>
      </nav>
    </>
  );
} 