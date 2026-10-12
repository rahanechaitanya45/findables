import React from 'react';
import { X, ShieldCheck, Mail, Send, CheckCircle2 } from 'lucide-react';
import { AMAZON_ASSOCIATE_TAG } from '../services/affiliate';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AffiliateDisclosureModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-[#FF7900]">
          <ShieldCheck className="w-6 h-6" />
          <h2 className="text-xl font-bold text-[#0B1220]">Affiliate Disclosure</h2>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
          <p className="font-semibold text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-200">
            &ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo;
          </p>

          <p>
            This website is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon India (<code>amazon.in</code>).
          </p>

          <p>
            When you click on links to various products on this website and make a purchase, this can result in this site earning a small commission from Amazon. <strong>This does not increase the price you pay for any product.</strong> You pay the exact same price as any other customer on Amazon.
          </p>

          <p>
            All editorial reviews, pros, cons, and recommendations represent our genuine opinion based on product specifications, user sentiment, and practicality. We never accept payment from brands to artificially inflate ratings or endorse low-quality items.
          </p>

          <div className="pt-2 text-slate-500 font-mono text-xs">
            Affiliate Tag: {AMAZON_ASSOCIATE_TAG}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#0B1220] hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
        >
          Understood &amp; Close
        </button>
      </div>
    </div>
  );
};

export const PrivacyTermsModal: React.FC<ModalProps & { initialTab?: 'privacy' | 'terms' }> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [tab, setTab] = React.useState<'privacy' | 'terms'>(initialTab);

  React.useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setTab('privacy')}
            className={`text-sm font-bold pb-1 cursor-pointer transition-colors ${
              tab === 'privacy' ? 'text-[#FF7900] border-b-2 border-[#FF7900]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Privacy Policy
          </button>
          <span className="text-slate-300">·</span>
          <button
            onClick={() => setTab('terms')}
            className={`text-sm font-bold pb-1 cursor-pointer transition-colors ${
              tab === 'terms' ? 'text-[#FF7900] border-b-2 border-[#FF7900]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Terms of Service
          </button>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          {tab === 'privacy' ? (
            <>
              <h3 className="font-bold text-slate-900 text-base">Your Privacy Matters</h3>
              <p>
                At Findables, we respect your privacy. We do not collect personally identifiable information when you simply browse our product recommendations.
              </p>
              <h4 className="font-bold text-slate-800">1. Outbound Merchant Links</h4>
              <p>
                When you click a merchant link, you are transferred to the partner platform (Amazon, Flipkart, etc.). Partner stores operate under their respective Privacy Notices and Conditions of Use. We only record anonymous outbound click counts to identify top trending products.
              </p>
              <h4 className="font-bold text-slate-800">2. Newsletter Subscriptions</h4>
              <p>
                If you choose to subscribe to our weekly picks, your email address is securely stored for the sole purpose of sending curated deal digests. We will never sell, rent, or trade your email address. You can unsubscribe at any time.
              </p>
            </>
          ) : (
            <>
              <h3 className="font-bold text-slate-900 text-base">Terms of Service</h3>
              <p>
                By using this website, you agree to these terms. Findables is an independent product discovery and recommendation website.
              </p>
              <h4 className="font-bold text-slate-800">1. Pricing &amp; Product Availability</h4>
              <p>
                Product prices, stock levels, and discounts on partner platforms change continuously. The price displayed on the partner platform at the time of purchase will apply to the purchase of that product.
              </p>
              <h4 className="font-bold text-slate-800">2. Independent Status</h4>
              <p>
                Findables is an independent shopping discovery hub. All trademarks, logos, and brand names are the property of their respective owners.
              </p>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#0B1220] hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export const ContactModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-[#FF7900]">
          <Mail className="w-6 h-6" />
          <h2 className="text-xl font-bold text-[#0B1220]">Contact &amp; Suggest a Deal</h2>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Message Received!</h3>
            <p className="text-xs text-slate-600">
              Thanks for reaching out! I personally review all product suggestions and queries.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-4 py-2 bg-[#0B1220] text-white text-xs font-semibold rounded-lg"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav, Priya, etc."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Product ASIN or Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share a deal you’d like me to review or ask a question..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#FF7900] hover:bg-[#e66c00] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
