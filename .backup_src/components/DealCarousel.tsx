import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Star, Heart } from 'lucide-react';
import { Product } from '../types';
import { generateAmazonAffiliateUrl, recordAffiliateClick } from '../services/affiliate';
import { AmazonProductImage } from './AmazonProductImage';

interface DealCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: (productId: string) => boolean;
  onViewAll?: () => void;
  viewAllLabel?: string;
  badge?: string;
}

export const DealCarousel: React.FC<DealCarouselProps> = ({
  title,
  subtitle,
  products,
  onSelectProduct,
  onToggleWishlist,
  isWishlisted,
  onViewAll,
  viewAllLabel = 'See all deals',
  badge,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white rounded-lg p-4 sm:p-5 shadow-xs border border-slate-200 select-none my-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#CC0C39] text-white">
              {badge}
            </span>
          )}
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {title}
          </h2>
          {subtitle && (
            <span className="hidden sm:inline text-xs text-slate-500 font-normal">
              · {subtitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-bold text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
            >
              {viewAllLabel}
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-none py-1 scroll-smooth"
      >
        {products.map((p) => {
          const affiliateUrl = generateAmazonAffiliateUrl(p.asin, 'deal_carousel');
          const saved = isWishlisted ? isWishlisted(p.id) : false;

          return (
            <div
              key={p.id}
              className="w-[200px] sm:w-[220px] shrink-0 bg-white rounded-lg border border-slate-200/90 p-3 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Media Container */}
              <div
                onClick={() => onSelectProduct(p)}
                className="relative aspect-square bg-white rounded p-2 overflow-hidden flex items-center justify-center cursor-pointer mb-2"
              >
                <AmazonProductImage
                  asin={p.asin}
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />

                {/* Wishlist toggle heart */}
                {onToggleWishlist && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(p);
                    }}
                    className="absolute top-1 right-1 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-rose-600 shadow-xs transition-colors cursor-pointer"
                    title={saved ? 'Remove from wishlist' : 'Save deal to wishlist'}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        saved ? 'fill-rose-600 text-rose-600' : ''
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Title & Content */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  {p.discountPercent && (
                    <span className="text-[11px] font-extrabold bg-[#CC0C39] text-white px-1.5 py-0.5 rounded leading-none">
                      {p.discountPercent}% off
                    </span>
                  )}
                  <span className="text-[10px] text-[#CC0C39] font-bold uppercase">
                    Deal
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    ₹{p.currentPrice.toLocaleString('en-IN')}
                  </span>
                  {p.originalPrice && (
                    <span className="text-[11px] text-slate-400 line-through font-mono">
                      ₹{p.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <h3
                  onClick={() => onSelectProduct(p)}
                  className="text-xs text-slate-800 line-clamp-2 hover:text-[#C7511F] cursor-pointer leading-snug font-medium"
                  title={p.title}
                >
                  {p.title}
                </h3>

                {p.rating && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span className="text-amber-500 font-bold flex items-center">
                      ★ {p.rating}
                    </span>
                    {p.reviewCount && (
                      <span className="text-slate-400">
                        ({p.reviewCount.toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2.5 mt-2 border-t border-slate-100 flex gap-1.5">
                <button
                  onClick={() => onSelectProduct(p)}
                  className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded cursor-pointer text-center"
                >
                  Review
                </button>
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordAffiliateClick(p, 'deal_carousel_cta')}
                  className="py-1.5 px-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 text-[11px] font-bold rounded border border-[#FCD200] flex items-center justify-center gap-1 shadow-xs"
                  title="View on Amazon India"
                >
                  <span>Amazon</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
