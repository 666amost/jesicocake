import Link from 'next/link';
import { 
  ShoppingBagIcon, 
  StarIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  SparklesIcon,
  ClockIcon,
  CakeIcon,
  HeartIcon 
} from '@heroicons/react/24/outline';
import OptimizedImage from '@/components/OptimizedImage';

export default function HomePage() {
  return (
    <div className="pb-20 min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Section - Premium Cake Focus */}
      <section className="relative w-full h-[450px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <OptimizedImage 
          src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1200&q=80" 
          alt="JESICO Premium Cakes" 
          fill 
          className="object-cover" 
          priority 
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 p-6 w-full text-center max-w-md mx-auto">
          {/* Brand Logo/Title */}
          <div className="mb-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-2xl font-serif">
              JESICO
            </h1>
            <p className="text-orange-300 text-lg md:text-xl font-medium tracking-wider">
              PREMIUM CAKE
            </p>
          </div>
          
          <h2 className="text-xl md:text-3xl font-bold text-white leading-tight mb-3">
            Kue Premium untuk<br />
            <span className="text-orange-400">Momen Spesialmu</span>
          </h2>
          
          <p className="text-white/90 mb-6 text-sm md:text-base leading-relaxed px-2">
            Hadirkan kelezatan tak terlupakan dengan kue premium kami. 
            Dibuat khusus dengan bahan terbaik untuk pre-order Anda.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/catalog" 
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <CakeIcon className="w-5 h-5 inline mr-2" />
              Lihat Koleksi
            </Link>
            <Link 
              href="/checkout" 
              className="bg-white text-orange-600 font-bold rounded-full px-8 py-3 text-base border-2 border-orange-500 shadow-lg hover:bg-orange-50 transition-all duration-300"
            >
              <ClockIcon className="w-5 h-5 inline mr-2" />
              Pre-Order
            </Link>
          </div>
        </div>
      </section>

      {/* Pre-Order Notice */}
      <section className="mx-3 -mt-6 relative z-20">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-center text-center">
            <ClockIcon className="w-6 h-6 mr-3 flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">Sistem Pre-Order</p>
              <p className="text-sm opacity-90">Pesan 2-3 hari sebelum acara untuk kualitas terbaik</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Product Categories */}
      <section className="mt-8 px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-800 font-serif">
            Koleksi Premium Kami
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Setiap kue dibuat dengan standar premium untuk momen istimewa Anda
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Birthday Cakes */}
          <Link 
            href="/product/birthday" 
            className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative overflow-hidden">
              <OptimizedImage 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" 
                alt="Kue Ulang Tahun Premium" 
                width={400} 
                height={240} 
                className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                PREMIUM
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-1">Kue Ulang Tahun</h3>
              <p className="text-sm text-gray-600 mb-3">
                Kue spesial dengan desain custom untuk hari istimewa
              </p>
              <div className="flex items-center justify-between">
                <span className="bg-orange-100 text-orange-700 rounded-full px-3 py-1 text-xs font-bold">
                  Pre-Order 2 Hari
                </span>
                <HeartIcon className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              </div>
            </div>
          </Link>

          {/* Wedding Cakes */}
          <Link 
            href="/product/wedding" 
            className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative overflow-hidden">
              <OptimizedImage 
                src="https://images.unsplash.com/photo-1464347744102-11db6282f854?auto=format&fit=crop&w=600&q=80" 
                alt="Kue Pernikahan Premium" 
                width={400} 
                height={240} 
                className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-3 right-3 bg-gradient-to-r from-gold-500 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                LUXURY
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-1">Kue Pernikahan</h3>
              <p className="text-sm text-gray-600 mb-3">
                Kue bertingkat mewah untuk momen pernikahan yang tak terlupakan
              </p>
              <div className="flex items-center justify-between">
                <span className="bg-amber-100 text-amber-700 rounded-full px-3 py-1 text-xs font-bold">
                  Pre-Order 3 Hari
                </span>
                <HeartIcon className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              </div>
            </div>
          </Link>

          {/* Custom Cakes */}
          <Link 
            href="/product/custom" 
            className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1"
          >
            <div className="relative overflow-hidden">
              <OptimizedImage 
                src="/customcake.jpg" 
                alt="Kue Custom Premium" 
                width={400} 
                height={240} 
                className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-3 right-3 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                CUSTOM
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-1">Kue Custom</h3>
              <p className="text-sm text-gray-600 mb-3">
                Wujudkan impian kue Anda dengan desain sesuai keinginan
              </p>
              <div className="flex items-center justify-between">
                <span className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs font-bold">
                  Konsultasi Gratis
                </span>
                <HeartIcon className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Why Choose JESICO - Premium Features */}
      <section className="mt-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-800 font-serif">
            Mengapa JESICO CAKE?
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Komitmen kami untuk memberikan yang terbaik
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <ShieldCheckIcon className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-2">Bahan Premium</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Hanya menggunakan bahan berkualitas tinggi untuk rasa terbaik
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-2">Desain Custom</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Wujudkan kue impian sesuai selera dan tema acara Anda
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <ClockIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-2">Pre-Order Sistem</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Pesan di muka untuk memastikan kualitas dan kesegaran optimal
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <TruckIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-2">Pengiriman Aman</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Sistem packaging khusus untuk menjaga keutuhan kue
            </p>
          </div>
        </div>
      </section>

      {/* How to Order - Pre-Order Process */}
      <section className="mt-12 px-4">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
            Cara Pre-Order di JESICO
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="font-bold mb-2">Pilih & Konsultasi</h3>
              <p className="text-sm opacity-90">
                Pilih kategori kue dan konsultasi desain dengan tim kami
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="font-bold mb-2">Konfirmasi & Bayar</h3>
              <p className="text-sm opacity-90">
                Konfirmasi detail pesanan dan lakukan pembayaran
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="font-bold mb-2">Siap Diantarkan</h3>
              <p className="text-sm opacity-90">
                Kue siap dalam 2-3 hari sesuai jadwal yang disepakati
              </p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link 
              href="/catalog" 
              className="bg-white text-orange-600 font-bold rounded-full px-8 py-3 text-sm hover:bg-orange-50 transition-colors inline-flex items-center"
            >
              <CakeIcon className="w-4 h-4 mr-2" />
              Mulai Pre-Order Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="mt-12 px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-800 font-serif">
            Testimoni Pelanggan
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Kepuasan pelanggan adalah prioritas utama kami
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-gray-800">Sarah M.</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  "Kue ulang tahun dari JESICO benar-benar luar biasa! Desainnya cantik banget dan rasanya premium. 
                  Anak saya sampai nggak mau bagi ke teman-temannya. Pasti order lagi!"
                </p>
                <p className="text-xs text-gray-500 mt-2">Pre-order Birthday Cake Custom</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-gray-800">Michael & Rita</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  "Wedding cake dari JESICO jadi highlight acara pernikahan kami. Semua tamu bilang ini kue terindah 
                  yang pernah mereka lihat. Tim JESICO sangat profesional dan detail!"
                </p>
                <p className="text-xs text-gray-500 mt-2">Pre-order Wedding Cake 3-Tier</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-gray-800">Amanda K.</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  "Pertama kali pre-order di JESICO untuk acara graduation. Prosesnya mudah, tim nya responsif, 
                  dan hasilnya melebihi ekspektasi. Worth every penny!"
                </p>
                <p className="text-xs text-gray-500 mt-2">Pre-order Custom Graduation Cake</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-12 px-4 mb-8">
        <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 rounded-2xl p-8 text-center text-white shadow-xl">
          <CakeIcon className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
            Siap Mewujudkan Kue Impian Anda?
          </h2>
          <p className="text-orange-100 mb-6 leading-relaxed">
            Konsultasi gratis dengan tim expert kami untuk mendiskusikan 
            desain dan kebutuhan kue premium Anda
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link 
              href="/catalog" 
              className="bg-white text-orange-600 font-bold rounded-full px-6 py-3 hover:bg-orange-50 transition-colors flex items-center justify-center"
            >
              <CakeIcon className="w-5 h-5 mr-2" />
              Lihat Koleksi
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white font-bold rounded-full px-6 py-3 hover:bg-white hover:text-orange-600 transition-colors flex items-center justify-center"
            >
              <ClockIcon className="w-5 h-5 mr-2" />
              Konsultasi Gratis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}