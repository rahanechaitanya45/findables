import React, { useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (loc: string) => void;
}

const POPULAR_CITIES = [
  { city: 'Mumbai', pin: '400001' },
  { city: 'New Delhi', pin: '110001' },
  { city: 'Bengaluru', pin: '560001' },
  { city: 'Hyderabad', pin: '500001' },
  { city: 'Pune', pin: '411001' },
  { city: 'Chennai', pin: '600001' },
  { city: 'Kolkata', pin: '700001' },
  { city: 'Ahmedabad', pin: '380001' },
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [customPin, setCustomPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleApplyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customPin.trim();
    if (!/^\d{6}$/.test(clean)) {
      setError('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    onSelectLocation(`PIN ${clean}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="bg-[#131921] text-white px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FF9900]" />
            <h3 className="font-bold text-sm">Choose your delivery location</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close location modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Select your delivery location to see verified Amazon India delivery availability, lightning delivery dates, and localized partner offers.
          </p>

          {/* Pincode Input Form */}
          <form onSubmit={handleApplyPin} className="space-y-2">
            <label className="block font-bold text-slate-800">
              Enter an Indian PIN Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={customPin}
                onChange={(e) => {
                  setCustomPin(e.target.value);
                  setError('');
                }}
                placeholder="e.g. 400001"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-slate-900 font-bold rounded-lg border border-[#FCD200] cursor-pointer shadow-xs"
              >
                Apply
              </button>
            </div>
            {error && <p className="text-rose-600 text-[11px]">{error}</p>}
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold absolute">
              or select a major city
            </span>
          </div>

          {/* Popular Cities Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {POPULAR_CITIES.map((c) => {
              const label = `${c.city} - ${c.pin}`;
              const isSelected = currentLocation.includes(c.city) || currentLocation.includes(c.pin);

              return (
                <button
                  key={c.pin}
                  onClick={() => {
                    onSelectLocation(label);
                    onClose();
                  }}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/60 border-[#FF9900] text-slate-900 font-bold'
                      : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900">{c.city}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{c.pin}</div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#FF9900]" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 text-right">
          <button
            onClick={() => {
              onSelectLocation('India');
              onClose();
            }}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Reset to All India
          </button>
        </div>
      </div>
    </div>
  );
};
