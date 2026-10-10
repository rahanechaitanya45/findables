import React from 'react';
import { Sparkles, ArrowRight, Wallet, GraduationCap, Laptop, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface CuratedSectionsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (catId: string) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: (productId: string) => boolean;
}

export const CuratedSections: React.FC<CuratedSectionsProps> = ({
  products,
  onSelectProduct,
  onSelectCategory,
  onToggleWishlist,
  isWishlisted,
}) => {
  // Extract filtered sets
  const under499Products = products.filter((p) => p.currentPrice <= 499 || p.isUnder499).slice(0, 4);
  const techUnder999 = products
    .filter((p) => (p.category === 'tech-gadgets' || p.category === 'electronics') && p.currentPrice <= 999)
    .slice(0, 4);
  const studentEssentials = products
    .filter((p) => p.isStudentEssential || p.category === 'student-essentials')
    .slice(0, 4);

  return (
    <div className="space-y-12 py-6">
      {/* 1. Popular Budget Finds Under ₹499 */}
      {under499Products.length > 0 && (
        <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FF9900] uppercase tracking-wider">
                <Wallet className="w-3.5 h-3.5" />
                <span>Wallet-Friendly Champions</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Popular Under ₹499
              </h2>
              <p className="text-xs text-slate-500">
                Remarkably useful household &amp; everyday tools that cost less than a weekend meal
              </p>
            </div>
            <button
              onClick={() => {
                onSelectCategory('budget-under-499');
                document.getElementById('deals-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-[#FF9900] hover:text-[#e68a00] flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {under499Products.map((product) => (
              <ProductCard
                key={`u499-${product.id}`}
                product={product}
                onSelect={onSelectProduct}
                pageLocation="section_under_499"
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isWishlisted ? isWishlisted(product.id) : false}
              />
            ))}
          </div>
        </section>
      )}

      {/* 2. Tech Finds Under ₹999 */}
      {techUnder999.length > 0 && (
        <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#131921] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 relative z-10">
              <div>
                <span className="text-xs font-semibold text-[#FF9900] uppercase tracking-wider flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Sub-₹1000 Value</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Smart Tech Finds Under ₹999
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Audio gear, RGB desk upgrades, and high-speed wireless accessories
                </p>
              </div>
              <button
                onClick={() => {
                  onSelectCategory('tech-gadgets');
                  document.getElementById('deals-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-bold px-3.5 py-2 bg-[#FF9900] hover:bg-[#e68a00] text-slate-900 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer w-fit font-medium"
              >
                <span>Explore Tech Deals</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 relative z-10">
              {techUnder999.map((product) => (
                <ProductCard
                  key={`tech999-${product.id}`}
                  product={product}
                  onSelect={onSelectProduct}
                  pageLocation="section_tech_under_999"
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={isWishlisted ? isWishlisted(product.id) : false}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Student Essentials */}
      {studentEssentials.length > 0 && (
        <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FF9900] uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>Hostel &amp; College Survival</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Student &amp; Study Essentials
              </h2>
              <p className="text-xs text-slate-500">
                Tested electric kettles, anti-glare study accessories, and anti-theft backpacks
              </p>
            </div>
            <button
              onClick={() => {
                onSelectCategory('student-essentials');
                document.getElementById('deals-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-[#FF9900] hover:text-[#e68a00] flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {studentEssentials.map((product) => (
              <ProductCard
                key={`student-${product.id}`}
                product={product}
                onSelect={onSelectProduct}
                pageLocation="section_student_essentials"
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isWishlisted ? isWishlisted(product.id) : false}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
