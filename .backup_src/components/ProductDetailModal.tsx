import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Star,
  CheckCircle2,
  XCircle,
  Share2,
  ShieldCheck,
  Heart,
  Lock,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Product } from '../types';
import {
  generateAmazonAffiliateUrl,
  recordAffiliateClick,
  getAmazonProductImageUrl,
  AMAZON_ASSOCIATE_TAG,
} from '../services/affiliate';
import { AmazonProductImage } from './AmazonProductImage';
import { PriceInsightTooltip } from './PriceInsightTooltip';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
  deliveryLocation?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  allProducts,
  onSelectProduct,
  onToggleWishlist,
  isWishlisted = false,
  deliveryLocation = 'India',
}) => {
  const [copied, setCopied] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const affiliateUrl = generateAmazonAffiliateUrl(product.asin, 'pdp_buy_box');

  // Related products from same category
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleShareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#product=${product.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const images = product.galleryImages && product.galleryImages.length > 0
    ? [product.imageUrl, ...product.galleryImages]
    : [product.imageUrl || getAmazonProductImageUrl(product.asin)];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 select-none animate-fadeIn">
      <div
        className="relative bg-white rounded-xl max-w-5xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Amazon Breadcrumbs & Close */}
        <div className="sticky top-0 bg-white z-30 px-4 sm:px-6 py-3 border-b border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-hidden">
            <span className="hover:underline cursor-pointer">Amazon.in</span>
            <span className="text-slate-300">&rsaquo;</span>
            <span className="hover:underline cursor-pointer truncate">{product.categoryName}</span>
            <span className="text-slate-300">&rsaquo;</span>
            <span className="font-bold text-slate-800 truncate max-w-[180px] sm:max-w-[260px]">
              {product.brand}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShareLink}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1 text-xs cursor-pointer"
              title="Share deal link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Amazon PDP 3-Column Layout: Gallery | Product Info | Buy Box */}
        <div className="p-4 sm:p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* 1. Left Gallery Column (4 Cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="aspect-square bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-center relative shadow-xs overflow-hidden">
                <AmazonProductImage
                  asin={product.asin}
                  src={images[activeImageIndex] || product.imageUrl}
                  alt={product.title}
                  brand={product.brand}
                  categoryName={product.categoryName}
                  className="w-full h-full object-contain"
                />
                {product.discountPercent && (
                  <div className="absolute top-3 left-3 bg-[#CC0C39] text-white text-xs font-extrabold px-2 py-0.5 rounded shadow-xs uppercase leading-none">
                    {product.discountPercent}% off
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-14 rounded border-2 p-1 bg-white shrink-0 cursor-pointer transition-all ${
                        activeImageIndex === idx ? 'border-[#FF9900] shadow-xs' : 'border-slate-200 opacity-80'
                      }`}
                    >
                      <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* ASIN and Market Info Box */}
              <div className="bg-[#F8F9FA] rounded-lg p-3 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Marketplace:</span>
                  <span className="font-bold text-slate-800 font-mono">Amazon India (amazon.in)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ASIN Identifier:</span>
                  <span className="font-bold font-mono text-slate-800">{product.asin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tracking Partner:</span>
                  <span className="font-mono text-slate-800">{AMAZON_ASSOCIATE_TAG}</span>
                </div>
              </div>
            </div>

            {/* 2. Center Column: Details & Editorial Review (4 Cols) */}
            <div className="md:col-span-4 space-y-3">
              <div>
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline font-bold"
                >
                  Visit the {product.brand} Store on Amazon
                </a>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-1">
                  {product.title}
                </h1>
              </div>

              {/* Star Rating Bar */}
              {product.rating && (
                <div className="flex items-center gap-2 text-xs border-b border-slate-200 pb-2">
                  <span className="text-amber-500 font-bold flex items-center">
                    ★ {product.rating}
                  </span>
                  <span className="text-[#007185] hover:underline cursor-pointer">
                    {product.reviewCount?.toLocaleString('en-IN') || '1,200'} ratings
                  </span>
                </div>
              )}

              {/* Amazon Pricing Module */}
              <div className="space-y-1.5 border-b border-slate-200 pb-3">
                <div className="flex items-baseline gap-2 flex-wrap">
                  {product.discountPercent && (
                    <span className="text-xl font-light text-[#CC0C39]">
                      -{product.discountPercent}%
                    </span>
                  )}
                  <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                    ₹{product.currentPrice.toLocaleString('en-IN')}
                  </span>
                  <PriceInsightTooltip
                    asin={product.asin}
                    currentPrice={product.currentPrice}
                    originalPrice={product.originalPrice}
                  />
                </div>
                {product.originalPrice && (
                  <div className="text-xs text-slate-500">
                    M.R.P.: <span className="line-through font-mono">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="text-[11px] text-slate-500">
                  Inclusive of all taxes · Amazon Pay ICICI card savings eligible
                </div>
              </div>

              {/* Editorial Verdict Callout */}
              <div className="bg-amber-50/70 border border-amber-200/90 rounded-lg p-3 space-y-1">
                <div className="text-[11px] font-extrabold text-[#B12704] uppercase">
                  Editor's Recommendation
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-normal">
                  {product.editorialReview}
                </p>
              </div>

              {/* Available Sizes / Variants */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-slate-800">
                    {product.subCategory === 'sneakers' ? 'Available Footwear Sizes (UK):' : 'Available Apparel Sizes:'}
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {product.sizes.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 text-xs font-semibold bg-slate-50 border border-slate-300 rounded text-slate-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications Matrix */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-bold text-slate-900">Key Product Details</h4>
                  <div className="text-xs divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {Object.entries(product.specs).map(([k, v]) => (
                      <div key={k} className="grid grid-cols-2 p-2 bg-white hover:bg-slate-50">
                        <span className="text-slate-500 font-medium">{k}</span>
                        <span className="text-slate-900 font-bold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Right Column: Amazon Buy Box (3 Cols) */}
            <div className="md:col-span-3 bg-white border border-slate-300 rounded-xl p-4 shadow-xs space-y-3">
              <div className="text-xl font-extrabold text-slate-900 font-mono">
                ₹{product.currentPrice.toLocaleString('en-IN')}
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <div className="text-[#007185] font-bold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>FREE Delivery</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Delivery to <strong className="text-slate-800">{deliveryLocation}</strong>
                </div>
              </div>

              <div className="text-sm font-bold text-[#007600]">
                In Stock on Amazon.in
              </div>

              <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ships from</span>
                  <span className="font-semibold text-slate-800">Amazon Fulfillment</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sold by</span>
                  <span className="font-semibold text-slate-800">{product.brand} Authorized</span>
                </div>
              </div>

              {/* Primary Amazon Buy CTA Button */}
              <div className="space-y-2 pt-2">
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordAffiliateClick(product, 'pdp_buy_box')}
                  className="w-full py-2.5 px-4 bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-slate-950 font-bold text-xs rounded-full border border-[#FCD200] flex items-center justify-center gap-1.5 shadow-sm cursor-pointer select-none"
                >
                  <span>View on Amazon</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {onToggleWishlist && (
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className="w-full py-2 px-4 bg-[#FFA41C] hover:bg-[#FA8900] active:bg-[#F08000] text-slate-950 font-bold text-xs rounded-full border border-[#FF8F00] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-slate-950' : ''}`} />
                    <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                )}
              </div>

              {/* Secure Trust Seal */}
              <div className="pt-2 text-[11px] text-slate-500 space-y-1.5 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FF9900]" />
                  <span>Secure transaction via Amazon</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                  <span>7-Day Return / Replacement Policy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pros & Cons Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-4 space-y-2">
              <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Strengths (Pros)</span>
              </h4>
              <ul className="text-xs text-slate-700 space-y-1">
                {product.pros.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50/60 border border-rose-200 rounded-lg p-4 space-y-2">
              <h4 className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Points to Consider (Cons)</span>
              </h4>
              <ul className="text-xs text-slate-700 space-y-1">
                {product.cons.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold">&bull;</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Similar Amazon Alternatives Carousel */}
          {relatedProducts.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Customers also viewed in {product.categoryName}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onSelectProduct(rel);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3 bg-white rounded-lg border border-slate-200 hover:border-[#FF9900] cursor-pointer group text-left transition-colors"
                  >
                    <div className="aspect-square bg-white p-2 rounded flex items-center justify-center overflow-hidden mb-2">
                      <AmazonProductImage
                        asin={rel.asin}
                        src={rel.imageUrl}
                        alt={rel.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="text-xs font-bold text-slate-900 font-mono">
                      ₹{rel.currentPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-700 line-clamp-1 group-hover:text-[#C7511F] mt-0.5">
                      {rel.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
