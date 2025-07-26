'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CakeIcon, ShoppingCartIcon, Cog6ToothIcon, SparklesIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function AdminSidebar() {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: <CakeIcon className="h-5 w-5" />,
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: <CakeIcon className="h-5 w-5" />,
    },
    {
      name: 'Toppings',
      href: '/admin/toppings',
      icon: <SparklesIcon className="h-5 w-5" />,
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: <ShoppingCartIcon className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: <Cog6ToothIcon className="h-5 w-5" />,
    },
  ];
  
  return (
    <aside className="w-56 bg-white dark:bg-gray-900 shadow-md hidden md:block text-gray-700 dark:text-gray-200 flex-shrink-0">
      <nav className="py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm ${
                    isActive
                      ? 'bg-orange-50 dark:bg-orange-900 text-orange-600 font-medium border-r-4 border-orange-500'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                  {isActive && <ChevronRightIcon className="ml-auto h-4 w-4" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-800">
        <Link
          href="/"
          className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:text-orange-600"
        >
          <span>View Website</span>
        </Link>
      </div>
    </aside>
  );
}