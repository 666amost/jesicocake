import Image from 'next/image';
import { notFound } from 'next/navigation';
import supabase from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductToppings from '@/components/ProductToppings';
import AddToCartForm from '@/components/AddToCartForm';
import { formatCurrency } from '@/lib/utils';

interface ProductPageProps {
  params: {
    id: string;
  };
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

export default async function ProductPage({ params }: ProductPageProps) {
  const id = params.id;
  const product = await getProduct(id);
  
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
            <div className="md:flex">
              <div className="md:flex-shrink-0 relative h-64 md:h-auto md:w-1/2">
                <Image
                  src={product.image_url || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              <div className="p-6 md:p-8 md:w-1/2">
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
            </div>
          </div>
          
          {/* Related Products Section - Can be implemented in a future enhancement */}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}