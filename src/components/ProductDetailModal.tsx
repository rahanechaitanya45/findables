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
  ArrowLeft,
} from 'lucide-react';
import { Product } from '../types';
import {
  generateAmazonAffiliateUrl,
  recordAffiliateClick,
  getAmazonProductImageUrl,
  AMAZON_ASSOCIATE_TAG,
} from '../services/affiliate';
import { shareProduct } from '../services/share';
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

  // Close modal on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  const affiliateUrl = generateAmazonAffiliateUrl(product.asin, 'pdp_buy_box');

  // Related products from same category
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleShareLink = async () => {
    const res = await shareProduct(product, 'pdp_modal');
    if (res.success && (res.method === 'clipboard' || res.method === 'fallback')) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const images = product.galleryImages && product.galleryImages.length > 0
    ? [product.imageUrl, ...product.galleryImages]
    : [product.imageUrl || getAmazonProductImageUrl(product.asin)];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl sm:rounded-2xl max-w-5xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-300 flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Back Button, Amazon Breadcrumbs, Share & Close */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-30 px-3.5 sm:px-6 py-2.5 sm:py-3 border-b border-slate-200 flex items-center justify-between shadow-xs shrink-0 gap-2">
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0 min-h-[34px]"
              aria-label="Back to products"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden min-[420px]:inline">Back</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-hidden min-w-0 pr-2">
              <span className="truncate max-w-[100px] sm:max-w-none">{product.categoryName}</span>
              <span className="text-slate-300">&rsaquo;</span>
              <span className="font-bold text-slate-800 truncate max-w-[120px] sm:max-w-[240px]">
                {product.brand}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={handleShareLink}
              className="px-2.5 py-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer min-h-[38px] justify-center"
              title="Share deal link"
              aria-label="Share deal link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden min-[480px]:inline">Share Deal</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close product modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Amazon PDP 3-Column Layout: Gallery | Product Info | Buy Box */}
        <div className="p-3.5 sm:p-6 space-y-6 sm:space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* 1. Left Gallery Column (5 Cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="aspect-square bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex items-center justify-center relative shadow-xs overflow-hidden">
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
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-13 h-13 sm:w-14 sm:h-14 rounded-lg border-2 p-1 bg-white shrink-0 cursor-pointer transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        activeImageIndex === idx ? 'border-[#FF9900] shadow-xs ring-1 ring-[#FF9900]' : 'border-slate-200 opacity-80 hover:opacity-100'
                      }`}
                      aria-label={`View image thumbnail ${idx + 1}`}
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
                  className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline font-bold inline-block"
                >
                  Visit the {product.brand} Store on Amazon
                </a>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-1 break-words">
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
                    <span className="text-lg sm:text-xl font-light text-[#CC0C39]">
                      -{product.discountPercent}%
                    </span>
                  )}
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
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
                  <span className="text-xs font-bold text-slate-800 block">
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
                      <div key={k} className="grid grid-cols-2 p-2 bg-white hover:bg-slate-50 break-words">
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
                  <Truck className="w-3.5 h-3.5 shrink-0" />
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
                  <span className="font-semibold text-slate-800 truncate max-w-[140px]">{product.brand} Authorized</span>
                </div>
              </div>

              {/* Primary Amazon Buy CTA Button */}
              <div className="space-y-2 pt-2">
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordAffiliateClick(product, 'pdp_buy_box')}
                  className="w-full py-2.5 px-4 bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-slate-950 font-bold text-xs rounded-full border border-[#FCD200] flex items-center justify-center gap-1.5 shadow-sm cursor-pointer select-none min-h-[44px]"
                  aria-label="View and buy on Amazon"
                >
                  <span>View on Amazon</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {onToggleWishlist && (
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className="w-full py-2 px-4 bg-[#FFA41C] hover:bg-[#FA8900] active:bg-[#F08000] text-slate-950 font-bold text-xs rounded-full border border-[#FF8F00] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer min-h-[40px]"
                    aria-label={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-slate-950' : ''}`} />
                    <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                )}

                <button
                  onClick={handleShareLink}
                  className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs rounded-full border border-slate-300 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer min-h-[40px] transition-colors"
                  aria-label="Share deal with friends"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Share Deal with Friends</span>
                    </>
                  )}
                </button>
              </div>

              {/* Secure Trust Seal */}
              <div className="pt-2 text-[11px] text-slate-500 space-y-1.5 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FF9900] shrink-0" />
                  <span>Secure transaction via Amazon</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>7-Day Return / Replacement Policy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pros & Cons Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-slate-200">
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
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

            <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onSelectProduct(rel);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200 hover:border-[#FF9900] cursor-pointer group text-left transition-colors flex flex-col justify-between"
                  >
                    <div className="aspect-square bg-white p-2 rounded flex items-center justify-center overflow-hidden mb-2">
                      <AmazonProductImage
                        asin={rel.asin}
                        src={rel.imageUrl}
                        alt={rel.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 font-mono">
                        ₹{rel.currentPrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-700 line-clamp-1 group-hover:text-[#C7511F] mt-0.5">
                        {rel.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sticky Quick Buy Bar for Mobile Shoppers */}
          <div className="md:hidden sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-30 flex items-center justify-between gap-3 shadow-lg -mx-3.5 -mb-3.5 sm:-mx-6 sm:-mb-6 mt-4 pb-safe">
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-slate-900 font-mono">
                ₹{product.currentPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">
                In Stock on Amazon
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleShareLink}
                className="p-2.5 rounded-full border border-slate-300 text-slate-700 hover:text-slate-900 bg-slate-50 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Share Deal"
                title="Share deal"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>

              {onToggleWishlist && (
                <button
                  onClick={() => onToggleWishlist(product)}
                  className="p-2.5 rounded-full border border-slate-300 text-slate-700 hover:text-rose-600 bg-slate-50 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
              )}
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => recordAffiliateClick(product, 'pdp_mobile_sticky_buy')}
                className="py-2.5 px-4 bg-[#FFD814] active:bg-[#F0B800] text-slate-950 font-bold text-xs rounded-full border border-[#FCD200] flex items-center justify-center gap-1.5 shadow-sm min-h-[44px] cursor-pointer"
              >
                <span>View on Amazon</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
