'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import AddToCartForm from '@/components/AddToCartForm'; // Pastikan path import benar
import ProductToppings from '@/components/ProductToppings'; // Pastikan path import benar
import { formatCurrency } from '@/lib/utils'; // Pastikan path import benar
import { Product, Topping } from '@/types'; // Import tipe data

interface ProductDetailContentProps {
  product: Product;
  toppings: Topping[];
}

export default function ProductDetailContent({ product, toppings }: ProductDetailContentProps) {
  const contentRef = useRef(null); // Ref untuk kontainer utama konten

  useEffect(() => {
    // Animasi fade-in dan slide-up untuk konten detail produk
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.2 } // Animasi dengan stagger
      );
    }
  }, [product]); // Jalankan animasi saat produk berubah (pada halaman yang sama jika params berubah)

  return (
    <div ref={contentRef} className="p-6 md:p-8 md:w-1/2 w-full"> {/* Tambahkan ref */}
      <div className="uppercase tracking-wide text-sm text-orange-500 font-semibold">
        {product.category}
      </div>
      <h1 className="mt-2 text-3xl leading-tight font-bold text-gray-900">
        {product.name}
      </h1>
      <p className="mt-4 text-lg text-gray-600">{product.description}</p>
      <p className="mt-4 text-2xl font-bold text-orange-600">
        {formatCurrency(product.price)}
      </p>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Available Toppings</h3>
        <ProductToppings toppings={toppings} />
      </div>
      <div className="mt-8">
        <AddToCartForm 
          product={product} 
          toppings={toppings} 
          maxQuantity={product.stock} 
        />
      </div>
    </div>
  );
} 