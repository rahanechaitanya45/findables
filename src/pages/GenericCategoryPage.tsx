import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  Clock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Home,
  Activity,
  GraduationCap,
  Sparkles,
  Tag,
  SlidersHorizontal,
} from 'lucide-react';
import { Category, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { BackButton } from '../components/BackButton';
import { getGreatIndianFestivalUrl } from '../services/affiliate';

interface GenericCategoryPageProps {
  category: Category;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: (id: string) => boolean;
  onNavigate: (path: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  Sparkles,
  Home,
  Activity,
  GraduationCap,
};

export const GenericCategoryPage: React.FC<GenericCategoryPageProps> = ({
  category,
  products = [],
  onSelectProduct,
  onToggleWishlist,
  isWishlisted,
  onNavigate,
}) => {
  const Icon = iconMap[category.iconName] || Tag;
  const festivalUrl = getGreatIndianFestivalUrl();
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');

  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category === category.id && p.published);
  }, [products, category.id]);

  const sortedProducts = useMemo(() => {
    const list = [...categoryProducts];
    if (sortBy === 'price_low') return list.sort((a, b) => a.currentPrice - b.currentPrice);
    if (sortBy === 'price_high') return list.sort((a, b) => b.currentPrice - a.currentPrice);
    if (sortBy === 'rating') return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [categoryProducts, sortBy]);

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar with Back Button */}
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
          <span className="text-[#007185] font-bold">{category.name}</span>
        </nav>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#131921] text-[#FF9900] flex items-center justify-center shadow-xs">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {category.name}
                </h1>
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {categoryProducts.length} {categoryProducts.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {category.description}
              </p>
            </div>
          </div>

          <a
            href={festivalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-950 font-bold text-xs rounded-lg border border-[#FCD200] shadow-xs cursor-pointer transition-colors shrink-0"
          >
            <span>Explore Great Indian Festival</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {categoryProducts.length > 0 ? (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-600 font-medium">
              Showing <strong className="text-slate-900">{sortedProducts.length}</strong> verified Amazon India products
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <label htmlFor="sort-select" className="text-slate-500 whitespace-nowrap">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-semibold cursor-pointer outline-none focus:border-[#FF9900] min-h-[38px]"
              >
                <option value="featured">Featured / Curated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {sortedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={(p) => onSelectProduct?.(p)}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isWishlisted?.(prod.id)}
                pageLocation={`category_${category.id}`}
              />
            ))}
          </div>

          {/* Disclaimer Footer */}
          <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>All items verified directly with authentic Amazon India links (amazonde0941f-21)</span>
          </div>
        </div>
      ) : (
        /* Clean "In Curation" / Coming Soon Card */
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-8 text-center space-y-5 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-[#FF9900] flex items-center justify-center mx-auto border border-amber-200">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="bg-[#FF9900]/15 text-[#9C5D00] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Catalog In Curation
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              {category.name} is Getting Ready
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
              Our editorial team is verifying authentic Amazon India ASINs, live lightning deals, and seller ratings for this category. In the meantime, explore our active Fashion collection or Today's Deals.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/categories/fashion')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#131921] hover:bg-[#232F3E] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              <span>Explore Fashion Hub</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FF9900]" />
            </button>

            <a
              href={festivalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-950 text-xs font-bold px-5 py-2.5 rounded-lg border border-[#FCD200] shadow-xs cursor-pointer transition-colors"
            >
              <span>Browse Festival Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>No unverified placeholder products displayed</span>
          </div>
        </div>
      )}
    </div>
  );
};
