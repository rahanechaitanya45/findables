import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { getAmazonProductImageUrl } from '../services/affiliate';

interface AmazonProductImageProps {
  asin: string;
  src?: string;
  alt: string;
  className?: string;
  brand?: string;
  categoryName?: string;
}

export const AmazonProductImage: React.FC<AmazonProductImageProps> = ({
  asin,
  src,
  alt,
  className = 'w-full h-full object-cover',
  brand,
  categoryName,
}) => {
  const [attempt, setAttempt] = useState<number>(0);

  // Strategy:
  // attempt 0: supplied src
  // attempt 1: Amazon CloudFront ASIN canonical URL
  // attempt 2: CSS / SVG fallback
  const primarySrc = src || getAmazonProductImageUrl(asin);
  const fallbackAsinSrc = getAmazonProductImageUrl(asin);

  const currentSrc = attempt === 0 ? primarySrc : fallbackAsinSrc;

  if (attempt >= 2 || (!currentSrc && attempt > 0)) {
    return (
      <div className="w-full h-full bg-[#131921] flex flex-col items-center justify-center p-4 text-center text-white relative select-none">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
          <ShoppingBag className="w-5 h-5 text-[#FF9900]" />
        </div>
        <span className="text-xs font-bold text-white line-clamp-1">{brand || 'Amazon India'}</span>
        <span className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">{categoryName || 'Verified Product'}</span>
        <span className="text-[9px] font-mono text-slate-400 mt-1">ASIN: {asin}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        setAttempt((prev) => prev + 1);
      }}
      className={className}
    />
  );
};
