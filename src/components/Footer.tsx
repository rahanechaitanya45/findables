import React from 'react';
import { ShieldCheck, Lock, ExternalLink, Globe, ArrowUp } from 'lucide-react';
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

      {/* 2. 4-Column Navigation Grid */}
      <div className="bg-[#232F3E] py-12 px-4 sm:px-8 border-b border-[#3a4553]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-slate-300">
          {/* Column 1: Get to Know Us */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-tight">
              Get to Know Us
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenDisclosure}
                  className="hover:underline hover:text-white text-left transition-colors cursor-pointer"
                >
                  About Amazon Deals
                </button>
              </li>
              <li>
                <a
                  href="https://www.amazon.in/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Careers &amp; Culture
                </a>
              </li>
              <li>
                <a
                  href="https://press.aboutamazon.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Press Releases
                </a>
              </li>
              <li>
                <a
                  href="https://www.amazon.science/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Amazon Science
                </a>
              </li>
              <li>
                <a
                  href="#deals-section"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Weekly Editor Picks
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Connect with Us */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-tight">
              Connect with Us
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Instagram Community</span>
                  <ExternalLink className="w-3 h-3 text-[#FF9900]" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Facebook Deals
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Twitter / X Alerts
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:underline hover:text-white text-left transition-colors cursor-pointer"
                >
                  Suggest a Product Deal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Make Money with Us */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-tight">
              Make Money with Us
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://affiliate-program.amazon.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Amazon Associates Program
                </a>
              </li>
              <li>
                <a
                  href="https://sell.amazon.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Sell on Amazon India
                </a>
              </li>
              <li>
                <a
                  href="https://services.amazon.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Protect and Build Your Brand
                </a>
              </li>
              <li>
                <a
                  href="https://advertising.amazon.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Advertise Your Products
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Let Us Help You */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-tight">
              Let Us Help You
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenDisclosure}
                  className="hover:underline hover:text-white text-left transition-colors cursor-pointer"
                >
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <a
                  href="https://www.amazon.in/gp/help/customer/display.html?nodeId=201083470"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  100% Purchase Protection
                </a>
              </li>
              <li>
                <a
                  href="https://www.amazon.in/returns"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Returns &amp; Replacements
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:underline hover:text-white text-left transition-colors cursor-pointer"
                >
                  Help &amp; Customer Support
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:underline hover:text-[#FF9900] text-slate-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-[#FF9900]" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Middle Brand & Country Stripe */}
      <div className="bg-[#232F3E] py-6 px-4 border-b border-[#3a4553]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex items-baseline cursor-pointer" onClick={scrollToTop}>
            <span className="font-extrabold text-2xl tracking-tighter text-white">amazon</span>
            <span className="text-[#FF9900] text-xs font-bold ml-0.5">.in</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9900] ml-1" />
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

      {/* 4. Amazon Associates Mandatory Disclaimer */}
      <div className="bg-[#131921] py-8 px-4 sm:px-8 text-[11px] text-slate-400">
        <div className="max-w-[1400px] mx-auto space-y-4">
          <div className="p-4 rounded-lg bg-[#1a2332] border border-slate-700/60 text-slate-300">
            <p className="font-bold text-[#FF9900] mb-1 text-xs">
              &ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo;
            </p>
            <p className="text-slate-300 leading-relaxed">
              This website is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon India (<code>amazon.in</code>). Certain content that appears on this site comes from Amazon Services LLC or its affiliates. This content is provided &lsquo;as is&rsquo; and is subject to change or removal at any time.
            </p>
            <p className="mt-2 text-slate-400 font-mono text-[10px]">
              Amazon Associates ID: {AMAZON_ASSOCIATE_TAG} · Outbound Marketplace: amazon.in
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-300 pt-2">
            <button onClick={onOpenPrivacy} className="hover:underline hover:text-white cursor-pointer">
              Privacy Notice
            </button>
            <button onClick={onOpenTerms} className="hover:underline hover:text-white cursor-pointer">
              Conditions of Use &amp; Sale
            </button>
            <button onClick={onOpenDisclosure} className="hover:underline hover:text-white cursor-pointer">
              Affiliate Disclosure
            </button>
            <button onClick={onOpenContact} className="hover:underline hover:text-white cursor-pointer">
              Contact Us
            </button>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="text-center text-[11px] text-slate-500 pt-1">
            &copy; {new Date().getFullYear()} Amazon Deals &amp; Curated Finds. Independent product discovery and affiliate portal. Amazon, Amazon.in, and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.
          </div>
        </div>
      </div>
    </footer>
  );
};
