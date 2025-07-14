import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBagIcon, StarIcon, TruckIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100">
      {/* Hero */}
      <section className="relative w-full h-[420px] md:h-[520px] flex items-end justify-center overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80" alt="Kue Premium" fill className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 p-6 w-full text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">Kue Premium<br /><span className="text-orange-400">Untuk Momen Spesialmu</span></h1>
          <p className="text-white/90 mt-2 mb-4 text-sm md:text-lg">Temukan kelezatan kue premium kami yang dibuat dengan bahan berkualitas dan sentuhan tangan yang penuh cinta.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/catalog" className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full px-6 py-2 text-lg shadow">Lihat Koleksi</Link>
            <Link href="/checkout" className="bg-white text-orange-600 font-bold rounded-full px-6 py-2 text-lg border border-orange-500 shadow">Pesan Sekarang</Link>
          </div>
        </div>
      </section>

      {/* Card Produk */}
      <section className="mt-8 px-3">
        <h2 className="text-xl font-bold mb-4 text-orange-700 text-center">Kue Premium Pilihan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/product/1" className="bg-white/90 rounded-xl shadow-md overflow-hidden flex flex-col hover:scale-[1.03] transition-transform">
            <Image src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" alt="Kue Ulang Tahun" width={400} height={200} className="object-cover w-full h-36" />
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="font-bold text-lg text-gray-800">Kue Ulang Tahun</div>
                <div className="text-xs text-gray-500">Kue spesial untuk hari spesialmu</div>
              </div>
              <span className="mt-2 inline-block bg-orange-100 text-orange-600 rounded-full px-3 py-1 text-xs font-bold">Lihat Koleksi</span>
            </div>
          </Link>
          <Link href="/product/2" className="bg-white/90 rounded-xl shadow-md overflow-hidden flex flex-col hover:scale-[1.03] transition-transform">
            <Image src="https://images.unsplash.com/photo-1464347744102-11db6282f854?auto=format&fit=crop&w=600&q=80" alt="Kue Pernikahan" width={400} height={200} className="object-cover w-full h-36" />
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="font-bold text-lg text-gray-800">Kue Pernikahan</div>
                <div className="text-xs text-gray-500">Kue mewah untuk hari pernikahanmu</div>
              </div>
              <span className="mt-2 inline-block bg-orange-100 text-orange-600 rounded-full px-3 py-1 text-xs font-bold">Pesan Sekarang</span>
            </div>
          </Link>
          <Link href="/product/3" className="bg-white/90 rounded-xl shadow-md overflow-hidden flex flex-col hover:scale-[1.03] transition-transform">
            <Image src="/customcake.jpg" alt="Kue Custom" width={400} height={200} className="object-cover w-full h-36" />
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="font-bold text-lg text-gray-800">Kue Custom</div>
                <div className="text-xs text-gray-500">Kue sesuai keinginanmu</div>
              </div>
              <span className="mt-2 inline-block bg-orange-100 text-orange-600 rounded-full px-3 py-1 text-xs font-bold">Konsultasi</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="mt-8 px-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheckIcon className="w-8 h-8 text-orange-500 mb-1" />
            <div className="font-bold text-sm">Bahan Premium</div>
            <div className="text-xs text-gray-500">Bahan berkualitas tinggi untuk rasa terbaik.</div>
          </div>
          <div className="flex flex-col items-center">
            <SparklesIcon className="w-8 h-8 text-orange-500 mb-1" />
            <div className="font-bold text-sm">Pesan Custom</div>
            <div className="text-xs text-gray-500">Kue impian sesuai selera & acara.</div>
          </div>
          <div className="flex flex-col items-center">
            <TruckIcon className="w-8 h-8 text-orange-500 mb-1" />
            <div className="font-bold text-sm">Pengiriman Aman</div>
            <div className="text-xs text-gray-500">Sampai di tangan Anda dengan aman.</div>
          </div>
          <div className="flex flex-col items-center">
            <StarIcon className="w-8 h-8 text-orange-500 mb-1" />
            <div className="font-bold text-sm">Kualitas Terjamin</div>
            <div className="text-xs text-gray-500">Rasa & kualitas selalu konsisten.</div>
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="mt-8 px-3">
        <h2 className="text-xl font-bold mb-4 text-orange-700 text-center">Kata Mereka</h2>
        <div className="bg-white/90 rounded-xl shadow-md p-4 flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <Image src="/testi1.jpg" alt="Sarah M." width={48} height={48} className="rounded-full object-cover" />
            <div>
              <div className="font-bold text-gray-800">Sarah M.</div>
              <div className="text-xs text-gray-500">★★★★★</div>
              <div className="text-sm mt-1">"Kuenya enak banget! Tampilannya juga cantik, bikin acara ulang tahun anak saya jadi lebih spesial."</div>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <Image src="/testi2.jpg" alt="Michael R." width={48} height={48} className="rounded-full object-cover" />
            <div>
              <div className="font-bold text-gray-800">Michael R.</div>
              <div className="text-xs text-gray-500">★★★★★</div>
              <div className="text-sm mt-1">"Kue pernikahan kami dibuat dengan sangat cantik dan lezat. Semua tamu suka!"</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}