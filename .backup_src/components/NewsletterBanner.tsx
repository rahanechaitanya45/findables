import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

interface NewsletterBannerProps {
  onOpenPrivacy: () => void;
}

export const NewsletterBanner: React.FC<NewsletterBannerProps> = ({ onOpenPrivacy }) => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (!consent) {
      setStatus('error');
      setMessage('Please consent to receiving weekly curated deal emails.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'newsletter_banner' }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Thanks for subscribing! Check your inbox every Sunday.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Unable to subscribe. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please try again in a moment.');
    }
  };

  return (
    <section className="py-12 bg-[#F1F5F9] border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FF7900] mx-auto flex items-center justify-center mb-4">
            <Mail className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220]">
            Get my weekly picks — drop your email 👇
          </h2>

          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
            One useful email with my latest product finds and recommendations. No spam, ever.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email (e.g. name@gmail.com)"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF7900] focus:ring-1 focus:ring-[#FF7900]"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 bg-[#FF7900] hover:bg-[#e66c00] disabled:bg-slate-300 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 text-left pt-1">
              <input
                type="checkbox"
                id="newsletter-consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="rounded border-slate-300 text-[#FF7900] focus:ring-[#FF7900] cursor-pointer"
              />
              <label htmlFor="newsletter-consent" className="cursor-pointer">
                I agree to receive weekly deal emails. Unsubscribe anytime. View{' '}
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="text-slate-700 underline hover:text-[#FF7900]"
                >
                  Privacy Policy
                </button>
                .
              </label>
            </div>

            {/* Feedback messages */}
            {status === 'success' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{message}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{message}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
