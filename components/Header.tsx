'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '@/lib/CartContext';
import { gsap } from 'gsap';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

  const headerRef = useRef(null);
  const navContentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const headerElement = headerRef.current;
    const navContentElement = navContentRef.current;

    if (headerElement && navContentElement) {
      if (isScrolled) {
        gsap.to(headerElement, { padding: '8px 0', duration: 0.3 });
        gsap.to(navContentElement, { y: 0, duration: 0.3 });
      } else {
        gsap.to(headerElement, { padding: '16px 0', duration: 0.3 });
        gsap.to(navContentElement, { y: 0, duration: 0.3 });
      }
    }
  }, [isScrolled]);

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 w-full z-40 transition-colors duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md'
          : 'bg-transparent py-4'
      }`}
    >
      <div ref={navContentRef} className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            {/* You can replace with your actual logo */}
            <span className="text-2xl font-playfair font-bold text-orange-600">Jesico</span>
            <span className="text-2xl font-playfair font-light text-gray-800 ml-1">Cake</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link 
              href="/" 
              className="font-montserrat text-sm uppercase tracking-wide text-gray-700 hover:text-orange-600 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/#products" 
              className="font-montserrat text-sm uppercase tracking-wide text-gray-700 hover:text-orange-600 transition-colors"
            >
              Products
            </Link>
            <Link 
              href="/about" 
              className="font-montserrat text-sm uppercase tracking-wide text-gray-700 hover:text-orange-600 transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="font-montserrat text-sm uppercase tracking-wide text-gray-700 hover:text-orange-600 transition-colors"
            >
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Admin Link */}
            <Link 
              href="/admin/login" 
              className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <UserCircleIcon className="w-5 h-5" />
              <span className="font-montserrat text-xs uppercase">Admin</span>
            </Link>
            
            {/* Cart Icon */}
            <Link 
              href="/cart" 
              className="relative p-2"
            >
              <ShoppingBagIcon className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-gray-800'}`} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-montserrat font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-700" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg">
          <nav className="flex flex-col py-4">
            <Link 
              href="/" 
              className="px-4 py-3 font-montserrat text-sm uppercase tracking-wide text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/#products" 
              className="px-4 py-3 font-montserrat text-sm uppercase tracking-wide text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/about" 
              className="px-4 py-3 font-montserrat text-sm uppercase tracking-wide text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="px-4 py-3 font-montserrat text-sm uppercase tracking-wide text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/admin/login"
              className="px-4 py-3 font-montserrat text-sm uppercase tracking-wide text-gray-700 hover:bg-gray-50 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UserCircleIcon className="w-5 h-5 mr-2" />
              Admin Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}