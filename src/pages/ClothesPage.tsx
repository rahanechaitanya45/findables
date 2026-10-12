import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  Filter,
  Shirt,
  Sparkles,
  ShieldCheck,
  Search,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { BackButton } from '../components/BackButton';
import { getGreatIndianFestivalUrl } from '../services/affiliate';

interface ClothesPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: (productId: string) => boolean;
  onNavigate: (path: string) => void;
}

export const ClothesPage: React.FC<ClothesPageProps> = ({
  products,
  onSelectProduct,
  onToggleWishlist,
  isWishlisted,
  onNavigate,
}) => {
  const [selectedClothingType, setSelectedClothingType] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('recommended');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // All clothes
  const clothesProducts = useMemo(() => {
    return products.filter((p) => p.category === 'fashion' && p.subCategory === 'clothes');
  }, [products]);

  // Unique brands
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    clothesProducts.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [clothesProducts]);

  // Filtered
  const filteredProducts = useMemo(() => {
    let list = [...clothesProducts];

    // Clothing Type filter
    if (selectedClothingType !== 'all') {
      list = list.filter((p) => p.clothingType === selectedClothingType);
    }

    // Gender filter
    if (selectedGender !== 'all') {
      list = list.filter((p) => p.gender === selectedGender || p.gender === 'unisex');
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      list = list.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Price range filter
    if (selectedPriceRange === 'under499') {
      list = list.filter((p) => p.currentPrice <= 499);
    } else if (selectedPriceRange === 'under999') {
      list = list.filter((p) => p.currentPrice <= 999);
    } else if (selectedPriceRange === '1000to1500') {
      list = list.filter((p) => p.currentPrice >= 1000 && p.currentPrice <= 1500);
    } else if (selectedPriceRange === 'above1500') {
      list = list.filter((p) => p.currentPrice > 1500);
    }

    // Search query
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

    // Sorting
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.currentPrice - a.currentPrice);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else {
      list.sort((a, b) => {
        const scoreA = (a.isDealOfTheDay ? 4 : 0) + (a.isEditorPick ? 3 : 0) + (a.isFeatured ? 2 : 0);
        const scoreB = (b.isDealOfTheDay ? 4 : 0) + (b.isEditorPick ? 3 : 0) + (b.isFeatured ? 2 : 0);
        return scoreB - scoreA;
      });
    }

    return list;
  }, [clothesProducts, selectedClothingType, selectedGender, selectedBrand, selectedPriceRange, searchQuery, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar with Back Button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <BackButton label="Back to Fashion" fallbackPath="/categories/fashion" onNavigate={onNavigate} />
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <button onClick={() => onNavigate('/')} className="hover:text-slate-900 transition-colors cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button onClick={() => onNavigate('/categories/fashion')} className="hover:text-slate-900 transition-colors cursor-pointer">
            Fashion
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#007185] font-bold">Clothes</span>
        </nav>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#C7511F] flex items-center justify-center border border-amber-200/80">
                <Shirt className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Clothes
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Curated men's &amp; women's clothing, essential t-shirts, cotton shirts, denim jeans, ethnic wear, and jackets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-mono">
              {filteredProducts.length} verified styles
            </span>
          </div>
        </div>
      </div>

      {/* Subcategory Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
        {[
          { id: 'all', label: 'All Clothes' },
          { id: 't-shirts-shirts', label: 'T-Shirts & Shirts' },
          { id: 'jeans-trousers', label: 'Jeans & Trousers' },
          { id: 'ethnic', label: 'Ethnic Wear' },
          { id: 'jackets-hoodies', label: 'Jackets & Hoodies' },
          { id: 'essentials', label: 'Everyday Essentials' },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => {
              setSelectedClothingType(type.id);
              setVisibleCount(12);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedClothingType === type.id
                ? 'bg-[#131921] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Filter and Sorting Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full lg:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clothes..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] min-h-[40px]"
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

          {/* Filters Group */}
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-start lg:justify-end text-xs">
            {/* Gender Filter */}
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="flex-1 sm:flex-initial bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none cursor-pointer min-h-[38px]"
            >
              <option value="all">Gender: All</option>
              <option value="men">Men's Clothing</option>
              <option value="women">Women's Clothing</option>
            </select>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="flex-1 sm:flex-initial bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none cursor-pointer min-h-[38px]"
            >
              <option value="all">All Brands</option>
              {availableBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            {/* Price Filter */}
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="flex-1 sm:flex-initial bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none cursor-pointer min-h-[38px]"
            >
              <option value="all">Price: All</option>
              <option value="under499">Under ₹499</option>
              <option value="under999">Under ₹999</option>
              <option value="1000to1500">₹1,000 - ₹1,500</option>
              <option value="above1500">Above ₹1,500</option>
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 sm:flex-initial bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none cursor-pointer min-h-[38px]"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div>
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {clothesProducts.length === 0
                  ? 'No clothing items currently in the catalog'
                  : 'No clothing items found matching your filters'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                {clothesProducts.length === 0
                  ? 'All previous product listings have been removed. Explore verified apparel collections directly on Amazon India.'
                  : 'Try adjusting or resetting your brand, price, or category selections.'}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {clothesProducts.length > 0 ? (
                <button
                  onClick={() => {
                    setSelectedClothingType('all');
                    setSelectedGender('all');
                    setSelectedBrand('all');
                    setSelectedPriceRange('all');
                    setSearchQuery('');
                  }}
                  className="bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-slate-800 cursor-pointer min-h-[44px]"
                >
                  Reset All Filters
                </button>
              ) : (
                <a
                  href={getGreatIndianFestivalUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#FFD814] text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-lg hover:bg-[#F7CA00] cursor-pointer shadow-xs border border-[#FCD200] min-h-[44px]"
                >
                  <span>Explore Clothes on Amazon India</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isWishlisted ? isWishlisted(product.id) : false}
                pageLocation="clothes_page"
              />
            ))}
          </div>
        )}

        {/* Incremental Loading / Pagination */}
        {hasMore && (
          <div className="text-center pt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs px-6 py-2.5 rounded-lg shadow-2xs hover:shadow-xs transition-all cursor-pointer min-h-[44px]"
            >
              Load More Clothes ({filteredProducts.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
