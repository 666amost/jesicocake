'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCartIcon,
  TrashIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '@/lib/CartContext';
import { formatCurrency } from '@/lib/utils';
import Footer from '@/components/Footer';
import { gsap } from 'gsap';
import { getFallbackImage } from '@/lib/imageUtils';

export default function CartPage() {
  const { cartItems, cartTotal, updateCartItem, removeCartItem } = useCart();
  
  const pageTitleRef = useRef<HTMLHeadingElement>(null);
  const cartItemsRef = useRef<HTMLUListElement>(null);
  const orderSummaryRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (pageTitleRef.current) {
      gsap.fromTo(pageTitleRef.current, 
        { opacity: 0, y: -20 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }

    if (cartItemsRef.current && cartItemsRef.current.children.length > 0) {
      gsap.fromTo(cartItemsRef.current.children, 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power3.out", stagger: 0.1 }
      );
    }

    if (orderSummaryRef.current) {
      gsap.fromTo(orderSummaryRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.3 }
      );
    }

  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">        
        <main className="flex-grow pt-20">
          <div className="container mx-auto px-4 md:px-6 py-16 text-center">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
              <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
              
              <Link 
                href="/#products" 
                className="inline-flex items-center px-5 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <h1 ref={pageTitleRef} className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>
          
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 p-4 md:p-6">
                  <h2 className="text-lg font-semibold text-gray-800">Cart Items ({cartItems.length})</h2>
                </div>
                
                <ul ref={cartItemsRef} className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center">
                      <div className="md:w-24 md:h-24 relative mb-4 md:mb-0">
                        <Image
                          src={item.product?.image_url || getFallbackImage('cake')}
                          alt={item.product?.name || 'Product'}
                          width={96}
                          height={96}
                          className="rounded object-cover"
                        />
                      </div>
                      
                      <div className="md:ml-4 flex-grow">
                        <h3 className="text-lg font-medium text-gray-800">{item.product?.name}</h3>
                        
                        {item.topping && (
                          <p className="text-sm text-gray-600">
                            Topping: {item.topping.name} (+{formatCurrency(item.topping.price)})
                          </p>
                        )}
                        
                        <div className="mt-2 flex flex-wrap items-center gap-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                              className="px-2 py-1 bg-gray-200 rounded-l text-gray-700"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateCartItem(item.id, parseInt(e.target.value) || 1)}
                              className="w-12 text-center border-gray-300"
                              min="1"
                            />
                            <button
                              onClick={() => updateCartItem(item.id, item.quantity + 1)}
                              className="px-2 py-1 bg-gray-200 rounded-r text-gray-700"
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeCartItem(item.id)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <TrashIcon className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 text-right">
                        <p className="text-lg font-semibold text-gray-800">
                          {formatCurrency((item.product?.price || 0) + (item.topping?.price || 0))} × {item.quantity}
                        </p>
                        <p className="text-orange-600 font-bold">
                          {formatCurrency(((item.product?.price || 0) + (item.topping?.price || 0)) * item.quantity)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4">
                <Link 
                  href="/#products" 
                  className="inline-flex items-center text-orange-600 hover:text-orange-700"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            <div ref={orderSummaryRef} className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-2 border-b border-gray-200 pb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(cartTotal)}</span>
                  </div>
                  
                  {/* Can add additional fees here in the future */}
                </div>
                
                <div className="flex justify-between pt-4 pb-2">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold text-orange-600">{formatCurrency(cartTotal)}</span>
                </div>
                
                <Link 
                  href="/checkout" 
                  className="mt-4 w-full bg-orange-600 text-white py-3 px-4 rounded-md text-center font-medium hover:bg-orange-700 transition-colors block"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}