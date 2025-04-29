import Image from 'next/image';
import Header from '@/components/Header';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { Suspense } from 'react';
import ProductSkeleton from '@/components/ProductSkeleton';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50 has-bottom-nav">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] bg-gradient-to-br from-orange-50 to-neutral-50">
        <div className="container mx-auto px-4 md:px-6 h-full flex flex-col justify-center">
          <div className="max-w-md">
            <span className="inline-block font-montserrat uppercase text-xs tracking-widest text-orange-600 mb-3">Premium Handcrafted</span>
            <h1 className="text-3xl md:text-5xl font-playfair font-medium text-gray-800 mb-4 leading-tight">
              Exquisite Cakes <span className="text-orange-600">Crafted to Perfection</span>
            </h1>
            <p className="font-montserrat text-gray-600 mb-8 leading-relaxed">
              Pre-order our luxury cakes for your special occasions. Each creation is made with premium ingredients and expert artisanship.
            </p>
            <a 
              href="#products" 
              className="premium-button"
            >
              Explore Collection
            </a>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-1/2 h-4/5 hidden md:block">
          <Image 
            src="https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg" 
            alt="Jesico Cake" 
            fill 
            className="object-cover rounded-tl-3xl shadow-premium-md"
            priority
          />
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="inline-block font-montserrat uppercase text-xs tracking-widest text-orange-600 mb-3">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-playfair font-medium text-gray-800">
              The Art of Pre-ordering
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 premium-card hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-xl font-playfair mx-auto mb-6">1</div>
              <h3 className="text-xl font-playfair font-medium mb-4 text-gray-800">Select Your Masterpiece</h3>
              <p className="text-gray-600 font-montserrat">Browse our curated selection of premium cakes and customize with artisanal toppings.</p>
            </div>
            
            <div className="text-center p-8 premium-card hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-xl font-playfair mx-auto mb-6">2</div>
              <h3 className="text-xl font-playfair font-medium mb-4 text-gray-800">Schedule Your Order</h3>
              <p className="text-gray-600 font-montserrat">Choose your preferred delivery date and complete your personalization details.</p>
            </div>
            
            <div className="text-center p-8 premium-card hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-xl font-playfair mx-auto mb-6">3</div>
              <h3 className="text-xl font-playfair font-medium mb-4 text-gray-800">Savor the Experience</h3>
              <p className="text-gray-600 font-montserrat">Complete your payment and receive your freshly crafted cake delivered with care.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section id="products" className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="inline-block font-montserrat uppercase text-xs tracking-widest text-orange-600 mb-3">Our Collection</span>
            <h2 className="text-3xl md:text-4xl font-playfair font-medium text-gray-800">
              Premium Creations
            </h2>
            <p className="text-center text-gray-600 mt-4 max-w-2xl mx-auto font-montserrat">
              Each cake is meticulously crafted using the finest ingredients, creating an experience of taste and elegance.
            </p>
          </div>
          
          <Suspense fallback={<ProductSkeleton />}>
            <ProductGrid />
          </Suspense>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="inline-block font-montserrat uppercase text-xs tracking-widest text-orange-600 mb-3">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-playfair font-medium text-gray-800">
              Client Appreciation
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 premium-card">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic font-montserrat leading-relaxed">"The cake was absolutely divine! It arrived on time and exceeded all our expectations in both taste and presentation. A true masterpiece!"</p>
              <p className="font-playfair font-medium text-gray-800">— Maria S.</p>
            </div>
            
            <div className="p-8 premium-card">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic font-montserrat leading-relaxed">"I ordered a custom cake for my daughter's birthday. The pre-order process was seamless and the artistry of the cake left everyone speechless!"</p>
              <p className="font-playfair font-medium text-gray-800">— John D.</p>
            </div>
            
            <div className="p-8 premium-card">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic font-montserrat leading-relaxed">"The Almond Brownies are exquisite! Perfectly balanced textures with a sophisticated flavor profile. Every bite is pure luxury. Highly recommend!"</p>
              <p className="font-playfair font-medium text-gray-800">— Emily R.</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}