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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.pathname = path;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#131921] text-white shadow-md select-none">
      {/* 1. TOP ROW: Brand, Location, Search, Language, Account, Cart */}
      <div className="max-w-[1500px] mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-15 gap-2 sm:gap-4">
          {/* Logo Zone */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                navigateTo('/');
                onSelectCategory('all');
                onSearch('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-0.5 px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer group text-left"
            >
              <div className="flex items-baseline">
                <span className="font-extrabold text-2xl tracking-tighter text-white">amazon</span>
                <span className="text-[#FF9900] text-xs font-bold ml-0.5">.in</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF9900] ml-1 group-hover:scale-125 transition-transform" />
            </button>
          </div>

          {/* Location Delivery Selector (Desktop) */}
          <button
            onClick={onOpenLocationModal}
            className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all text-left cursor-pointer shrink-0"
            title="Change Indian delivery location"
          >
            <MapPin className="w-4 h-4 text-white mt-1 shrink-0" />
            <div className="leading-tight">
              <div className="text-[11px] text-slate-300">Deliver to</div>
              <div className="text-xs font-bold text-white truncate max-w-[110px]">
                {deliveryLocation || 'India'}
              </div>
            </div>
          </button>

          {/* Search Bar Zone */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-3xl">
            <form onSubmit={handleSearchSubmit} className="flex h-9 sm:h-10 rounded-md overflow-hidden bg-white shadow-inner">
              {/* Category Dropdown */}
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="hidden sm:block bg-[#F3F3F3] hover:bg-[#DADADA] text-[#0F1111] text-xs px-2.5 border-r border-slate-300 font-medium focus:outline-none cursor-pointer shrink-0 max-w-[140px]"
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
                placeholder="Search Amazon Deals, Fashion, Sneakers &amp; Clothing..."
                className="flex-1 px-3 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none"
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#FEBD69] hover:bg-[#F3A847] active:bg-[#E2922D] text-slate-900 px-3.5 sm:px-5 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                aria-label="Submit search"
              >
                <Search className="w-4 h-4 text-slate-900 font-bold" />
              </button>
            </form>

            {/* Live Autocomplete Suggestions */}
            {isSearchFocused && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white text-slate-900 rounded-md shadow-2xl border border-slate-300 overflow-hidden z-50 divide-y divide-slate-100">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectProduct(item);
                      setIsSearchFocused(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between gap-3 text-xs cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded bg-slate-50 border border-slate-200 p-0.5 shrink-0">
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

          {/* Region / Language Badge (Desktop) */}
          <div className="hidden xl:flex items-center gap-1 px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer">
            <span className="text-sm">🇮🇳</span>
            <span className="text-xs font-bold text-white">EN</span>
          </div>

          {/* Account / Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all text-left cursor-pointer shrink-0"
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
            className="hidden lg:flex items-center px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all text-left cursor-pointer shrink-0"
          >
            <div className="leading-tight">
              <div className="text-[11px] text-slate-300">Affiliate Info</div>
              <div className="text-xs font-bold text-white">Returns &amp; Deals</div>
            </div>
          </button>

          {/* Cart Icon with Live Item Count */}
          <button
            onClick={onOpenWishlist}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded hover:ring-1 hover:ring-white transition-all text-white relative cursor-pointer shrink-0"
            aria-label="Open Deals Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
              <span className="absolute -top-1 left-3 sm:left-3.5 bg-[#FF9900] text-slate-950 text-[10px] sm:text-xs font-extrabold w-4 sm:w-5 h-4 sm:h-5 rounded-full flex items-center justify-center font-mono">
                {wishlistCount}
              </span>
            </div>
            <span className="hidden sm:inline text-xs font-bold pt-2">Cart</span>
          </button>

          {/* Admin Lock Button */}
          <button
            onClick={onOpenAdmin}
            title="Admin Portal"
            className="p-1.5 text-slate-400 hover:text-white rounded hover:ring-1 hover:ring-white transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 md:hidden text-white rounded hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 2. SECOND ROW (Amazon Navy Navigation Bar #232F3E) */}
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
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer font-bold shrink-0"
          >
            <Menu className="w-4 h-4" />
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
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer flex items-center gap-1 text-[#FF9900] font-bold shrink-0"
          >
            <Flame className="w-3.5 h-3.5 fill-[#FF9900] text-[#FF9900]" />
            <span>Today's Deals</span>
          </button>

          {/* Fashion Primary Hub Link */}
          <button
            onClick={() => navigateTo('/categories/fashion')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer font-bold text-white hover:text-[#FF9900] flex items-center gap-1 shrink-0"
          >
            <Shirt className="w-3.5 h-3.5 text-[#FF9900]" />
            <span>Fashion</span>
          </button>

          {/* Clothes Subcategory Link */}
          <button
            onClick={() => navigateTo('/categories/fashion/clothes')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer text-slate-200 hover:text-white shrink-0"
          >
            Clothes
          </button>

          {/* Sneakers Subcategory Link */}
          <button
            onClick={() => navigateTo('/categories/fashion/sneakers')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer text-slate-200 hover:text-white flex items-center gap-1 shrink-0"
          >
            <Footprints className="w-3.5 h-3.5 text-teal-400" />
            <span>Sneakers</span>
          </button>

          {/* Other Categories */}
          <button
            onClick={() => navigateTo('/categories/tech-electronics')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer text-slate-300 hover:text-white shrink-0"
          >
            Tech &amp; Electronics
          </button>

          <button
            onClick={() => navigateTo('/categories/beauty-personal-care')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer text-slate-300 hover:text-white shrink-0"
          >
            Beauty &amp; Personal Care
          </button>

          <button
            onClick={() => navigateTo('/categories/home-kitchen')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer text-slate-300 hover:text-white shrink-0"
          >
            Home &amp; Kitchen
          </button>

          <button
            onClick={() => navigateTo('/categories/fitness-sports')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer text-slate-300 hover:text-white shrink-0"
          >
            Fitness &amp; Sports
          </button>

          <button
            onClick={() => navigateTo('/categories/student-essentials')}
            className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer text-slate-300 hover:text-white shrink-0"
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

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#131921] border-t border-slate-700 px-4 py-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <button
              onClick={() => {
                onOpenLocationModal();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-bold text-[#FF9900] cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Deliver to {deliveryLocation}</span>
            </button>
            <button
              onClick={() => {
                onOpenWishlist();
                setIsMobileMenuOpen(false);
              }}
              className="text-xs text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-[#FF9900]" />
              <span>Wishlist ({wishlistCount})</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Popular Destinations
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  navigateTo('/');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('todays-deals-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className="text-left p-2.5 rounded bg-slate-800/90 text-[#FF9900] font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-[#FF9900]" />
                <span>Today's Deals</span>
              </button>

              <button
                onClick={() => {
                  navigateTo('/categories/fashion');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left p-2.5 rounded bg-amber-900/30 text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer border border-amber-800/40"
              >
                <Shirt className="w-4 h-4" />
                <span>Fashion Hub</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Fashion Subcategories
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  navigateTo('/categories/fashion/clothes');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left p-2 rounded bg-slate-800/60 text-slate-200 hover:text-white cursor-pointer"
              >
                👔 Clothes (Men &amp; Women)
              </button>

              <button
                onClick={() => {
                  navigateTo('/categories/fashion/sneakers');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left p-2 rounded bg-slate-800/60 text-slate-200 hover:text-white cursor-pointer"
              >
                👟 Sneakers &amp; Footwear
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              All Categories
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    navigateTo(`/categories/${c.id}`);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left p-2 rounded transition-colors cursor-pointer ${
                    c.id === 'fashion'
                      ? 'bg-[#FF9900] text-slate-950 font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenDisclosure();
              }}
              className="hover:text-white underline cursor-pointer"
            >
              Affiliate Disclosure
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
