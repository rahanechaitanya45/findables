import React from 'react';
import { X, Trash2, ExternalLink, ShoppingCart, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Product } from '../types';
import { generateAmazonAffiliateUrl, recordAffiliateClick } from '../services/affiliate';
import { AmazonProductImage } from './AmazonProductImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onClearWishlist: () => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  savedProducts,
  onRemoveFromWishlist,
  onClearWishlist,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const totalAmount = savedProducts.reduce((acc, curr) => acc + curr.currentPrice, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Header */}
        <div className="bg-[#131921] text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#FF9900]" />
            <div>
              <h3 className="font-bold text-sm">Your Saved Deals &amp; Cart</h3>
              <p className="text-[11px] text-slate-400">
                {savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'} saved for quick Amazon checkout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedProducts.length > 0 ? (
            savedProducts.map((p) => {
              const affiliateUrl = generateAmazonAffiliateUrl(p.asin, 'wishlist_drawer');
              return (
                <div
                  key={p.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-3 items-center justify-between hover:border-slate-300 transition-colors"
                >
                  <div
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    className="w-14 h-14 rounded-lg bg-white p-1 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center cursor-pointer"
                  >
                    <AmazonProductImage
                      asin={p.asin}
                      src={p.imageUrl}
                      alt={p.title}
                      brand={p.brand}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="text-xs font-bold text-slate-900 truncate hover:text-[#FF9900] cursor-pointer"
                    >
                      {p.title}
                    </h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-bold text-slate-900">
                        ₹{p.currentPrice.toLocaleString('en-IN')}
                      </span>
                      {p.discountPercent && (
                        <span className="text-[#CC0C39] font-bold">
                          {p.discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => recordAffiliateClick(p, 'wishlist_item')}
                      className="px-2.5 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 font-bold text-xs rounded-lg border border-[#FCD200] flex items-center gap-1 shadow-xs cursor-pointer select-none"
                      title="Open on Amazon.in"
                    >
                      <span>Buy</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => onRemoveFromWishlist(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                      title="Remove from saved deals"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">Your Saved Deals list is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Tap the heart or bookmark icon on any product card to collect deals for later.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#131921] text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Explore Marketplace Deals
              </button>
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {savedProducts.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-slate-600">Subtotal ({savedProducts.length} items):</span>
              <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF9900] shrink-0 mt-0.5" />
              <span>
                Amazon India official prices &amp; lightning deals apply upon checkout at <strong>amazon.in</strong>.
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClearWishlist}
                className="py-2 px-3 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-white"
              >
                Clear All
              </button>
              <a
                href={`https://www.amazon.in/?tag=amazonde0941f-21`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-[#FFA41C] hover:bg-[#FA8900] text-slate-900 font-bold text-xs rounded-lg text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Continue on Amazon India</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
