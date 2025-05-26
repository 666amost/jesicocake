import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Suspense } from 'react';
import {
  SparklesIcon,
  GiftTopIcon,
  ClockIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

import DynamicProductGridWrapper from '@/components/DynamicProductGridWrapper';
import ProductSkeleton from '@/components/ProductSkeleton';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50 has-bottom-nav pb-20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] bg-[url('https://images.unsplash.com/photo-1578985545062-69928b1d9587')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center relative z-10">
          <div className="max-w-3xl text-white">
            <span className="inline-block font-cormorant uppercase text-md tracking-widest text-orange-300 mb-4">Jesico Cake</span>
            <h1 className="text-5xl md:text-7xl font-playfair font-medium mb-6 leading-tight drop-shadow-lg">
              Kue Premium <br />
              <span className="text-orange-300">Untuk Momen Spesialmu</span>
            </h1>
            <p className="font-montserrat text-gray-200 mb-10 text-lg md:text-xl leading-relaxed">
              Temukan kelezatan kue premium kami yang dibuat dengan bahan berkualitas dan sentuhan tangan yang penuh cinta.
            </p>
            <div className="flex gap-4">
              <a href="#products" className="premium-button">
                Lihat Koleksi
              </a>
              <a href="#process" className="border-2 border-white text-white font-montserrat text-sm uppercase tracking-wider py-3 px-6 rounded-md hover:bg-white hover:text-gray-900 transition-colors">
                Pesan Sekarang
            </a>
          </div>
        </div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="inline-block font-cormorant uppercase text-sm tracking-widest text-orange-600 mb-3">Koleksi Kami</span>
            <h2 className="text-3xl md:text-5xl font-playfair font-medium text-gray-800 mb-4">
              Kue Premium Pilihan
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative h-96 overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587"
                alt="Kue Ulang Tahun"
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-playfair text-white mb-2">Kue Ulang Tahun</h3>
                <p className="text-gray-200 font-montserrat mb-4">Kue spesial untuk hari spesialmu</p>
                <a href="#" className="text-orange-300 font-montserrat text-sm uppercase tracking-wider hover:text-orange-400">
                  Lihat Koleksi →
                </a>
              </div>
            </div>
            
            <div className="group relative h-96 overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1612203985729-70726954388c"
                alt="Kue Pernikahan"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-playfair text-white mb-2">Kue Pernikahan</h3>
                <p className="text-gray-200 font-montserrat mb-4">Kue mewah untuk hari pernikahanmu</p>
                <a href="https://wa.me/6281290008991?text=Halo%20Jesica%2C%20saya%20ingin%20memesan%20Kue%20Pernikahan" target="_blank" rel="noopener noreferrer" className="text-orange-300 font-montserrat text-sm uppercase tracking-wider hover:text-orange-400">
                  Pesan Sekarang →
                </a>
              </div>
            </div>
            
            <div className="group relative h-96 overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1571115177098-24ec42ed204d"
                alt="Kue Custom"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-playfair text-white mb-2">Kue Custom</h3>
                <p className="text-gray-200 font-montserrat mb-4">Kue sesuai keinginanmu</p>
                <a href="https://wa.me/6281290008991?text=Halo%20Jesica%2C%20saya%20ingin%20konsultasi%20Kue%20Custom" target="_blank" rel="noopener noreferrer" className="text-orange-300 font-montserrat text-sm uppercase tracking-wider hover:text-orange-400">
                  Konsultasi →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
                <SparklesIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-playfair font-medium mb-2">Bahan Premium</h3>
              <p className="text-gray-700 font-montserrat">Menggunakan bahan berkualitas tinggi untuk rasa dan tekstur terbaik.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
                <GiftTopIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-playfair font-medium mb-2">Pesan Custom</h3>
              <p className="text-gray-700 font-montserrat">Wujudkan kue impianmu dengan layanan custom sesuai selera dan acara.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
                <ClockIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-playfair font-medium mb-2">Pengiriman Aman & Tepat Waktu</h3>
              <p className="text-gray-700 font-montserrat">Kami memastikan kue sampai di tangan Anda dalam kondisi sempurna dan sesuai jadwal.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
                <ShieldCheckIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-playfair font-medium mb-2">Kualitas dan Rasa Terjamin</h3>
              <p className="text-gray-700 font-montserrat">Setiap gigitan adalah pengalaman luar biasa, didukung oleh bahan premium dan resep rahasia.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="inline-block font-cormorant uppercase text-sm tracking-widest text-orange-600 mb-3">Koleksi Kami</span>
            <h2 className="text-3xl md:text-5xl font-playfair font-medium text-gray-800 mb-4">
              Kue Premium Pilihan
            </h2>
            <p className="text-center text-gray-600 mt-4 max-w-2xl mx-auto font-montserrat">
              Setiap kue dibuat dengan cinta dan bahan berkualitas untuk momen spesialmu.
            </p>
          </div>
          
          <Suspense fallback={<ProductSkeleton />}>
            <DynamicProductGridWrapper />
          </Suspense>
        </div>
      </section>
      
      {/* Testimonials with Image */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[600px] rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1562440499-64c9a111f713"
                alt="Happy Customers"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="space-y-8">
              <div>
                <span className="inline-block font-cormorant uppercase text-sm tracking-widest text-orange-600 mb-3">Testimoni</span>
                <h2 className="text-3xl md:text-5xl font-playfair font-medium text-gray-800 mb-4">
                  Kata Mereka
            </h2>
          </div>
          
              <div className="space-y-8">
                <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
                  <p className="text-gray-600 mb-4 italic font-montserrat leading-relaxed">"Kuenya enak banget! Tampilannya juga cantik, bikin acara ulang tahun anak saya jadi lebih spesial."</p>
                  <p className="font-playfair font-medium text-gray-800">— Sarah M.</p>
            </div>
            
                <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
                  <p className="text-gray-600 mb-4 italic font-montserrat leading-relaxed">"Kue pernikahan kami dibuat dengan sangat cantik dan lezat. Semua tamu suka!"</p>
                  <p className="font-playfair font-medium text-gray-800">— Michael R.</p>
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}