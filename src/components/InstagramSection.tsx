import React from 'react';
import { Instagram, ArrowUpRight, Smartphone, Search, ShoppingBag } from 'lucide-react';

interface InstagramSectionProps {
  instagramHandle?: string;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({
  instagramHandle = '@amazondeals.in',
}) => {
  return (
    <section className="py-12 bg-[#131921] text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold">
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram Community Special</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Visiting From My Instagram Bio?
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Every product featured in my recent Reels and Stories is cataloged right here with direct, verified Amazon India links. No broken link-in-bio redirect trees or spam ads.
              </p>

              {/* 3 Step Quick Guide */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                  <div className="text-[#FF7900] font-bold mb-1">Step 1</div>
                  <div className="text-slate-200">Search product name or keyword from the Reel caption.</div>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                  <div className="text-[#FF7900] font-bold mb-1">Step 2</div>
                  <div className="text-slate-200">Read honest pros, cons, and current Indian market pricing.</div>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                  <div className="text-[#FF7900] font-bold mb-1">Step 3</div>
                  <div className="text-slate-200">Tap &ldquo;View Deal&rdquo; to open Amazon India directly with Prime delivery.</div>
                </div>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="md:col-span-4 bg-slate-800/80 border border-slate-700 p-6 rounded-xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 mx-auto flex items-center justify-center shadow-lg">
                <Instagram className="w-6 h-6 text-white" />
              </div>

              <div>
                <div className="text-base font-bold text-white">Follow on Instagram</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{instagramHandle}</div>
              </div>

              <p className="text-xs text-slate-300">
                New sub-₹500 finds and lightning deal alerts posted 4x a week in Stories!
              </p>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-[#0B1220] font-bold text-xs rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 shadow"
              >
                <span>Visit Instagram Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#FF7900]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
