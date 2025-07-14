import { createClient } from '@supabase/supabase-js';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';

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

export default async function CatalogPage() {
  const products = await getProducts();
  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center px-3 pt-24 pb-20 max-w-3xl mx-auto">
        <div className="backdrop-blur-sm bg-white/70 rounded-xl p-4">
          <h1 className="text-2xl font-bold text-orange-700 mb-4 text-center">Katalog Kue Premium</h1>
          {products.length === 0 ? (
            <div className="text-center text-gray-400 py-20">Belum ada produk.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 