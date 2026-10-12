import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  Shirt,
  Footprints,
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { BackButton } from '../components/BackButton';
import { getGreatIndianFestivalUrl } from '../services/affiliate';

interface FashionPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: (productId: string) => boolean;
  onNavigate: (path: string) => void;
}

export const FashionPage: React.FC<FashionPageProps> = ({
  products,
  onSelectProduct,
  onToggleWishlist,
  isWishlisted,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<'all' | 'clothes' | 'sneakers'>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating'>('recommended');

  // Filter fashion products
  const fashionProducts = useMemo(() => {
    return products.filter((p) => p.category === 'fashion');
  }, [products]);

  const clothesCount = useMemo(() => {
    return fashionProducts.filter((p) => p.subCategory === 'clothes').length;
  }, [fashionProducts]);

  const sneakersCount = useMemo(() => {
    return fashionProducts.filter((p) => p.subCategory === 'sneakers').length;
  }, [fashionProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...fashionProducts];

    if (selectedSubCategory !== 'all') {
      list = list.filter((p) => p.subCategory === selectedSubCategory);
    }

    if (selectedGender !== 'all') {
      list = list.filter((p) => p.gender === selectedGender || p.gender === 'unisex');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.asin.toLowerCase().includes(q) ||
          p.editorialOneLiner.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.currentPrice - a.currentPrice);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      list.sort((a, b) => {
        const scoreA = (a.isDealOfTheDay ? 4 : 0) + (a.isEditorPick ? 3 : 0) + (a.isFeatured ? 2 : 0);
        const scoreB = (b.isDealOfTheDay ? 4 : 0) + (b.isEditorPick ? 3 : 0) + (b.isFeatured ? 2 : 0);
        return scoreB - scoreA;
      });
    }

    return list;
  }, [fashionProducts, selectedSubCategory, selectedGender, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* Navigation Top Bar with Back Button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <BackButton label="Back to Home" fallbackPath="/" onNavigate={onNavigate} />
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Categories</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#007185] font-bold">Fashion</span>
        </nav>
      </div>

      {/* Fashion Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#131921] via-[#232F3E] to-[#131921] text-white p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#FF9900] text-slate-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collection</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Fashion Finds
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Discover clothing and sneakers worth checking out. Handpicked from Amazon India for everyday comfort, quality fabric, and genuine deal value.
          </p>

          <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Amazon India ASINs
            </span>
            <span>·</span>
            <span>{fashionProducts.length} verified listings</span>
          </div>
        </div>
      </div>

      {/* Two Prominent Subcategory Cards: Clothes & Sneakers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* A. Clothes Card */}
        <div
          onClick={() => onNavigate('/categories/fashion/clothes')}
          className="group relative overflow-hidden rounded-xl bg-white border border-slate-200/90 hover:border-[#FF9900] shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C7511F] flex items-center justify-center border border-amber-200/80 group-hover:scale-105 transition-transform">
                <Shirt className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                {clothesCount} Styles
              </span>
            </div>

            <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-[#C7511F] transition-colors">
              Clothes
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Men's &amp; women's t-shirts, cotton casual shirts, stretch denim jeans, festive ethnic kurti sets, and lightweight jackets.
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-slate-600">
              <span className="bg-slate-100 px-2 py-0.5 rounded">T-Shirts &amp; Shirts</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">Jeans &amp; Trousers</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">Ethnic Wear</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">Jackets &amp; Hoodies</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#007185] group-hover:text-[#C7511F]">
            <span>Explore Clothes Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* B. Sneakers Card */}
        <div
          onClick={() => onNavigate('/categories/fashion/sneakers')}
          className="group relative overflow-hidden rounded-xl bg-white border border-slate-200/90 hover:border-[#FF9900] shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/80 group-hover:scale-105 transition-transform">
                <Footprints className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                {sneakersCount} Styles
              </span>
            </div>

            <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-[#C7511F] transition-colors">
              Sneakers
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Clean court casual sneakers, lightweight running shoes, everyday walking kicks, and budget footwear from Puma, Campus, Red Tape &amp; Sparx.
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-slate-600">
              <span className="bg-slate-100 px-2 py-0.5 rounded">Casual Streetwear</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">Running Shoes</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">Everyday Footwear</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">Budget Under ₹999</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#007185] group-hover:text-[#C7511F]">
            <span>Explore Sneakers Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Field */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fashion by brand, title..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent min-h-[40px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Subcategory & Gender & Sort Chips */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
            {/* SubCategory Tabs */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold overflow-x-auto scrollbar-none w-full sm:w-auto">
              <button
                onClick={() => setSelectedSubCategory('all')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-colors cursor-pointer min-h-[36px] text-center ${
                  selectedSubCategory === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Fashion
              </button>
              <button
                onClick={() => setSelectedSubCategory('clothes')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-colors cursor-pointer min-h-[36px] text-center ${
                  selectedSubCategory === 'clothes' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Clothes
              </button>
              <button
                onClick={() => setSelectedSubCategory('sneakers')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-colors cursor-pointer min-h-[36px] text-center ${
                  selectedSubCategory === 'sneakers' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sneakers
              </button>
            </div>

            {/* Gender Filter */}
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as any)}
              className="flex-1 sm:flex-initial text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none cursor-pointer min-h-[38px]"
            >
              <option value="all">All Genders</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 sm:flex-initial text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none cursor-pointer min-h-[38px]"
            >
              <option value="recommended">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fashion Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-600">
            Showing {filteredProducts.length} Fashion Products
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#007185] hover:underline"
            >
              Clear search filter
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {fashionProducts.length === 0
                  ? 'No fashion products currently in the catalog'
                  : 'No fashion products match your criteria'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                {fashionProducts.length === 0
                  ? 'All previous product listings have been removed. You can browse live fashion deals and trending styles directly on Amazon India.'
                  : 'Try adjusting your search keywords or resetting your subcategory and gender filters.'}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {fashionProducts.length > 0 ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubCategory('all');
                    setSelectedGender('all');
                  }}
                  className="bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-slate-800 cursor-pointer min-h-[44px]"
                >
                  Reset Filters
                </button>
              ) : (
                <a
                  href={getGreatIndianFestivalUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#FFD814] text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-lg hover:bg-[#F7CA00] cursor-pointer shadow-xs border border-[#FCD200] min-h-[44px]"
                >
                  <span>Explore Amazon Great Indian Festival</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isWishlisted ? isWishlisted(product.id) : false}
                pageLocation="fashion_hub"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
