import React from 'react';
import {
  Shirt,
  Smartphone,
  Sparkles,
  Home,
  Activity,
  GraduationCap,
  ArrowRight,
  Sparkle,
  Tag,
} from 'lucide-react';
import { Category } from '../types';

interface ShopByCategoriesProps {
  categories: Category[];
  onNavigate: (path: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shirt,
  Smartphone,
  Sparkles,
  Home,
  Activity,
  GraduationCap,
};

export const ShopByCategories: React.FC<ShopByCategoriesProps> = ({
  categories,
  onNavigate,
}) => {
  return (
    <section className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Shop by Categories
            </h2>
            <span className="bg-[#FF9900]/15 text-[#9C5D00] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Browse
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore curated finds from Amazon India with verified prices &amp; direct links
          </p>
        </div>

        <button
          onClick={() => onNavigate('/categories/fashion')}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer transition-colors"
        >
          <span>Explore Fashion Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Tiles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
        {categories.map((cat) => {
          const Icon = iconMap[cat.iconName] || Tag;
          const isFashion = cat.id === 'fashion';

          return (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/categories/${cat.id}`)}
              className={`group relative rounded-xl p-3 sm:p-4 border transition-all duration-200 flex flex-col justify-between cursor-pointer min-w-0 ${
                isFashion
                  ? 'bg-gradient-to-b from-amber-50/70 to-white border-amber-300/80 shadow-xs hover:border-[#FF9900] hover:shadow-md'
                  : 'bg-slate-50/60 hover:bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {isFashion && (
                <div className="absolute -top-2.5 right-2 bg-[#CC0C39] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider flex items-center gap-0.5">
                  <Sparkle className="w-2.5 h-2.5" />
                  <span>Featured</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isFashion
                        ? 'bg-[#131921] text-[#FF9900] shadow-xs group-hover:scale-105'
                        : 'bg-white text-slate-700 border border-slate-200 group-hover:text-slate-900 group-hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {cat.itemCount !== undefined && cat.itemCount > 0 ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 font-mono">
                      {cat.itemCount} items
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      Coming soon
                    </span>
                  )}
                </div>

                <h3
                  className={`text-xs sm:text-sm font-bold leading-snug transition-colors ${
                    isFashion
                      ? 'text-slate-900 group-hover:text-[#C7511F]'
                      : 'text-slate-800 group-hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </h3>

                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-normal">
                  {cat.description}
                </p>
              </div>

              {/* Subcategories quick badges for Fashion */}
              {isFashion && (
                <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center gap-1.5 flex-wrap">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('/categories/fashion/clothes');
                    }}
                    className="text-[10px] font-bold bg-white text-slate-800 hover:text-[#C7511F] hover:bg-amber-100/60 px-2 py-0.5 rounded border border-amber-200 shadow-2xs transition-colors cursor-pointer"
                  >
                    Clothes →
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('/categories/fashion/sneakers');
                    }}
                    className="text-[10px] font-bold bg-white text-slate-800 hover:text-[#C7511F] hover:bg-amber-100/60 px-2 py-0.5 rounded border border-amber-200 shadow-2xs transition-colors cursor-pointer"
                  >
                    Sneakers →
                  </span>
                </div>
              )}

              {!isFashion && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500 group-hover:text-slate-800">
                  <span>View page</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
