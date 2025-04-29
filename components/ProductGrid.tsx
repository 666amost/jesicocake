import { cache } from 'react';
import ProductCard from '@/components/ProductCard';
import supabase from '@/lib/supabase';

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

export default async function ProductGrid() {
  const products = await getProducts();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}