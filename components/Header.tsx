'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  CakeIcon,
  ClockIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '@/lib/CartContext';

const navigation = [
  { name: 'Beranda', href: '/' },
  { name: 'Katalog', href: '/catalog' },
  { name: 'Pre-Order', href: '/checkout' },
  { name: 'Tentang', href: '/about' },
  { name: 'Kontak', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const [showCartWarning, setShowCartWarning] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-200' 
        : 'bg-gradient-to-r from-orange-50 to-amber-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex items-center">
              <CakeIcon className="w-8 h-8 text-orange-600" />
              <div className="ml-2">
                <h1 className="text-2xl font-bold text-orange-800 font-serif">JESICO</h1>
                <p className="text-xs text-orange-600 tracking-wider">PREMIUM CAKE</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-orange-50 rounded-lg"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Contact info - Desktop only */}
            <div className="hidden xl:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-1" />
                <span>+62812-9000-8991</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span>Pre-Order 2-7 Hari</span>
              </div>
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors">
              <ShoppingCartIcon className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link href="/account" className="p-2 text-gray-700 hover:text-orange-600 transition-colors">
              <UserCircleIcon className="w-6 h-6" />
            </Link>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-orange-600"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="flex flex-col space-y-1 py-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-orange-200 mt-4">
                <div className="px-3 py-2 text-sm text-gray-600">
                  <div className="flex items-center mb-2">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    <span>+62812-9000-8991</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>Pre-Order 2-7 Hari Sebelumnya</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}