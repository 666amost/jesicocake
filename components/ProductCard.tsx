'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-md overflow-hidden shadow-premium-sm hover:shadow-premium-md border border-neutral-100 transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={product.image_url || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          {product.stock < 5 && product.stock > 0 && (
            <div className="absolute top-3 left-3 bg-orange-600/90 text-white text-xs font-montserrat uppercase tracking-wide px-3 py-1.5 rounded-sm">
              Limited Stock
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-3 left-3 bg-red-600/90 text-white text-xs font-montserrat uppercase tracking-wide px-3 py-1.5 rounded-sm">
              Out of Stock
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-5">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-playfair text-lg font-medium text-gray-800 mb-2 hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-playfair font-semibold text-orange-600">
            {formatCurrency(product.price)}
          </span>
          
          <Link 
            href={`/product/${product.id}`}
            className="px-4 py-2 bg-orange-600 text-white text-xs font-montserrat uppercase tracking-wider rounded-sm hover:bg-orange-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}