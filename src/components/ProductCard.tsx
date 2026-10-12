import React, { useState } from 'react';
import { ExternalLink, Star, Eye, Heart, Share2, Check } from 'lucide-react';
import { Product } from '../types';
import { generateAmazonAffiliateUrl, recordAffiliateClick } from '../services/affiliate';
import { shareProduct } from '../services/share';
import { AmazonProductImage } from './AmazonProductImage';
import { PriceInsightTooltip } from './PriceInsightTooltip';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  pageLocation?: string;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  pageLocation = 'product_card',
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const affiliateUrl = generateAmazonAffiliateUrl(product.asin, pageLocation);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const res = await shareProduct(product, pageLocation);
    if (res.success && (res.method === 'clipboard' || res.method === 'fallback')) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <article className="group bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden min-w-0">
      {/* Media Box */}
      <div
        className="relative aspect-square bg-white overflow-hidden cursor-pointer p-2 sm:p-3 flex items-center justify-center border-b border-slate-100"
        onClick={() => onSelect(product)}
      >
        <AmazonProductImage
          asin={product.asin}
          src={product.imageUrl}
          alt={product.title}
          brand={product.brand}
          categoryName={product.categoryName}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Amazon Deal Badge */}
        {product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-[#CC0C39] text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs uppercase leading-none">
            {product.discountPercent}% off
          </div>
        )}

        {/* Floating Actions: Wishlist Heart & Share */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          {onToggleWishlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className="p-1.5 sm:p-2 rounded-full bg-white/95 hover:bg-white text-slate-400 hover:text-rose-600 shadow-xs transition-colors cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center"
              title={isWishlisted ? 'Remove from wishlist' : 'Save deal to wishlist'}
              aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
            >
              <Heart
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                  isWishlisted ? 'fill-rose-600 text-rose-600' : ''
                }`}
              />
            </button>
          )}

          <button
            onClick={handleShare}
            className={`p-1.5 sm:p-2 rounded-full shadow-xs transition-colors cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center ${
              isCopied
                ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-400'
                : 'bg-white/95 hover:bg-white text-slate-500 hover:text-slate-900'
            }`}
            title={isCopied ? 'Link copied!' : 'Share deal'}
            aria-label={`Share ${product.title}`}
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 min-w-0">
        <div className="space-y-1 min-w-0">
          {/* Brand & Category */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 min-w-0">
            <span className="font-bold text-slate-700 uppercase tracking-tight shrink-0">
              {product.brand}
            </span>
            <span>·</span>
            <span className="truncate">{product.categoryName}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelect(product)}
            className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#C7511F] transition-colors line-clamp-2 break-words cursor-pointer leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Ratings */}
          {product.rating && (
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-600">
              <span className="text-amber-500 font-bold flex items-center">
                ★ {product.rating}
              </span>
              {product.reviewCount && (
                <span className="text-slate-400">
                  ({product.reviewCount.toLocaleString('en-IN')})
                </span>
              )}
            </div>
          )}

          {/* Short Factual Description */}
          {product.editorialOneLiner && (
            <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2 break-words leading-relaxed pt-0.5">
              {product.editorialOneLiner}
            </p>
          )}

          {/* Amazon Pricing Block */}
          <div className="pt-1 space-y-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm min-[380px]:text-base sm:text-lg font-extrabold text-slate-900 font-mono tabular-nums">
                ₹{product.currentPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] sm:text-xs text-slate-400 line-through font-mono tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-1 flex-wrap">
              <PriceInsightTooltip
                asin={product.asin}
                currentPrice={product.currentPrice}
                originalPrice={product.originalPrice}
              />
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                FREE delivery
              </span>
            </div>
          </div>
        </div>

        {/* Buttons Row with Share, Details & Amazon Buy */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 sm:gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className={`py-1.5 px-2 text-xs font-semibold rounded-md border transition-all flex items-center justify-center min-h-[38px] min-w-[38px] cursor-pointer shrink-0 ${
              isCopied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-200/60'
            }`}
            title={isCopied ? 'Deal link copied!' : 'Share deal'}
            aria-label={`Share ${product.title}`}
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={() => onSelect(product)}
            className="py-1.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-md transition-colors text-center cursor-pointer min-h-[38px] flex items-center justify-center shrink-0"
            aria-label={`View details of ${product.title}`}
          >
            Details
          </button>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => recordAffiliateClick(product, pageLocation)}
            className="flex-1 py-1.5 px-2 text-xs font-bold text-slate-900 bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] rounded-md border border-[#FCD200] flex items-center justify-center gap-1 shadow-xs cursor-pointer select-none min-h-[38px] text-center"
            title="Check Price on Amazon.in with tracking ID"
            aria-label={`View ${product.title} on Amazon`}
          >
            <span>
              <span className="hidden min-[380px]:inline">View on </span>Amazon
            </span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>
      </div>
    </article>
  );
};
