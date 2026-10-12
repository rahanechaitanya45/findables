import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Lock,
  Heart,
  ExternalLink,
  Flame,
  ShieldCheck,
  Shirt,
  Footprints,
  Sparkles,
} from 'lucide-react';
import { Product, Category } from '../types';
import { AmazonProductImage } from './AmazonProductImage';

interface HeaderProps {
  onSearch: (query: string, category?: string) => void;
  searchQuery: string;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  categories: Category[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  deliveryLocation: string;
  onOpenLocationModal: () => void;
  onOpenWishlist: () => void;
  wishlistCount: number;
  onOpenAdmin: () => void;
  onOpenDisclosure: () => void;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  searchQuery,
  selectedCategory,
  onSelectCategory,
  categories,
  products,
  onSelectProduct,
  deliveryLocation,
  onOpenLocationModal,
  onOpenWishlist,
  wishlistCount,
  onOpenAdmin,
  onOpenDisclosure,
  onNavigate,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchCategory, setSearchCategory] = useState('all');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Autocomplete suggestions
  const suggestions = searchQuery.trim().length > 1
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.asin.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const insideDesktop = searchContainerRef.current && searchContainerRef.current.contains(target);
      const insideMobile = mobileSearchRef.current && mobileSearchRef.current.contains(target);
      if (!insideDesktop && !insideMobile) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        if (isSearchFocused) setIsSearchFocused(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, isSearchFocused]);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    onSearch(searchQuery, searchCategory !== 'all' ? searchCategory : undefined);
    if (onNavigate && window.location.pathname !== '/') {
      onNavigate('/');
    }
    setTimeout(() => {
      document.getElementById('todays-deals-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleClearSearch = () => {
    onSearch('', searchCategory !== 'all' ? searchCategory : undefined);
    setIsSearchFocused(false);
  };

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.pathname = path;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#131921] text-white shadow-md select-none">
      {/* 1. TOP ROW: Brand, Location, Search (on sm+), Language, Wishlist, Cart, Menu */}
      <div className="max-w-[1500px] mx-auto px-2.5 sm:px-4">
        <div className="flex items-center justify-between h-13 sm:h-15 gap-2 sm:gap-4">
          {/* Logo Zone */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                navigateTo('/');
                onSelectCategory('all');
                onSearch('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-0.5 px-1.5 sm:px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer group text-left min-h-[44px]"
              aria-label="Findables Home"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9900] to-[#FF7900] flex items-center justify-center font-black text-slate-950 text-base shadow-sm group-hover:scale-105 transition-transform shrink-0">
                  F
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white leading-none">Findables</span>
                    <span className="text-[#FF9900] text-xs font-bold ml-0.5">.in</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-slate-300 font-medium tracking-tight hidden sm:block mt-0.5">
                    Find Better. Shop Smarter.
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Location Delivery Selector (Desktop / Tablet) */}
          <button
            onClick={onOpenLocationModal}
            className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all text-left cursor-pointer shrink-0 min-h-[44px]"
            title="Change Indian delivery location"
            aria-label={`Deliver to ${deliveryLocation || 'India'}`}
          >
            <MapPin className="w-4 h-4 text-white mt-0.5 shrink-0" />
            <div className="leading-tight">
              <div className="text-[11px] text-slate-300">Deliver to</div>
              <div className="text-xs font-bold text-white truncate max-w-[110px]">
                {deliveryLocation || 'India'}
              </div>
            </div>
          </button>

          {/* Search Bar Zone (Desktop & Tablet: hidden on mobile below sm) */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-3xl hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="flex h-9 sm:h-10 rounded-md overflow-hidden bg-white shadow-inner">
              {/* Category Dropdown */}
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="bg-[#F3F3F3] hover:bg-[#DADADA] text-[#0F1111] text-xs px-2.5 border-r border-slate-300 font-medium focus:outline-none cursor-pointer shrink-0 max-w-[140px]"
                aria-label="Select search category"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Text Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearch(e.target.value, searchCategory !== 'all' ? searchCategory : undefined);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search Findables for top products, brands, deals..."
                className="flex-1 px-3 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none min-w-0"
              />

              {/* Clear button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#FEBD69] hover:bg-[#F3A847] active:bg-[#E2922D] text-slate-900 px-3.5 sm:px-5 flex items-center justify-center cursor-pointer transition-colors shrink-0 min-w-[44px]"
                aria-label="Submit search"
              >
                <Search className="w-4 h-4 text-slate-900 font-bold" />
              </button>
            </form>

            {/* Live Autocomplete Suggestions (Desktop) */}
            {isSearchFocused && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white text-slate-900 rounded-md shadow-2xl border border-slate-300 overflow-hidden z-50 divide-y divide-slate-100">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectProduct(item);
                      setIsSearchFocused(false);
                    }}
                    className="w-full px-3 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between gap-3 text-xs cursor-pointer group min-h-[44px]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                        <AmazonProductImage
                          asin={item.asin}
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 group-hover:text-[#C7511F] truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {item.brand} · {item.categoryName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-slate-900 font-mono">
                        ₹{item.currentPrice.toLocaleString('en-IN')}
                      </div>
                      {item.discountPercent && (
                        <span className="text-[#CC0C39] font-bold text-[10px]">{item.discountPercent}% off</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons Group */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Location Quick Tap (under 640px) */}
            <button
              onClick={onOpenLocationModal}
              className="flex md:hidden items-center gap-1 p-2 rounded hover:ring-1 hover:ring-white transition-all text-left cursor-pointer min-h-[44px] min-w-[44px] justify-center"
              title={`Deliver to: ${deliveryLocation}`}
              aria-label={`Deliver to ${deliveryLocation}`}
            >
              <MapPin className="w-4 h-4 text-[#FF9900]" />
              <span className="text-[11px] font-bold text-slate-200 hidden min-[440px]:inline max-w-[85px] truncate">
                {deliveryLocation ? deliveryLocation.replace('PIN ', '') : 'Location'}
              </span>
            </button>

            {/* Region / Language Badge (Desktop only) */}
            <div className="hidden xl:flex items-center gap-1 px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer min-h-[44px]">
              <span className="text-sm">🇮🇳</span>
              <span className="text-xs font-bold text-white">EN</span>
            </div>

            {/* Account / Wishlist Button (Tablet+) */}
            <button
              onClick={onOpenWishlist}
              className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all text-left cursor-pointer shrink-0 min-h-[44px]"
              aria-label="View Wishlist"
            >
              <div className="leading-tight">
                <div className="text-[11px] text-slate-300">Your Lists</div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>Wishlist</span>
                  <Heart className="w-3 h-3 text-[#FF9900] fill-[#FF9900]" />
                </div>
              </div>
            </button>

            {/* Returns & Orders (Information & Transparency Link) */}
            <button
              onClick={onOpenDisclosure}
              className="hidden lg:flex items-center px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all text-left cursor-pointer shrink-0 min-h-[44px]"
              aria-label="Affiliate Disclosure and Deals"
            >
              <div className="leading-tight">
                <div className="text-[11px] text-slate-300">Affiliate Info</div>
                <div className="text-xs font-bold text-white">Returns &amp; Deals</div>
              </div>
            </button>

            {/* Cart Icon with Live Item Count */}
            <button
              onClick={onOpenWishlist}
              className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded hover:ring-1 hover:ring-white transition-all text-white relative cursor-pointer shrink-0 min-h-[44px] min-w-[44px] justify-center"
              aria-label={`Open Cart (${wishlistCount} items)`}
            >
              <div className="relative">
                <ShoppingCart className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                <span className="absolute -top-1.5 -right-2 bg-[#FF9900] text-slate-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono ring-2 ring-[#131921]">
                  {wishlistCount}
                </span>
              </div>
              <span className="hidden sm:inline text-xs font-bold pt-1 ml-1">Cart</span>
            </button>

            {/* Admin Lock Button */}
            <button
              onClick={onOpenAdmin}
              title="Admin Portal"
              aria-label="Open Admin Dashboard"
              className="p-2 text-slate-400 hover:text-white rounded hover:ring-1 hover:ring-white transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden text-white rounded hover:bg-slate-800 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED MOBILE SEARCH ROW (Visible below sm breakpoint) */}
      <div ref={mobileSearchRef} className="sm:hidden px-2.5 pb-2.5 bg-[#131921]">
        <form onSubmit={handleSearchSubmit} className="relative flex h-10 rounded-lg overflow-hidden bg-white shadow-sm border border-slate-700/50">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearch(e.target.value, searchCategory !== 'all' ? searchCategory : undefined);
              setIsSearchFocused(true);
            }}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search deals, fashion, brands..."
            className="flex-1 px-3 text-xs text-slate-900 bg-white focus:outline-none min-w-0"
            aria-label="Search Findables deals"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-2.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex items-center justify-center shrink-0 min-h-[40px] min-w-[40px]"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="bg-[#FEBD69] active:bg-[#E2922D] text-slate-900 px-4 flex items-center justify-center cursor-pointer transition-colors shrink-0 min-w-[44px]"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-slate-900 font-bold" />
          </button>
        </form>

        {/* Live Autocomplete Suggestions (Mobile) */}
        {isSearchFocused && suggestions.length > 0 && (
          <div className="absolute left-2.5 right-2.5 mt-1 bg-white text-slate-900 rounded-lg shadow-2xl border border-slate-300 overflow-hidden z-50 divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
            {suggestions.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectProduct(item);
                  setIsSearchFocused(false);
                }}
                className="w-full px-3 py-2.5 text-left active:bg-slate-100 flex items-center justify-between gap-3 text-xs cursor-pointer group min-h-[44px]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                    <AmazonProductImage
                      asin={item.asin}
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 group-hover:text-[#C7511F] truncate text-xs">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {item.brand} · {item.categoryName}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-extrabold text-slate-900 font-mono text-xs">
                    ₹{item.currentPrice.toLocaleString('en-IN')}
                  </div>
                  {item.discountPercent && (
                    <span className="text-[#CC0C39] font-bold text-[10px]">{item.discountPercent}% off</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. THIRD ROW (Amazon Navy Navigation Bar #232F3E) */}
      <div className="bg-[#232F3E] text-white border-t border-slate-700/60 overflow-x-auto scrollbar-none">
        <div className="max-w-[1500px] mx-auto px-2 sm:px-4 flex items-center gap-1 sm:gap-2 h-9 text-xs font-medium whitespace-nowrap">
          {/* "All" Categories Button */}
          <button
            onClick={() => {
              navigateTo('/');
              setTimeout(() => {
                document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer font-bold shrink-0 min-h-[32px]"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </button>

          {/* Today's Deals Link */}
          <button
            onClick={() => {
              navigateTo('/');
              setTimeout(() => {
                document.getElementById('todays-deals-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer flex items-center gap-1 text-[#FF9900] font-bold shrink-0 min-h-[32px]"
          >
            <Flame className="w-3.5 h-3.5 fill-[#FF9900] text-[#FF9900]" />
            <span>Today's Deals</span>
          </button>

          {/* Fashion Primary Hub Link */}
          <button
            onClick={() => navigateTo('/categories/fashion')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer font-bold text-white hover:text-[#FF9900] flex items-center gap-1 shrink-0 min-h-[32px]"
          >
            <Shirt className="w-3.5 h-3.5 text-[#FF9900]" />
            <span>Fashion</span>
          </button>

          {/* Clothes Subcategory Link */}
          <button
            onClick={() => navigateTo('/categories/fashion/clothes')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer text-slate-200 hover:text-white shrink-0 min-h-[32px]"
          >
            Clothes
          </button>

          {/* Sneakers Subcategory Link */}
          <button
            onClick={() => navigateTo('/categories/fashion/sneakers')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer text-slate-200 hover:text-white flex items-center gap-1 shrink-0 min-h-[32px]"
          >
            <Footprints className="w-3.5 h-3.5 text-teal-400" />
            <span>Sneakers</span>
          </button>

          {/* Other Categories */}
          <button
            onClick={() => navigateTo('/categories/tech-electronics')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer text-slate-300 hover:text-white shrink-0 min-h-[32px]"
          >
            Tech &amp; Electronics
          </button>

          <button
            onClick={() => navigateTo('/categories/beauty-personal-care')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer text-slate-300 hover:text-white shrink-0 min-h-[32px]"
          >
            Beauty &amp; Personal Care
          </button>

          <button
            onClick={() => navigateTo('/categories/home-kitchen')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer text-slate-300 hover:text-white shrink-0 min-h-[32px]"
          >
            Home &amp; Kitchen
          </button>

          <button
            onClick={() => navigateTo('/categories/fitness-sports')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer text-slate-300 hover:text-white shrink-0 min-h-[32px]"
          >
            Fitness &amp; Sports
          </button>

          <button
            onClick={() => navigateTo('/categories/student-essentials')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer text-slate-300 hover:text-white shrink-0 min-h-[32px]"
          >
            Student Essentials
          </button>

          {/* Right edge trust note */}
          <div className="ml-auto hidden xl:flex items-center gap-1.5 text-slate-300 text-[11px] pr-2 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF9900]" />
            <span>Amazon India Partner (amazonde0941f-21)</span>
          </div>
        </div>
      </div>

      {/* 4. MOBILE DRAWER WITH BACKDROP OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fadeIn">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Menu Panel */}
          <div className="relative w-full max-w-xs bg-[#131921] h-full shadow-2xl flex flex-col z-10 overflow-y-auto border-r border-slate-700 pb-safe">
            {/* Header / User Greeting & Close */}
            <div className="bg-[#232F3E] p-4 flex items-center justify-between border-b border-slate-700 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9900] to-[#FF7900] flex items-center justify-center font-black text-slate-950 text-base shadow-sm">
                  F
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white">Findables.in</div>
                  <div className="text-[10px] text-slate-300">Find Better. Shop Smarter.</div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700/60 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Delivery Location Quick Bar */}
            <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenLocationModal();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs font-bold text-[#FF9900] cursor-pointer min-h-[40px] text-left"
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate">Deliver to {deliveryLocation}</span>
              </button>
              <button
                onClick={() => {
                  onOpenWishlist();
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs text-white font-bold flex items-center gap-1 cursor-pointer bg-slate-800 px-2 py-1.5 rounded min-h-[36px]"
              >
                <Heart className="w-3.5 h-3.5 text-[#FF9900] fill-[#FF9900]" />
                <span>{wishlistCount}</span>
              </button>
            </div>

            {/* Menu Sections */}
            <div className="p-4 space-y-5 flex-1">
              {/* Popular Highlights */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Top Destinations
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <button
                    onClick={() => {
                      navigateTo('/');
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        document.getElementById('todays-deals-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    }}
                    className="text-left p-3 rounded-lg bg-slate-800 text-[#FF9900] font-bold flex items-center gap-2 cursor-pointer active:bg-slate-700 min-h-[44px]"
                  >
                    <Flame className="w-4 h-4 text-[#FF9900] fill-[#FF9900]" />
                    <span>Today's Deals</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('/categories/fashion');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left p-3 rounded-lg bg-amber-950/40 text-amber-300 font-bold flex items-center gap-2 cursor-pointer border border-amber-800/40 active:bg-amber-900/50 min-h-[44px]"
                  >
                    <Shirt className="w-4 h-4" />
                    <span>Fashion Hub</span>
                  </button>
                </div>
              </div>

              {/* Fashion Subcategories */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Fashion Subcategories
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <button
                    onClick={() => {
                      navigateTo('/categories/fashion/clothes');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left p-2.5 rounded-lg bg-slate-800/60 text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer active:bg-slate-700 min-h-[44px]"
                  >
                    <Shirt className="w-4 h-4 text-amber-400" />
                    <span>Clothes (Men &amp; Women)</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('/categories/fashion/sneakers');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left p-2.5 rounded-lg bg-slate-800/60 text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer active:bg-slate-700 min-h-[44px]"
                  >
                    <Footprints className="w-4 h-4 text-teal-400" />
                    <span>Sneakers &amp; Footwear</span>
                  </button>
                </div>
              </div>

              {/* All Categories */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  All Categories
                </div>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        navigateTo(`/categories/${c.id}`);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left p-2.5 rounded-lg transition-colors cursor-pointer min-h-[44px] flex items-center justify-between ${
                        c.id === 'fashion'
                          ? 'bg-[#FF9900] text-slate-950 font-bold'
                          : 'text-slate-300 hover:bg-slate-800 active:bg-slate-700'
                      }`}
                    >
                      <span>{c.name}</span>
                      {c.itemCount !== undefined && (
                        <span className="text-[10px] opacity-75 font-mono">
                          {c.itemCount} items
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Transparency & Admin */}
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenDisclosure();
                  }}
                  className="w-full text-left p-2 hover:text-white underline cursor-pointer min-h-[40px] flex items-center"
                >
                  Affiliate Disclosure
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full text-left p-2 hover:text-white flex items-center gap-2 cursor-pointer min-h-[40px]"
                >
                  <Lock className="w-4 h-4 text-[#FF9900]" />
                  <span>Admin Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
