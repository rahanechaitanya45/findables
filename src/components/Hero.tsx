import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Flame,
  Tag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Product, Category } from '../types';
import { generateAmazonAffiliateUrl, recordAffiliateClick } from '../services/affiliate';
import { AmazonProductImage } from './AmazonProductImage';

interface HeroProps {
  onShopNow: () => void;
  onExploreCategories: () => void;
  featuredProduct?: Product;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (catId: string) => void;
}

const BANNERS = [
  {
    title: 'Great Indian Deals Festival',
    subtitle: 'Up to 80% Off on Top Curated Finds across Amazon.in',
    tag: '⚡ Lightning Deals Active',
    badge: 'Amazon India Partner',
    ctaText: 'Shop All Trending Deals',
  },
  {
    title: 'Budget Picks Under ₹499',
    subtitle: 'Everyday Household, Student & Tech Hacks that cost less than lunch',
    tag: '💰 Wallet-Friendly Champions',
    badge: '100% Genuine ASINs',
    ctaText: 'Explore Under ₹499 Deals',
  },
  {
    title: 'Hostel & College Essentials',
    subtitle: 'Electric kettles, study lamps, re-writable notes & power banks',
    tag: '🎓 Student Curated',
    badge: 'Prime Delivery Eligible',
    ctaText: 'View College Essentials',
  },
];

