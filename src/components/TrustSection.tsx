import React from 'react';
import { CheckCircle2, ShieldCheck, HeartHandshake, Eye, ExternalLink } from 'lucide-react';
import { AMAZON_ASSOCIATE_TAG } from '../services/affiliate';

interface TrustSectionProps {
  onOpenDisclosure: () => void;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ onOpenDisclosure }) => {
  return (
    <section id="why-recommend" className="py-12 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#FF7900] uppercase tracking-wider">
            Integrity First
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] mt-1">
            Why I Recommend These Products
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            No sponsored brand scripts or fake reviews. Here is how and why products are selected for the Amazon curated community.
          </p>
        </div>

        {/* 3 Core Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#FF7900] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-[#0B1220]">
              Useful Picks
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every item is chosen for real practicality, long-term durability, and genuine value for money in Indian households, hostels, or work desks.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-[#0B1220]">
              Honest Recommendations
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every card lists honest drawbacks, real trade-offs, and who the item is actually suited for—so you never regret an impulse buy.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-base font-bold text-[#0B1220]">
              Transparent Affiliate Links
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When you purchase via my Amazon India links, Amazon pays a modest referral commission at zero extra cost to you. This keeps this platform independent and ad-free.
            </p>
          </div>
        </div>

        {/* Visible Amazon Associates Disclosure Callout */}
        <div className="mt-8 bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#FF7900] shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-slate-100">Official Amazon Associates Disclosure</span>
              <p className="text-slate-300">
                &ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo; Tracking Tag: <code className="text-[#FF7900] font-mono font-semibold">{AMAZON_ASSOCIATE_TAG}</code>
              </p>
            </div>
          </div>
          <button
            onClick={onOpenDisclosure}
            className="text-xs text-slate-300 hover:text-white underline decoration-slate-500 whitespace-nowrap self-start sm:self-center"
          >
            Read Full Disclosure Statement &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};
