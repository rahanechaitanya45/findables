import React from 'react';
import { ShieldCheck, Sparkles, Filter, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { AMAZON_ASSOCIATE_TAG } from '../services/affiliate';

interface TrustSectionProps {
  onOpenDisclosure: () => void;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ onOpenDisclosure }) => {
  return (
    <section id="findables-mission" className="my-6 sm:my-8 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-10 shadow-xs select-none">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header with Brand & Mission */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#FF9900]/15 text-[#C7511F] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Shopping Discovery</span>
          </div>

          <h2 className="text-xl min-[400px]:text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight break-words">
            Findables &mdash; <span className="text-[#C7511F]">Find Better. Shop Smarter.</span>
          </h2>

          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Findables is your smart shopping discovery platform that brings quality products from multiple e-commerce websites into one place. We filter through countless listings to help you discover top-rated products, trusted choices, and value-for-money deals from platforms like <strong>Amazon</strong>, <strong>Flipkart</strong>, <strong>Myntra</strong>, <strong>Meesho</strong>, and more.
          </p>
        </div>

        {/* Mission Highlight Banner */}
        <div className="bg-gradient-to-r from-[#0d131a] via-[#1a2332] to-[#232F3E] text-white rounded-xl p-4 sm:p-8 shadow-md relative overflow-hidden border border-slate-800">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold text-[#FF9900] uppercase tracking-wider block">
                Our Mission
              </span>
              <h3 className="text-base sm:text-xl font-extrabold text-white leading-snug">
                Save your time, simplify your choices, and improve your shopping experience.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Instead of endlessly scrolling through products, find the ones worth considering with Findables.
              </p>
            </div>

            <div className="shrink-0 bg-white/10 backdrop-blur-xs border border-white/20 p-3.5 sm:p-4 rounded-xl text-center md:text-right">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#FF9900] uppercase tracking-wider block">
                The Findables Mantra
              </span>
              <div className="text-xs sm:text-base font-extrabold text-white mt-1">
                Less searching. Better choices. Smarter shopping.
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Findables Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Pillar 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6 space-y-2.5 sm:space-y-3 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#FF7900] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-[#FF7900]" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Save Your Time
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Skip hundreds of identical listings and confusing algorithms. We pre-screen products for genuine build quality, positive customer feedback, and everyday reliability.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Filter className="w-5 h-5 text-blue-700" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Simplify Your Choices
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every curated card provides straight-to-the-point editorial summaries, verified price history insights, honest pros and cons, and clear recommendations.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Multi-Platform Intelligence
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Universal architecture bringing together verified deals and festival offers across Amazon India, Flipkart, Myntra, and Meesho under a unified, trusted interface.
            </p>
          </div>
        </div>

        {/* Affiliate Disclosure Stripe */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Findables earns referral commissions from qualifying purchases made through partner links at <strong>zero extra cost to you</strong>.
            </span>
          </div>
          <button
            onClick={onOpenDisclosure}
            className="text-xs font-semibold text-[#007185] hover:text-[#C7511F] hover:underline whitespace-nowrap cursor-pointer shrink-0"
          >
            Read Affiliate Disclosure &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};