export const Hero: React.FC<HeroProps> = ({
  onShopNow,
  onExploreCategories,
  featuredProduct,
  allProducts,
  onSelectProduct,
  onSelectCategory,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = BANNERS[currentSlide];

  // Extract products for the 4-in-1 Amazon cards
  const techCards = allProducts.filter((p) => p.category === 'tech-gadgets').slice(0, 4);
  const under499Cards = allProducts.filter((p) => p.currentPrice <= 499 || p.isUnder499).slice(0, 4);
  const homeCards = allProducts.filter((p) => p.category === 'home-kitchen' || p.category === 'student-essentials').slice(0, 4);

  const spotlightAffiliateUrl = featuredProduct
    ? generateAmazonAffiliateUrl(featuredProduct.asin, 'hero_spotlight')
    : '#';

  return (
    <div className="relative bg-[#131921] pb-12 sm:pb-16 select-none overflow-hidden">
      {/* 1. Main Promotional Amazon Billboard Slide */}
      <div className="relative bg-gradient-to-r from-[#0d131a] via-[#1a2332] to-[#232F3E] text-white pt-8 pb-32 sm:pb-36 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF9900]">
              <Flame className="w-4 h-4 fill-[#FF9900]" />
              <span>{slide.tag}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300 font-normal">{slide.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {slide.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {slide.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onShopNow}
                className="px-5 py-2.5 bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 font-bold text-xs sm:text-sm rounded-md shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreCategories}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-md border border-white/20 transition-all cursor-pointer"
              >
                Explore All 10 Categories
              </button>
            </div>
          </div>

          {/* Carousel Slide Indicators & Arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {BANNERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? 'bg-[#FF9900] w-6' : 'bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % BANNERS.length)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Amazon Homepage 4-in-1 Floating Feature Grid Over Billboard */}
      <div className="max-w-[1500px] mx-auto px-2 sm:px-4 -mt-24 sm:-mt-28 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Top Tech & Gadgets 4-in-1 */}
          <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                Up to 80% off | Top Deals in Tech
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">TWS, Smart Bulbs &amp; Mice</p>

              <div className="grid grid-cols-2 gap-2">
                {techCards.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectProduct(item)}
                    className="cursor-pointer group text-left"
                  >
                    <div className="aspect-square bg-slate-50 border border-slate-200 rounded p-1 overflow-hidden flex items-center justify-center group-hover:border-[#FF9900] transition-colors">
                      <AmazonProductImage
                        asin={item.asin}
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="text-[10px] font-bold text-slate-800 truncate mt-1">
                      ₹{item.currentPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onSelectCategory('tech-gadgets');
                document.getElementById('deals-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#007185] hover:text-[#C7511F] hover:underline pt-3 text-left cursor-pointer"
            >
              See all tech deals &rarr;
            </button>
          </div>

          {/* Card 2: Budget Finds Under ₹499 4-in-1 */}
          <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                Budget Finds Under ₹499
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">Hostel, home &amp; daily picks</p>

              <div className="grid grid-cols-2 gap-2">
                {under499Cards.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectProduct(item)}
                    className="cursor-pointer group text-left"
                  >
                    <div className="aspect-square bg-slate-50 border border-slate-200 rounded p-1 overflow-hidden flex items-center justify-center group-hover:border-[#FF9900] transition-colors">
                      <AmazonProductImage
                        asin={item.asin}
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="text-[10px] font-bold text-[#CC0C39] truncate mt-1 font-mono">
                      ₹{item.currentPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onSelectCategory('budget-under-499');
                document.getElementById('deals-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#007185] hover:text-[#C7511F] hover:underline pt-3 text-left cursor-pointer"
            >
              Explore all under ₹499 &rarr;
            </button>
          </div>

          {/* Card 3: Home & Student Essentials 4-in-1 */}
          <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                Home, Kitchen &amp; Study
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">Electric kettles &amp; desk lamps</p>

              <div className="grid grid-cols-2 gap-2">
                {homeCards.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectProduct(item)}
                    className="cursor-pointer group text-left"
                  >
                    <div className="aspect-square bg-slate-50 border border-slate-200 rounded p-1 overflow-hidden flex items-center justify-center group-hover:border-[#FF9900] transition-colors">
                      <AmazonProductImage
                        asin={item.asin}
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="text-[10px] font-bold text-slate-800 truncate mt-1">
                      ₹{item.currentPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onSelectCategory('home-kitchen');
                document.getElementById('deals-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#007185] hover:text-[#C7511F] hover:underline pt-3 text-left cursor-pointer"
            >
              See home &amp; study finds &rarr;
            </button>
          </div>

          {/* Card 4: Today's Spotlight Deal of the Day */}
          {featuredProduct && (
            <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-extrabold text-[#CC0C39] bg-rose-50 px-2 py-0.5 rounded border border-rose-200 uppercase">
                    Deal of the Day
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ASIN: {featuredProduct.asin}
                  </span>
                </div>

                <h3
                  onClick={() => onSelectProduct(featuredProduct)}
                  className="font-extrabold text-slate-900 text-sm truncate hover:text-[#FF9900] cursor-pointer mt-1"
                >
                  {featuredProduct.title}
                </h3>

                <div
                  onClick={() => onSelectProduct(featuredProduct)}
                  className="aspect-[4/3] bg-white p-2 border border-slate-200 rounded-lg my-2 flex items-center justify-center cursor-pointer group"
                >
                  <AmazonProductImage
                    asin={featuredProduct.asin}
                    src={featuredProduct.imageUrl}
                    alt={featuredProduct.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex items-baseline gap-2 mt-1">
                  {featuredProduct.discountPercent && (
                    <span className="text-xs font-bold bg-[#CC0C39] text-white px-1.5 py-0.5 rounded">
                      -{featuredProduct.discountPercent}%
                    </span>
                  )}
                  <span className="text-lg font-extrabold text-slate-900 font-mono">
                    ₹{featuredProduct.currentPrice.toLocaleString('en-IN')}
                  </span>
                  {featuredProduct.originalPrice && (
                    <span className="text-xs text-slate-400 line-through font-mono">
                      ₹{featuredProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => onSelectProduct(featuredProduct)}
                  className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded cursor-pointer"
                >
                  View Details
                </button>
                <a
                  href={spotlightAffiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordAffiliateClick(featuredProduct, 'hero_spotlight')}
                  className="py-1.5 px-3 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 text-xs font-bold rounded border border-[#FCD200] flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>Amazon.in</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
