'use client';

import dynamic from 'next/dynamic';
import ProductSkeleton from '@/components/ProductSkeleton'; // Pastikan path import benar

// Import ProductGrid secara dinamis
const DynamicProductGrid = dynamic(() => import('@/components/ProductGrid'), {
  loading: () => <ProductSkeleton />, // Tampilkan skeleton saat loading
  ssr: false, // Sekarang ini ada di Client Component, jadi ssr: false aman
});

export default function DynamicProductGridWrapper() {
  return (
    <DynamicProductGrid />
  );
} 