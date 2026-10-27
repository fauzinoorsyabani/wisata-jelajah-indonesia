import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

// Default lightweight SVG placeholder data URI
const DEFAULT_FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="100%" height="100%" fill="%23e2e8f0"/><g fill="%2394a3b8"><circle cx="400" cy="260" r="70"/><path d="M220 460 C260 380, 340 340, 400 340 C460 340, 540 380, 580 460 Z"/></g><text x="50%" y="520" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%2364748b">Wisata Indonesia</text></svg>`;

export const toOptimizedWebpUrl = (url?: string): string => {
  if (!url) return DEFAULT_FALLBACK_SVG;
  
  // Optimize Unsplash URLs with WebP format and optimal compression
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fm', 'webp');
      if (!parsed.searchParams.has('q')) {
        parsed.searchParams.set('q', '75');
      }
      return parsed.toString();
    } catch {
      return url;
    }
  }
  return url;
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = DEFAULT_FALLBACK_SVG,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(toOptimizedWebpUrl(src));
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="sr-only">Memuat gambar...</span>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
