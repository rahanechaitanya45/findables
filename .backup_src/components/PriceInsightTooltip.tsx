import React, { useState, useRef, useEffect, useMemo } from 'react';
import { TrendingDown, TrendingUp, Info, Sparkles, HelpCircle } from 'lucide-react';
import { getProductPriceInsight, ProductPriceHistory } from '../services/priceHistory';

interface PriceInsightTooltipProps {
  asin: string;
  currentPrice: number;
  originalPrice?: number;
  compact?: boolean;
}

export const PriceInsightTooltip: React.FC<PriceInsightTooltipProps> = ({
  asin,
  currentPrice,
  originalPrice,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load and memoize the price insight
  const insight: ProductPriceHistory = useMemo(() => {
    return getProductPriceInsight(asin, currentPrice, originalPrice);
  }, [asin, currentPrice, originalPrice]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Determine trend badge details
  const isLowest = insight.isLowestEver || currentPrice <= insight.lowestPrice;
  const isTrendingDown = insight.trend === 'down' || insight.dropPercentage > 0;

  // Calculate highest price for relative bar chart height scaling
  const maxPriceInHistory = Math.max(
    ...insight.history.map((h) => h.price),
    insight.highestPrice,
    originalPrice || currentPrice
  );
  const minPriceInHistory = Math.min(...insight.history.map((h) => h.price), insight.lowestPrice);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Subtle trigger badge */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label="View price insight and history"
        className={`group/btn inline-flex items-center gap-1 cursor-pointer transition-all rounded-sm text-[10px] font-semibold tracking-tight ${
          isLowest
            ? 'text-emerald-700 bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200/90 px-1.5 py-0.5'
            : isTrendingDown
            ? 'text-teal-700 bg-teal-50/90 hover:bg-teal-100 border border-teal-200/90 px-1.5 py-0.5'
            : 'text-slate-600 bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200 px-1.5 py-0.5'
        }`}
      >
        {isLowest ? (
          <TrendingDown className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
        ) : isTrendingDown ? (
          <TrendingDown className="w-2.5 h-2.5 text-teal-600 shrink-0" />
        ) : (
          <Info className="w-2.5 h-2.5 text-slate-500 shrink-0" />
        )}

        <span>
          {isLowest
            ? 'Lowest Price'
            : isTrendingDown
            ? `-${insight.dropPercentage}% Low`
            : 'Price Insight'}
        </span>

        <HelpCircle className="w-2.5 h-2.5 text-slate-400 group-hover/btn:text-slate-600 transition-colors" />
      </button>

      {/* Popover / Tooltip */}
      {isOpen && (
        <div
          role="tooltip"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className={`absolute z-50 bottom-full mb-2 left-0 sm:left-auto sm:-translate-x-1/4 w-64 sm:w-72 bg-[#131921] text-white rounded-lg shadow-xl border border-slate-700 p-3.5 text-left text-xs pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Tooltip Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/80">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9900]" />
              <span className="font-bold text-slate-100 text-xs tracking-wide">
                Price Insight
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              Local History
            </span>
          </div>

          {/* Key Metric: Lowest Recorded */}
          <div className="space-y-1 mb-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-slate-400">Lowest Recorded:</span>
              <span className="text-sm font-extrabold text-emerald-400 font-mono tabular-nums">
                ₹{insight.lowestPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-baseline justify-between text-[11px]">
              <span className="text-slate-400">Typical Price:</span>
              <span className="font-medium text-slate-300 font-mono tabular-nums">
                ₹{insight.averagePrice.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Status note */}
            <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center gap-1.5 text-[10px]">
              {isLowest ? (
                <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <TrendingDown className="w-3 h-3 shrink-0" />
                  <span>Currently at its lowest recorded price!</span>
                </div>
              ) : isTrendingDown ? (
                <div className="flex items-center gap-1 text-teal-300 font-semibold">
                  <TrendingDown className="w-3 h-3 shrink-0" />
                  <span>
                    ₹{(currentPrice - insight.lowestPrice).toLocaleString('en-IN')} above recorded low
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-amber-300 font-semibold">
                  <TrendingUp className="w-3 h-3 shrink-0" />
                  <span>
                    ₹{(currentPrice - insight.lowestPrice).toLocaleString('en-IN')} above lowest recorded
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Mini Sparkline / Price History Bars */}
          {insight.history.length > 0 && (
            <div className="bg-slate-900/90 rounded-md p-2.5 border border-slate-800 space-y-2 mb-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Recent Price Trend</span>
                <span className="text-slate-500 font-mono text-[9px]">Last 30 Days</span>
              </div>

              <div className="flex items-end justify-between gap-1.5 h-12 pt-1 px-1">
                {insight.history.map((snapshot, idx) => {
                  const range = maxPriceInHistory - minPriceInHistory || 1;
                  const normalized = Math.max(
                    0.25,
                    (snapshot.price - minPriceInHistory) / range
                  );
                  const barHeightPercent = Math.min(100, Math.round(normalized * 85 + 15));
                  const isCurrentSnapshot = idx === insight.history.length - 1;
                  const isLowestSnapshot = snapshot.price === insight.lowestPrice;

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full group/bar relative"
                    >
                      <div
                        className={`w-full max-w-[20px] rounded-t transition-all ${
                          isLowestSnapshot
                            ? 'bg-emerald-400'
                            : isCurrentSnapshot
                            ? 'bg-[#FF9900]'
                            : 'bg-slate-600 hover:bg-slate-500'
                        }`}
                        style={{ height: `${barHeightPercent}%` }}
                      />
                      <span className="text-[8px] text-slate-400 mt-1 font-mono">
                        {snapshot.date}
                      </span>

                      {/* Tooltip bar hover price */}
                      <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-[9px] text-white px-1 rounded whitespace-nowrap z-10 pointer-events-none font-mono">
                        ₹{snapshot.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Micro Footer Disclaimer */}
          <p className="text-[9px] text-slate-400 leading-tight">
            Trend calculated from your local browser sessions. Official prices on Amazon.in may fluctuate in real time.
          </p>

          {/* Arrow */}
          <div className="absolute top-full left-4 sm:left-12 -mt-px border-4 border-transparent border-t-[#131921]" />
        </div>
      )}
    </div>
  );
};
