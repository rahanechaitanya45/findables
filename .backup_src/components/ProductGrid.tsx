import React, { useState, useMemo } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  categories?: Category[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: (productId: string) => boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
  onSelectProduct,
  onToggleWishlist,
  isWishlisted,
}) => {
  const activeCategoryName = categories?.find((c) => c.id === selectedCategory)?.name || products[0]?.categoryName || selectedCategory;
  const [priceFilter, setPriceFilter] = useState<'all' | 'under499' | 'under999' | '1000to2500' | 'above2500'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating'>('recommended');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  // Extract unique brands
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [products]);

  // Apply filters and sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (priceFilter === 'under499') {
      result = result.filter((p) => p.currentPrice <= 499);
    } else if (priceFilter === 'under999') {
      result = result.filter((p) => p.currentPrice <= 999);
    } else if (priceFilter === '1000to2500') {
      result = result.filter((p) => p.currentPrice >= 1000 && p.currentPrice <= 2500);
    } else if (priceFilter === 'above2500') {
      result = result.filter((p) => p.currentPrice > 2500);
    }

    if (selectedBrand !== 'all') {
      result = result.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.currentPrice - a.currentPrice);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      result.sort((a, b) => {
        const scoreA = (a.isEditorPick ? 3 : 0) + (a.isTrending ? 2 : 0);
        const scoreB = (b.isEditorPick ? 3 : 0) + (b.isTrending ? 2 : 0);
        return scoreB - scoreA;
      });
    }

    return result;
  }, [products, priceFilter, selectedBrand, sortBy]);

  const hasActiveFilters = priceFilter !== 'all' || selectedBrand !== 'all' || searchQuery !== '' || selectedCategory !== 'all';

  const resetAllFilters = () => {
    setPriceFilter('all');
    setSelectedBrand('all');
    onSelectCategory('all');
    onClearSearch();
  };

  return (
    <section id="deals-section" className="py-6 max-w-[1500px] mx-auto px-2 sm:px-4">
      {/* Top Bar with Filter Summary */}
      <div className="bg-white rounded-lg p-3 sm:p-4 mb-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-slate-500 font-medium">
            1-{filteredProducts.length} of {products.length} results
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : selectedCategory !== 'all'
              ? `Featured Deals in ${activeCategoryName}`
              : 'All Verified Amazon India Deals'}
          </h2>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Price Quick Segment */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
            <button
              onClick={() => setPriceFilter('all')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                priceFilter === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              All Prices
            </button>
            <button
              onClick={() => setPriceFilter('under499')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                priceFilter === 'under499' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Under ₹499
            </button>
            <button
              onClick={() => setPriceFilter('under999')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                priceFilter === 'under999' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Under ₹999
            </button>
          </div>

          {/* Brand select */}
          {availableBrands.length > 1 && (
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="text-xs bg-white border border-slate-300 text-slate-800 rounded px-2.5 py-1.5 focus:border-[#FF9900] focus:outline-none"
            >
              <option value="all">All Brands</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          )}

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-white border border-slate-300 text-slate-800 rounded px-2.5 py-1.5 focus:border-[#FF9900] focus:outline-none"
          >
            <option value="recommended">Sort by: Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-[#CC0C39] hover:underline p-1 flex items-center gap-1 cursor-pointer font-bold"
              title="Clear all active filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              pageLocation="main_deals_grid"
              onToggleWishlist={onToggleWishlist}
              isWishlisted={isWishlisted ? isWishlisted(product.id) : false}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center max-w-lg mx-auto my-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No matching Amazon deals found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your price range filter or resetting the category selection.
            </p>
          </div>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-950 text-xs font-bold rounded-lg border border-[#FCD200] cursor-pointer"
          >
            Reset Filters &amp; View All Deals
          </button>
        </div>
      )}
    </section>
  );
};
