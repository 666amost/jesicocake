/**
 * Utility functions for handling images in JESICO CAKE
 */

// Base Supabase URL - ganti dengan URL Supabase Anda
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

/**
 * Generate public URL untuk file di Supabase Storage
 */
export function getSupabaseImageUrl(bucket: string, path: string): string {
  if (!SUPABASE_URL) {
    console.warn('SUPABASE_URL not configured');
    return '/customcake.jpg'; // fallback
  }
  
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Check jika URL adalah dari Supabase storage
 */
export function isSupabaseImageUrl(url: string): boolean {
  return url.includes('.supabase.co/storage/v1/object/public/');
}

/**
 * Generate blur placeholder untuk image loading
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) {
    // Server-side fallback
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyOiKhZHVvTkzCULkFWvLDjK5ELqNj7DJCjYloRSbKZ7iOJ6mG8s7xyXWG0fGl9fmFxzEZNlBQUpk9NgJBATf8AGl9fGFxzEYN/8QABhAAAwEBAAAAAAAAAAAAAAAAAAECEBH/aAAwDAQACEQMRAD8AQbJaLSz//9k=';
  }
  
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Create orange gradient for JESICO theme
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#FED7AA'); // Orange-200
  gradient.addColorStop(1, '#FEF3E2'); // Orange-50
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
}

/**
 * Get optimized image URL berdasarkan device size
 */
export function getOptimizedImageUrl(url: string, width?: number): string {
  // Jika Unsplash, tambahkan parameter optimasi
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    params.set('auto', 'format');
    params.set('fit', 'crop');
    params.set('q', '80');
    
    return `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
  }
  
  // Jika Supabase, return as-is (sudah optimized)
  if (isSupabaseImageUrl(url)) {
    return url;
  }
  
  return url;
}

/**
 * Image fallbacks berdasarkan kategori
 */
export const imageFallbacks = {
  cake: '/customcake.jpg',
  wedding: 'https://images.unsplash.com/photo-1464347744102-11db6282f854?auto=format&fit=crop&w=600&q=80',
  birthday: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
  custom: '/customcake.jpg',
  default: '/customcake.jpg'
};

/**
 * Get fallback image berdasarkan kategori product
 */
export function getFallbackImage(category?: string): string {
  if (!category) return imageFallbacks.default;
  
  const key = category.toLowerCase() as keyof typeof imageFallbacks;
  return imageFallbacks[key] || imageFallbacks.default;
}
