'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { getOptimizedImageUrl, getFallbackImage } from '@/lib/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  category?: string; // untuk fallback yang tepat
}

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  fill = false,
  priority = false,
  sizes,
  category
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(() => getOptimizedImageUrl(src, width));
  const [hasError, setHasError] = useState(false);

  // Fallback berdasarkan kategori
  const fallbackSrc = getFallbackImage(category);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // Error placeholder component
  const ErrorPlaceholder = () => (
    <div 
      className={`bg-gray-100 flex items-center justify-center ${className}`} 
      style={{ width, height }}
    >
      <div className="text-center p-4">
        <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-xs text-gray-500">Gambar tidak tersedia</p>
      </div>
    </div>
  );

  // Jika ada error dan fallback juga gagal
  if (hasError && imgSrc === fallbackSrc) {
    return <ErrorPlaceholder />;
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      fill={fill}
      priority={priority}
      sizes={sizes}
      placeholder="empty"
      onError={handleError}
      loading={priority ? 'eager' : 'lazy'}
      quality={85}
    />
  );
}
