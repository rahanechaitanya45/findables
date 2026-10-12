import React, { useState, useEffect } from 'react';
import {
  Flame,
  AlertCircle,
  Tag,
  ChevronRight,
  Filter,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Product, ShoppingEvent } from '../types';
import { ProductCard } from './ProductCard';
import { ShoppingEventCard } from './ShoppingEventCard';
import { BackButton } from './BackButton';
import {
  getGreatIndianFestivalUrl,
  getAmazonTodaysDealsUrl,
  AMAZON_ASSOCIATE_TAG,
  FLIPKART_BIG_BILLION_DAYS_URL,
  FLIPKART_OFFERS_URL,
} from '../services/affiliate';

interface TodaysDealsSectionProps {
  onSelectProduct: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: (productId: string) => boolean;
  onNavigateCategory?: (categoryPath: string) => void;
  onNavigate?: (path: string) => void;
  isStandalonePage?: boolean;
}

const DEFAULT_EVENTS: ShoppingEvent[] = [
  {
    id: 'amazon-gif',
    merchantId: 'amazon',
    merchantName: 'Amazon India',
    title: 'Great Indian Festival 2026',
    tagline: 'Amazon India Official Event',
    description:
      'Blockbuster discounts up to 77% on trending clothes, sneakers, and everyday essentials. Shop official deals directly on Amazon.in with Prime fast delivery & easy returns.',
    badgeText: 'Amazon India Official Event',
    destinationUrl: getGreatIndianFestivalUrl(),
    secondaryUrl: getAmazonTodaysDealsUrl(),
    secondaryCtaText: 'Explore All Amazon Deals',
    ctaText: 'Explore Great Indian Festival',
    status: 'active',
    startDate: 'Festive Season',
    datesVerified: true,
    affiliateTracked: true,
    theme: {
      gradient: 'bg-gradient-to-r from-[#131921] via-[#232F3E] to-[#131921]',
      glowColor1: 'bg-[#FF9900]/15',
      glowColor2: 'bg-[#CC0C39]/15',
      badgeBg: 'bg-[#FF9900] text-slate-950',
      badgeText: 'text-slate-950',
      buttonBg: 'bg-[#FFD814]',
      buttonHover: 'hover:bg-[#F7CA00]',
      buttonBorder: 'border-[#FCD200]',
      buttonText: 'text-slate-950',
    },
  },
  {
    id: 'flipkart-bbd',
    merchantId: 'flipkart',
    merchantName: 'Flipkart',
    title: 'Flipkart Big Billion Days',
    tagline: 'Flipkart Flagship Shopping Event',
    description:
      "India's biggest festive carnival featuring mega price drops on top brands, fashion specials, sneaker drops, and electronic deals with verified partner fulfillment.",
    badgeText: 'Flipkart Official Flagship Sale',
    destinationUrl: FLIPKART_BIG_BILLION_DAYS_URL,
    secondaryUrl: FLIPKART_OFFERS_URL,
    secondaryCtaText: 'Explore Flipkart Top Offers',
    ctaText: 'Explore Big Billion Days',
    status: 'upcoming',
    startDate: 'Annual Festive Season (September/October)',
    datesVerified: true,
    affiliateTracked: false,
    theme: {
      gradient: 'bg-gradient-to-r from-[#0a2540] via-[#103e7a] to-[#0a2540]',
      glowColor1: 'bg-[#2874F0]/25',
      glowColor2: 'bg-[#FFE500]/20',
      badgeBg: 'bg-[#FFE500] text-blue-950',
      badgeText: 'text-blue-950 font-extrabold',
      buttonBg: 'bg-[#FFE500]',
      buttonHover: 'hover:bg-[#f0d600]',
      buttonBorder: 'border-[#ebd200]',
      buttonText: 'text-blue-950 font-extrabold',
    },
  },
];

