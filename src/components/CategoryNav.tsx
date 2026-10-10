import React from 'react';
import {
  Smartphone,
  Sparkles,
  Home,
  Watch,
  Activity,
  GraduationCap,
  Gamepad2,
  Cpu,
  Luggage,
  Tag,
  Grid,
} from 'lucide-react';
import { Category } from '../types';

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
}

// Map Lucide icons safely
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  Sparkles,
  Home,
  Watch,
  Activity,
  GraduationCap,
  Gamepad2,
  Cpu,
  Luggage,
  Tag,
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories-section" className="py-6 bg-white border-b border-slate-200 select-none">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Shop by Category</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Handpicked collections tailored for fast mobile and desktop browsing
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#131921] text-white border-[#131921]'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const Icon = iconMap[cat.iconName] || Tag;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  document.getElementById('deals-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-[#131921] border-[#131921] text-white shadow-md'
                    : 'bg-[#F8FAFC] border-slate-200 text-slate-800 hover:border-[#FF9900] hover:bg-white hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#FF9900] text-slate-900 font-bold'
                        : 'bg-white text-slate-700 border border-slate-200 group-hover:text-[#FF9900] group-hover:border-[#FF9900]/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {cat.itemCount && (
                    <span
                      className={`text-[11px] font-mono tabular-nums ${
                        isSelected ? 'text-slate-400' : 'text-slate-400'
                      }`}
                    >
                      {cat.itemCount}+
                    </span>
                  )}
                </div>

                <div>
                  <div
                    className={`text-xs font-bold leading-tight ${
                      isSelected ? 'text-white' : 'text-slate-900 group-hover:text-[#C7511F]'
                    }`}
                  >
                    {cat.name}
                  </div>
                  <div
                    className={`text-[11px] line-clamp-1 mt-0.5 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {cat.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
