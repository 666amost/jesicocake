'use client';

import { cache } from 'react';
import ProductCard from '@/components/ProductCard';
import supabase from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Product } from '@/types'; // Import tipe Produk jika belum ada

// Cache the fetch function to avoid redundant requests
const getProducts = cache(async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('available', true)
    .order('name');
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data || [];
});

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching products in client component:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Efek ini hanya berjalan sekali saat komponen di-mount

  if (loading) {
    // Ini akan ditimpa oleh skeleton dari DynamicProductGridWrapper, tapi baik untuk berjaga-jaga
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading products: {error}</div>;
  }
  
  if (!products || products.length === 0) {
    return <div className="text-center py-10">No products found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}