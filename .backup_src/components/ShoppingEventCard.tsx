import React from 'react';
import {
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ShoppingEvent } from '../types';

interface ShoppingEventCardProps {
  event: ShoppingEvent;
  onExplore?: () => void;
}

export const ShoppingEventCard: React.FC<ShoppingEventCardProps> = ({
  event,
  onExplore,
}) => {
  const isFlipkart = event.merchantId === 'flipkart';
  const isAmazon = event.merchantId === 'amazon';

  // Status badge coloring
  const getStatusBadge = () => {
    switch (event.status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Now
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" />
            Upcoming Festival
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">
            Concluded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${event.theme.gradient} text-white border border-slate-800 shadow-md p-4 sm:p-6 flex flex-col justify-between`}
    >
      {/* Background Decorative Blur Highlights */}
      <div
        className={`absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 ${event.theme.glowColor1} rounded-full blur-2xl pointer-events-none`}
      />
      <div
        className={`absolute bottom-0 left-1/3 -mb-8 w-36 h-36 ${event.theme.glowColor2} rounded-full blur-xl pointer-events-none`}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 h-full">
        <div className="space-y-2 max-w-2xl flex-1">
          {/* Top Tag & Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`inline-flex items-center gap-1.5 ${event.theme.badgeBg} text-[11px] font-extrabold px-2.5 py-0.5 rounded shadow-xs uppercase tracking-wider`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{event.badgeText}</span>
            </div>
            {getStatusBadge()}
          </div>

          {/* Event Title */}
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {event.description}
          </p>

          {/* Date & Tracking Metadata */}
          <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-300 flex-wrap">
            {event.startDate && (
              <span className="flex items-center gap-1 text-slate-300 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{event.startDate}</span>
              </span>
            )}

            {event.affiliateTracked ? (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Affiliate Link
              </span>
            ) : (
              <span className="flex items-center gap-1 text-blue-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Official Store Portal
              </span>
            )}

            <span>·</span>
            <span className="text-slate-400 font-mono text-[10px]">
              {isAmazon
                ? 'Amazon India Partner'
                : isFlipkart
                ? 'Flipkart Verified Hub'
                : event.merchantName}
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 md:min-w-[210px]">
          <a
            href={event.destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onExplore}
            className={`inline-flex items-center justify-center gap-2 ${event.theme.buttonBg} ${event.theme.buttonHover} active:scale-98 ${event.theme.buttonText} font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-lg border ${event.theme.buttonBorder} shadow-sm transition-all cursor-pointer group`}
            title={`Open ${event.title} in a new tab`}
          >
            <span>{event.ctaText}</span>
            <ExternalLink className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {event.secondaryUrl && (
            <a
              href={event.secondaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title={event.secondaryCtaText || 'Explore More Offers'}
            >
              <span>{event.secondaryCtaText || 'Explore More Offers'}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
