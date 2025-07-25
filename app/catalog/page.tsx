import { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import ProductCard from '@/components/ProductCard';
import { CakeIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getProducts() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

function ProductSkeleton() {
  return (
    <div className="bg-white/90 rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

function ProductsGrid({ products }: { products: any[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <CakeIcon className="w-24 h-24 text-orange-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Produk</h3>
        <p className="text-gray-500 mb-6">Kami sedang menyiapkan koleksi kue premium terbaik untuk Anda</p>
        <Link 
          href="/contact" 
          className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          Konsultasi Custom Cake
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function CatalogPage() {
  const products = await getProducts();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pb-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-4 py-12 md:py-16 text-center">
          <CakeIcon className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-serif">
            Katalog Premium
          </h1>
          <p className="text-lg md:text-xl text-orange-100 mb-6 max-w-2xl mx-auto">
            Jelajahi koleksi kue premium JESICO yang dibuat khusus untuk momen spesial Anda
          </p>
          
          {/* Pre-order Info */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center">
              <ClockIcon className="w-6 h-6 mr-3" />
              <div className="text-left">
                <p className="font-bold">Sistem Pre-Order</p>
                <p className="text-sm opacity-90">Pesan 2-3 hari sebelum acara</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-200 px-4 py-3">
        <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Kategori:</span>
          <div className="flex space-x-2">
            {['Semua', 'Wedding', 'Birthday', 'Custom', 'Anniversary'].map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === 'Semua' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Content */}
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        }>
          <ProductsGrid products={products} />
        </Suspense>
      </div>

      {/* CTA Section */}
      <div className="px-4 pb-8">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Tidak Menemukan yang Anda Cari?</h2>
          <p className="text-orange-100 mb-6">
            Tim expert kami siap membantu membuat kue custom sesuai impian Anda
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center bg-white text-orange-600 px-6 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            Konsultasi Custom Design
          </Link>
        </div>
      </div>
    </div>
  );
} 