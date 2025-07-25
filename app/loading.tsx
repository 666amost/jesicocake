import { CakeIcon } from '@heroicons/react/24/outline';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <CakeIcon className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-bounce" />
          <div className="absolute inset-0 w-16 h-16 mx-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500"></div>
          </div>
        </div>
        <h2 className="text-xl font-bold text-orange-800 mb-2">JESICO CAKE</h2>
        <p className="text-gray-600">Memuat kue premium terbaik...</p>
      </div>
    </div>
  );
}
