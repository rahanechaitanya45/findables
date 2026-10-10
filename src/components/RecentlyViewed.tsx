import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { Product } from '../types';
import { generateAmazonAffiliateUrl, recordAffiliateClick } from '../services/affiliate';
import { AmazonProductImage } from './AmazonProductImage';

interface RecentlyViewedProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onClearHistory: () => void;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  products,
  onSelectProduct,
  onClearHistory,
}) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white rounded-lg p-4 sm:p-5 shadow-xs border border-slate-200 select-none my-6">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#FF9900]" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Your Recently Viewed Deals &amp; Featured Recommendations
          </h2>
        </div>
        <button
          onClick={onClearHistory}
          className="text-xs text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
        >
          Clear history
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-none py-1">
        {products.map((p) => {
          const affiliateUrl = generateAmazonAffiliateUrl(p.asin, 'recently_viewed');
          return (
            <div
              key={`recent-${p.id}`}
              onClick={() => onSelectProduct(p)}
              className="w-36 shrink-0 group cursor-pointer text-left"
            >
              <div className="aspect-square bg-white border border-slate-200 rounded-lg p-2 overflow-hidden flex items-center justify-center group-hover:border-[#FF9900] transition-colors">
                <AmazonProductImage
                  asin={p.asin}
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="mt-1.5 space-y-0.5">
                <div className="text-xs font-bold text-slate-900 font-mono">
                  ₹{p.currentPrice.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-700 line-clamp-1 group-hover:text-[#C7511F]">
                  {p.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
