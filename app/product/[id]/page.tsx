import Image from 'next/image';
import { notFound } from 'next/navigation';
import { use } from 'react';
import supabase from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetailContent from '@/components/ProductDetailContent';

export async function generateStaticParams() {
  return [];
}

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data;
}

async function getToppings() {
  const { data, error } = await supabase
    .from('toppings')
    .select('*')
    .eq('available', true)
    .order('name');
  
  if (error) {
    return [];
  }
  
  return data || [];
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }
  
  const toppings = await getToppings();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="relative h-80 md:h-auto md:w-1/2 w-full">
                <Image
                  src={product.image_url || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <ProductDetailContent product={product} toppings={toppings} />
            </div>
          </div>
          {/* Related Products Section - Can be implemented in a future enhancement */}
        </div>
      </main>
      <Footer />
    </div>
  );
}