export const TodaysDealsSection: React.FC<TodaysDealsSectionProps> = ({
  onSelectProduct,
  onToggleWishlist,
  isWishlisted,
  onNavigateCategory,
  onNavigate,
  isStandalonePage = false,
}) => {
  const [deals, setDeals] = useState<Product[]>([]);
  const [events, setEvents] = useState<ShoppingEvent[]>(DEFAULT_EVENTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'clothes' | 'sneakers' | 'under999'>('all');

  const festivalUrl = getGreatIndianFestivalUrl();

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        if (data.events && Array.isArray(data.events) && data.events.length > 0) {
          setEvents(data.events);
        }
      }
    } catch {
      // Keep DEFAULT_EVENTS
    }
  };

  const fetchDeals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/deals');
      if (!res.ok) {
        throw new Error(`Failed to load deals (Status ${res.status})`);
      }
      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        setDeals(data.items);
      } else {
        setDeals([]);
      }
    } catch (err: any) {
      console.warn('Could not fetch deals from /api/deals, falling back to /api/products:', err);
      try {
        const fallbackRes = await fetch('/api/products?dealOfTheDay=true&limit=16');
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          setDeals(fallbackData.items || []);
        } else {
          setError(err.message || 'Unable to retrieve today deals from data source.');
        }
      } catch (fallbackErr: any) {
        setError(fallbackErr.message || 'Network error while retrieving deals.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchDeals();
  }, []);

  // Filter deals based on active chip
  const filteredDeals = deals.filter((deal) => {
    if (activeFilter === 'clothes') {
      return deal.subCategory === 'clothes';
    }
    if (activeFilter === 'sneakers') {
      return deal.subCategory === 'sneakers';
    }
    if (activeFilter === 'under999') {
      return deal.currentPrice <= 999;
    }
    return true;
  });

  return (
    <section id="todays-deals-section" className="space-y-4 select-none">
      {/* Standalone Deals Page Navigation Bar */}
      {isStandalonePage && (
        <div className="flex items-center justify-between gap-3 pb-1 flex-wrap">
          <BackButton
            label="Back to Home"
            fallbackPath="/"
            onNavigate={(p) => (onNavigate ? onNavigate(p) : onNavigateCategory ? onNavigateCategory(p) : window.history.back())}
          />
          <nav className="flex items-center gap-1.5 text-xs text-slate-500">
            <button
              onClick={() => (onNavigate ? onNavigate('/') : onNavigateCategory ? onNavigateCategory('/') : null)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#007185] font-bold">Today's Deals</span>
          </nav>
        </div>
      )}

      {/* 1. Festive Special Events (Amazon Great Indian Festival & Flipkart Big Billion Days) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {events.map((event) => (
          <ShoppingEventCard key={event.id} event={event} />
        ))}
      </div>

      {/* 2. Today's Deals Header & Subtitle */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#CC0C39] text-white flex items-center justify-center shadow-xs shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Today's Deals
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Discover offers and popular finds from Amazon India.
            </p>
          </div>

          {/* Quick Filter Chips (Horizontally scrollable on mobile, wrapping on sm+) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none sm:flex-wrap">
            <button
              onClick={() => setActiveFilter('all')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-[36px] flex items-center shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-[#131921] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Deals ({deals.length})
            </button>
            <button
              onClick={() => setActiveFilter('clothes')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-[36px] flex items-center shrink-0 ${
                activeFilter === 'clothes'
                  ? 'bg-[#131921] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Clothes Deals
            </button>
            <button
              onClick={() => setActiveFilter('sneakers')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-[36px] flex items-center shrink-0 ${
                activeFilter === 'sneakers'
                  ? 'bg-[#131921] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Sneakers Deals
            </button>
            <button
              onClick={() => setActiveFilter('under999')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-[36px] flex items-center shrink-0 ${
                activeFilter === 'under999'
                  ? 'bg-[#131921] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Under ₹999
            </button>
          </div>
        </div>

        {/* 3. Content States: Loading, Error, Empty, or Product Grid */}
        <div className="pt-3.5 sm:pt-4">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 sm:p-4 animate-pulse space-y-3"
                >
                  <div className="aspect-square bg-slate-200 rounded-lg" />
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-5 bg-slate-200 rounded w-1/2" />
                  <div className="h-8 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-900">Unable to load Today's Deals</h4>
                <p className="text-xs text-rose-700 mt-1">{error}</p>
              </div>
              <button
                onClick={fetchDeals}
                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer transition-colors shadow-xs min-h-[44px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Loading Deals</span>
              </button>
            </div>
          ) : filteredDeals.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  {deals.length === 0 ? 'No products currently in the catalog' : 'No deals match this filter'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  {deals.length === 0
                    ? 'All previous product listings have been removed. You can browse live event deals and discounts directly on Amazon India.'
                    : "Try switching back to 'All Deals' or visit the Great Indian Festival event page on Amazon India."}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {deals.length > 0 ? (
                  <button
                    onClick={() => setActiveFilter('all')}
                    className="bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-slate-800 cursor-pointer min-h-[44px]"
                  >
                    Show All Deals
                  </button>
                ) : null}
                <a
                  href={festivalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#FFD814] text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-lg hover:bg-[#F7CA00] cursor-pointer shadow-xs border border-[#FCD200] min-h-[44px]"
                >
                  <span>Explore Great Indian Festival on Amazon</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {filteredDeals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={isWishlisted ? isWishlisted(product.id) : false}
                  pageLocation="todays_deals"
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Hub Navigation strip */}
        {onNavigateCategory && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              Looking for more fashion finds? Explore our dedicated Clothes and Sneakers collections.
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => onNavigateCategory('/categories/fashion/clothes')}
                className="font-bold text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer inline-flex items-center gap-1 min-h-[36px]"
              >
                <span>Browse Clothes</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <span className="hidden sm:inline">·</span>
              <button
                onClick={() => onNavigateCategory('/categories/fashion/sneakers')}
                className="font-bold text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer inline-flex items-center gap-1 min-h-[36px]"
              >
                <span>Browse Sneakers</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
