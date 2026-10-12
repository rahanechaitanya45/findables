import React from 'react';
import { Lock, Globe, ArrowUp } from 'lucide-react';
import { AMAZON_ASSOCIATE_TAG } from '../services/affiliate';

interface FooterProps {
  onOpenDisclosure: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDisclosure,
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#131921] text-white text-xs select-none">
      {/* 1. Back to Top Bar */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#485769] text-white py-4 text-center text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
      >
        <ArrowUp className="w-4 h-4" />
        <span>Back to top</span>
      </button>

      {/* 2. Findables Mission Statement Card */}
      <div className="bg-[#1a2332] py-8 px-4 sm:px-8 border-b border-[#2d3a4d]">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF9900] to-[#FF7900] flex items-center justify-center font-black text-slate-950 text-sm shadow-sm">
                F
              </div>
              <span className="font-extrabold text-lg text-white">Findables</span>
              <span className="text-[#FF9900] text-xs font-bold -ml-1">.in</span>
              <span className="text-slate-500">·</span>
              <span className="text-xs font-semibold text-slate-300">Find Better. Shop Smarter.</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Findables is your smart shopping discovery platform that brings quality products from multiple e-commerce websites into one place. We filter through countless listings to help you discover top-rated products, trusted choices, and value-for-money deals from platforms like Amazon, Flipkart, Myntra, Meesho, and more.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our mission is simple: <strong className="text-slate-200">save your time, simplify your choices, and improve your shopping experience.</strong> Instead of endlessly scrolling through products, find the ones worth considering with Findables.
            </p>
          </div>
          <div className="text-center md:text-right shrink-0 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
            <span className="text-[11px] font-bold text-[#FF9900] uppercase tracking-wider block">Findables Promise</span>
            <div className="text-sm font-extrabold text-white mt-0.5">Less searching. Better choices. Smarter shopping.</div>
            <div className="text-[10px] text-slate-400 mt-1">Multi-platform discovery hub</div>
          </div>
        </div>
      </div>

      {/* 3. Middle Brand & Country Stripe */}
      <div className="bg-[#232F3E] py-6 px-4 border-b border-[#3a4553]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={scrollToTop}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF9900] to-[#FF7900] flex items-center justify-center font-black text-slate-950 text-base shadow-sm">
              F
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-baseline">
                <span className="font-extrabold text-xl tracking-tight text-white leading-none">Findables</span>
                <span className="text-[#FF9900] text-xs font-bold ml-0.5">.in</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">Find Better. Shop Smarter.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-600 bg-[#1e2734] text-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-300" />
              <span>English</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-600 bg-[#1e2734] text-slate-200">
              <span className="text-sm">🇮🇳</span>
              <span>India</span>
            </div>

            <div className="flex items-center gap-1 px-3 py-1.5 rounded border border-slate-600 bg-[#1e2734] text-slate-200 font-mono">
              <span>₹ INR - Indian Rupee</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Associates & Multi-Merchant Disclosure */}
      <div className="bg-[#131921] py-6 sm:py-8 px-3.5 sm:px-8 text-[11px] text-slate-400 pb-safe">
        <div className="max-w-[1400px] mx-auto space-y-4">
          <div className="p-3.5 sm:p-4 rounded-lg bg-[#1a2332] border border-slate-700/60 text-slate-300">
            <p className="font-bold text-[#FF9900] mb-1 text-xs">
              &ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo;
            </p>
            <p className="text-slate-300 leading-relaxed">
              Findables participates in multiple e-commerce affiliate programs including Amazon Associates, Flipkart, and partner affiliate networks designed to provide a means to earn fees by linking to official merchant destinations. Product details, prices, and availability are subject to change.
            </p>
            <p className="mt-2 text-slate-400 font-mono text-[10px] break-words">
              Amazon Associates ID: {AMAZON_ASSOCIATE_TAG} · Supported Merchants: Amazon India, Flipkart, Myntra, Meesho
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs text-slate-300 pt-2">
            <button onClick={onOpenPrivacy} className="hover:underline hover:text-white cursor-pointer min-h-[36px] flex items-center px-1">
              Privacy Notice
            </button>
            <button onClick={onOpenTerms} className="hover:underline hover:text-white cursor-pointer min-h-[36px] flex items-center px-1">
              Conditions of Use &amp; Sale
            </button>
            <button onClick={onOpenDisclosure} className="hover:underline hover:text-white cursor-pointer min-h-[36px] flex items-center px-1">
              Affiliate Disclosure
            </button>
            <button onClick={onOpenContact} className="hover:underline hover:text-white cursor-pointer min-h-[36px] flex items-center px-1">
              Contact Us
            </button>
            <button
              onClick={onOpenAdmin}
              className="hover:underline hover:text-white text-slate-400 flex items-center gap-1 cursor-pointer min-h-[36px] px-1"
            >
              <Lock className="w-3 h-3 text-[#FF9900]" />
              <span>Admin</span>
            </button>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="text-center text-[10px] sm:text-[11px] text-slate-500 pt-1 leading-relaxed">
            &copy; {new Date().getFullYear()} Findables — Find Better. Shop Smarter. Independent multi-platform product discovery. Amazon, Flipkart, Myntra, Meesho and their respective logos are trademarks of their respective owners.
          </div>
        </div>
      </div>
    </footer>
  );
};
