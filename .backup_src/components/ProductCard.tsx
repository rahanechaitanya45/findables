import React from 'react';
import { ExternalLink, Star, Eye, Heart } from 'lucide-react';
import { Product } from '../types';
import { generateAmazonAffiliateUrl, recordAffiliateClick } from '../services/affiliate';
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
  const affiliateUrl = generateAmazonAffiliateUrl(product.asin, pageLocation);

  return (
    <article className="group bg-white rounded-lg border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Media Box */}
      <div
        className="relative aspect-square bg-white overflow-hidden cursor-pointer p-3 flex items-center justify-center border-b border-slate-100"
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
          <div className="absolute top-2 left-2 bg-[#CC0C39] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs uppercase leading-none">
            {product.discountPercent}% off
          </div>
        )}

        {/* Wishlist toggle heart */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-rose-600 shadow-xs transition-colors cursor-pointer"
            title={isWishlisted ? 'Remove from wishlist' : 'Save deal to wishlist'}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isWishlisted ? 'fill-rose-600 text-rose-600' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {/* Brand & Category */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-bold text-slate-700 uppercase text-[10px]">
              {product.brand}
            </span>
            <span>·</span>
            <span className="truncate">{product.categoryName}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelect(product)}
            className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#C7511F] transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Ratings */}
          {product.rating && (
            <div className="flex items-center gap-1 text-[11px] text-slate-600">
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
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pt-0.5">
              {product.editorialOneLiner}
            </p>
          )}

          {/* Amazon Pricing Block */}
          <div className="pt-1 space-y-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-extrabold text-slate-900 font-mono tabular-nums">
                ₹{product.currentPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-1.5 flex-wrap">
              <PriceInsightTooltip
                asin={product.asin}
                currentPrice={product.currentPrice}
                originalPrice={product.originalPrice}
              />
              <span className="text-[10px] text-slate-500 font-medium">
                FREE delivery
              </span>
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="pt-2 border-t border-slate-100 flex gap-2">
          <button
            onClick={() => onSelect(product)}
            className="py-1.5 px-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors text-center cursor-pointer"
          >
            Details
          </button>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => recordAffiliateClick(product, pageLocation)}
            className="flex-1 py-1.5 px-2 text-xs font-bold text-slate-900 bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] rounded-md border border-[#FCD200] flex items-center justify-center gap-1 shadow-xs cursor-pointer select-none"
            title="Check Price on Amazon.in with tracking ID"
          >
            <span>View on Amazon</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>
      </div>
    </article>
  );
};
