export default function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="h-64 w-full bg-gray-200 animate-pulse"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3 animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}