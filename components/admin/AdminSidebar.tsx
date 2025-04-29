'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tag, 
  ClipboardList, 
  Settings, 
  ChevronRight 
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: 'Toppings',
      href: '/admin/toppings',
      icon: <Tag className="h-5 w-5" />,
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];
  
  return (
    <aside className="w-64 bg-white shadow-md hidden md:block">
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
                      ? 'bg-orange-50 text-orange-600 font-medium border-r-4 border-orange-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="px-4 py-6 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center text-sm text-gray-700 hover:text-orange-600"
        >
          <span>View Website</span>
        </Link>
      </div>
    </aside>
  );
}