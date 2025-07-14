'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ShoppingBagIcon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';

const navs = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/catalog', label: 'Catalog', icon: ShoppingBagIcon },
  { href: '/search', label: 'Search', icon: MagnifyingGlassIcon },
  { href: '/cart', label: 'Cart', icon: ShoppingCartIcon },
  { href: '/account', label: 'Account', icon: UserIcon },
];

export default function BottomNavbar() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t flex justify-around items-center h-16 md:hidden">
      {navs.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center flex-1 py-1 ${active ? 'text-orange-600 font-bold' : 'text-gray-400'}`}
          >
            <Icon className={`w-7 h-7 mb-1 ${active ? 'text-orange-500' : ''}`} />
            <span className="text-xs font-semibold tracking-wide">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
} 