'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <ExclamationTriangleIcon className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Terjadi Kesalahan</h2>
        <p className="text-gray-600 mb-6">
          Maaf, terjadi masalah saat memuat halaman. Tim kami akan segera memperbaikinya.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full bg-orange-500 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors"
          >
            Coba Lagi
          </button>
          
          <Link
            href="/"
            className="w-full bg-white text-orange-600 px-6 py-3 rounded-full font-medium border-2 border-orange-500 hover:bg-orange-50 transition-colors inline-flex items-center justify-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>
        
        <p className="text-xs text-gray-500 mt-6">
          Error ID: {error.digest}
        </p>
      </div>
    </div>
  );
}
