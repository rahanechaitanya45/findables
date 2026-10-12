import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Download,
  Activity,
  Layers,
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  Server,
  Shirt,
  Footprints,
  Flame,
  Check,
  Globe,
  Calendar,
  Link,
  Save,
  ArrowUpRight,
} from 'lucide-react';
import { Product, Category, PaapiStatus, MerchantIntegration, ShoppingEvent } from '../types';
import { isValidAsin, AMAZON_ASSOCIATE_TAG, buildAmazonAffiliateUrl } from '../services/affiliate';
import { AmazonProductImage } from './AmazonProductImage';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onProductUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  categories,
  onProductUpdated,
}) => {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'merchants' | 'events' | 'paapi' | 'subscribers' | 'checklist'>('overview');

  // Stats & data
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [paapiStatus, setPaapiStatus] = useState<PaapiStatus | null>(null);
  const [merchants, setMerchants] = useState<MerchantIntegration[]>([]);
  const [shoppingEvents, setShoppingEvents] = useState<ShoppingEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // Universal Merchants Management State
  const [editingMerchant, setEditingMerchant] = useState<MerchantIntegration | null>(null);
  const [merchantFeedback, setMerchantFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [testMerchantId, setTestMerchantId] = useState('flipkart');
  const [testMerchantUrl, setTestMerchantUrl] = useState('https://www.flipkart.com/big-billion-days-store');
  const [testMerchantResult, setTestMerchantResult] = useState<any>(null);
  const [testMerchantLoading, setTestMerchantLoading] = useState(false);

  // Shopping Events Management State
  const [editingEvent, setEditingEvent] = useState<ShoppingEvent | null>(null);
  const [eventFeedback, setEventFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventMerchant, setNewEventMerchant] = useState('flipkart');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventUrl, setNewEventUrl] = useState('');
  const [newEventStatus, setNewEventStatus] = useState<'active' | 'upcoming' | 'expired'>('upcoming');

  // Add Product Form State
  const [newAsin, setNewAsin] = useState('');
  const [newCategory, setNewCategory] = useState('fashion');
  const [newSubCategory, setNewSubCategory] = useState<'clothes' | 'sneakers'>('clothes');
  const [newGender, setNewGender] = useState<'men' | 'women' | 'unisex'>('men');
  const [newClothingType, setNewClothingType] = useState('t-shirts-shirts');
  const [newSneakerType, setNewSneakerType] = useState('casual');
  const [newIsDeal, setNewIsDeal] = useState(false);
  const [newOneLiner, setNewOneLiner] = useState('');
  const [newReview, setNewReview] = useState('');
  const [newPros, setNewPros] = useState('Durable build\nGreat value for money');
  const [newCons, setNewCons] = useState('Standard packaging');
  const [newSuitedFor, setNewSuitedFor] = useState('Daily users wanting proven reliability');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [catalogFilter, setCatalogFilter] = useState('all');

  // PA-API Test lookup
  const [testAsin, setTestAsin] = useState('B09N3ZNHTY');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  // Authentication check
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKey }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        loadDashboardData(adminKey);
      } else {
        setAuthError(data.message || 'Invalid admin key. Default is: admin2026deals');
      }
    } catch {
      setAuthError('Failed to connect to authentication endpoint.');
    }
  };

  const loadDashboardData = async (key: string) => {
    setLoading(true);
    try {
      const headers = { 'x-admin-key': key };

      const [statsRes, prodsRes, subsRes, paapiRes, merchRes, eventsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/products', { headers }),
        fetch('/api/admin/newsletter/subscribers', { headers }),
        fetch('/api/admin/paapi/status', { headers }),
        fetch('/api/admin/merchants', { headers }),
        fetch('/api/admin/events', { headers }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (prodsRes.ok) {
        const prodData = await prodsRes.json();
        setProducts(prodData.items || []);
      }
      if (subsRes.ok) {
        const subsData = await subsRes.json();
        setSubscribers(subsData.subscribers || []);
      }
      if (paapiRes.ok) setPaapiStatus(await paapiRes.json());
      if (merchRes.ok) {
        const merchData = await merchRes.json();
        setMerchants(merchData.merchants || []);
      }
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setShoppingEvents(eventsData.events || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save Merchant Configuration
  const handleSaveMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMerchant) return;
    setMerchantFeedback(null);

    try {
      const res = await fetch(`/api/admin/merchants/${editingMerchant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(editingMerchant),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMerchantFeedback({
          type: 'success',
          message: `Merchant "${editingMerchant.name}" settings updated successfully!`,
        });
        setEditingMerchant(null);
        loadDashboardData(adminKey);
      } else {
        setMerchantFeedback({
          type: 'error',
          message: data.error || 'Failed to update merchant configuration.',
        });
      }
    } catch (err: any) {
      setMerchantFeedback({
        type: 'error',
        message: err.message || 'Network error updating merchant.',
      });
    }
  };

  // Test Merchant Link Transformation
  const handleTestMerchantLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestMerchantLoading(true);
    setTestMerchantResult(null);

    try {
      const res = await fetch('/api/admin/merchants/test-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          merchantId: testMerchantId,
          testUrl: testMerchantUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestMerchantResult(data.result);
      } else {
        setTestMerchantResult({ error: data.error || 'Test failed' });
      }
    } catch (err: any) {
      setTestMerchantResult({ error: err.message || 'Network error during link test' });
    } finally {
      setTestMerchantLoading(false);
    }
  };

  // Save Shopping Event
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setEventFeedback(null);

    try {
      const res = await fetch(`/api/admin/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(editingEvent),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEventFeedback({
          type: 'success',
          message: `Event "${editingEvent.title}" updated successfully!`,
        });
        setEditingEvent(null);
        loadDashboardData(adminKey);
      } else {
        setEventFeedback({
          type: 'error',
          message: data.error || 'Failed to update shopping event.',
        });
      }
    } catch (err: any) {
      setEventFeedback({
        type: 'error',
        message: err.message || 'Network error updating shopping event.',
      });
    }
  };

  // Create New Shopping Event
  const handleCreateNewEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventFeedback(null);

    try {
      const newEventPayload: Partial<ShoppingEvent> = {
        merchantId: newEventMerchant,
        merchantName: newEventMerchant === 'flipkart' ? 'Flipkart' : newEventMerchant === 'amazon' ? 'Amazon India' : newEventMerchant.toUpperCase(),
        title: newEventTitle,
        tagline: `${newEventTitle} Sale`,
        description: newEventDesc || 'Exclusive festive shopping offers and deep discounts.',
        badgeText: `${newEventMerchant === 'flipkart' ? 'Flipkart' : 'Partner'} Special Event`,
        destinationUrl: newEventUrl,
        ctaText: `Explore ${newEventTitle}`,
        status: newEventStatus,
        datesVerified: true,
        affiliateTracked: false,
        theme: {
          gradient: 'bg-gradient-to-r from-[#0d1f33] via-[#1a365d] to-[#0d1f33]',
          glowColor1: 'bg-blue-500/20',
          glowColor2: 'bg-indigo-500/20',
          badgeBg: 'bg-blue-400 text-slate-950',
          badgeText: 'text-slate-950 font-bold',
          buttonBg: 'bg-blue-400',
          buttonHover: 'hover:bg-blue-500',
          buttonBorder: 'border-blue-300',
          buttonText: 'text-slate-950 font-bold',
        },
      };

      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(newEventPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEventFeedback({
          type: 'success',
          message: `New event "${newEventTitle}" added successfully!`,
        });
        setIsNewEventModalOpen(false);
        setNewEventTitle('');
        setNewEventDesc('');
        setNewEventUrl('');
        loadDashboardData(adminKey);
      } else {
        setEventFeedback({
          type: 'error',
          message: data.error || 'Failed to create shopping event.',
        });
      }
    } catch (err: any) {
      setEventFeedback({
        type: 'error',
        message: err.message || 'Network error creating shopping event.',
      });
    }
  };

  // Add Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!isValidAsin(newAsin)) {
      setFormError('Please enter a valid 10-character Amazon ASIN (e.g. B09N3ZNHTY)');
      return;
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          asin: newAsin.trim().toUpperCase(),
          category: newCategory,
          subCategory: newCategory === 'fashion' ? newSubCategory : undefined,
          gender: newCategory === 'fashion' ? newGender : undefined,
          clothingType: newCategory === 'fashion' && newSubCategory === 'clothes' ? newClothingType : undefined,
          sneakerType: newCategory === 'fashion' && newSubCategory === 'sneakers' ? newSneakerType : undefined,
          isDealOfTheDay: newIsDeal,
          editorialOneLiner: newOneLiner,
          editorialReview: newReview,
          pros: newPros.split('\n').filter((s) => s.trim()),
          cons: newCons.split('\n').filter((s) => s.trim()),
          bestSuitedFor: newSuitedFor,
          isFeatured: true,
          isTrending: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormSuccess(`Product ${data.product.asin} added successfully!`);
        setNewAsin('');
        setNewOneLiner('');
        setNewReview('');
        loadDashboardData(adminKey);
        onProductUpdated();
      } else {
        setFormError(data.error || 'Failed to add product');
      }
    } catch {
      setFormError('Network error while saving product.');
    }
  };

  // Toggle publish / featured
  const handleToggleProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        loadDashboardData(adminKey);
        onProductUpdated();
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product from the catalog?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey },
      });
      if (res.ok) {
        loadDashboardData(adminKey);
        onProductUpdated();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Clear all products
  const handleClearAllProducts = async () => {
    if (!window.confirm('Are you sure you want to remove ALL products from the website catalog?')) return;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey },
      });
      if (res.ok) {
        setProducts([]);
        loadDashboardData(adminKey);
        onProductUpdated();
      }
    } catch (err) {
      console.error('Clear all failed:', err);
    }
  };

  // Test PA-API Lookup
  const handleTestPaapi = async () => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/paapi/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ asin: testAsin }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ error: 'Failed to test PA-API lookup' });
    } finally {
      setTestLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-[#131921] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 z-10">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#FF9900]" />
            <h2 className="font-bold text-base sm:text-lg">Findables — Admin Dashboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="p-8 max-w-md mx-auto text-center space-y-4 my-8">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FF7900] mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Administrator Access</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your admin security access key to manage products and view analytics.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                required
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin access key (default: admin2026deals)"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
              />
              {authError && (
                <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                  {authError}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF7900] hover:bg-[#e66c00] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow"
              >
                Verify &amp; Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex-1 flex flex-col">
            {/* Tabs Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-[#FF7900] text-[#0B1220]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                📊 Click Analytics &amp; KPIs
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'products'
                    ? 'border-[#FF7900] text-[#0B1220]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                📦 Product Catalog ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('merchants')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'merchants'
                    ? 'border-[#FF7900] text-[#0B1220]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                🌐 Multi-Merchant Architecture ({merchants.length || 4})
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'events'
                    ? 'border-[#FF7900] text-[#0B1220]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                🎪 Shopping Events ({shoppingEvents.length || 2})
              </button>
              <button
                onClick={() => setActiveTab('paapi')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'paapi'
                    ? 'border-[#FF7900] text-[#0B1220]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                ⚡ Amazon PA-API Status
              </button>
              <button
                onClick={() => setActiveTab('subscribers')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'subscribers'
                    ? 'border-[#FF7900] text-[#0B1220]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                ✉️ Subscribers ({subscribers.length})
              </button>
              <button
                onClick={() => setActiveTab('checklist')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'checklist'
                    ? 'border-[#FF7900] text-[#0B1220]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                ✅ Amazon Associates Checklist
              </button>
            </div>

            {/* Tab Panes */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <span className="text-xs text-slate-500 font-medium">Outbound Clicks</span>
                      <div className="text-2xl font-extrabold text-[#0B1220] font-mono mt-1">
                        {stats?.clickStats?.totalClicks || 0}
                      </div>
                      <span className="text-[11px] text-emerald-600 font-medium">Real-time tracked</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <span className="text-xs text-slate-500 font-medium">Published Products</span>
                      <div className="text-2xl font-extrabold text-[#0B1220] font-mono mt-1">
                        {stats?.productStats?.publishedCount || products.length}
                      </div>
                      <span className="text-[11px] text-slate-500">In 10 categories</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <span className="text-xs text-slate-500 font-medium">Under ₹499 Finds</span>
                      <div className="text-2xl font-extrabold text-[#0B1220] font-mono mt-1">
                        {stats?.productStats?.under499Count || 0}
                      </div>
                      <span className="text-[11px] text-[#FF7900]">High conversion</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <span className="text-xs text-slate-500 font-medium">Newsletter Subs</span>
                      <div className="text-2xl font-extrabold text-[#0B1220] font-mono mt-1">
                        {subscribers.length}
                      </div>
                      <span className="text-[11px] text-blue-600">Active audience</span>
                    </div>
                  </div>

                  {/* Top Clicked Products */}
                  <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900">
                        Top Clicked Amazon India Products
                      </h3>
                      <a
                        href="/api/admin/clicks/export"
                        target="_blank"
                        className="text-xs font-semibold text-[#FF7900] hover:underline flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Clicks CSV</span>
                      </a>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      {stats?.clickStats?.topProducts?.length > 0 ? (
                        stats.clickStats.topProducts.map((p: any, idx: number) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-800">{p.title}</span>
                              <span className="text-slate-400 font-mono ml-2">ASIN: {p.asin}</span>
                            </div>
                            <span className="font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                              {p.clicks} clicks
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 py-3">No clicks recorded yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Products Manager */}
              {activeTab === 'products' && (
                <div className="space-y-8">
                  {/* Add Product by ASIN Form */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#FF7900]" />
                      <span>Add New Amazon Product by ASIN</span>
                    </h3>

                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Amazon ASIN (10 Characters) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAsin}
                          onChange={(e) => setNewAsin(e.target.value.toUpperCase())}
                          placeholder="e.g. B09N3ZNHTY"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Fashion specific subcategory workflow */}
                      {newCategory === 'fashion' && (
                        <>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              Fashion Subcategory *
                            </label>
                            <select
                              value={newSubCategory}
                              onChange={(e) => setNewSubCategory(e.target.value as any)}
                              className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-lg font-bold text-slate-900"
                            >
                              <option value="clothes">Clothes (Apparel &amp; Tops)</option>
                              <option value="sneakers">Sneakers (Footwear)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              Target Audience / Gender
                            </label>
                            <select
                              value={newGender}
                              onChange={(e) => setNewGender(e.target.value as any)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                            >
                              <option value="men">Men</option>
                              <option value="women">Women</option>
                              <option value="unisex">Unisex</option>
                            </select>
                          </div>

                          {newSubCategory === 'clothes' ? (
                            <div>
                              <label className="block font-semibold text-slate-700 mb-1">
                                Clothing Type
                              </label>
                              <select
                                value={newClothingType}
                                onChange={(e) => setNewClothingType(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                              >
                                <option value="t-shirts-shirts">T-Shirts &amp; Shirts</option>
                                <option value="jeans-trousers">Jeans &amp; Trousers</option>
                                <option value="ethnic">Ethnic Wear (Kurtas/Sarees)</option>
                                <option value="jackets-hoodies">Jackets &amp; Hoodies</option>
                                <option value="essentials">Everyday Essentials</option>
                              </select>
                            </div>
                          ) : (
                            <div>
                              <label className="block font-semibold text-slate-700 mb-1">
                                Sneaker Style
                              </label>
                              <select
                                value={newSneakerType}
                                onChange={(e) => setNewSneakerType(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                              >
                                <option value="casual">Casual Low-Top Kicks</option>
                                <option value="running">Running &amp; Walking Shoes</option>
                                <option value="everyday">Everyday Canvas Footwear</option>
                                <option value="budget">Budget Sneaker (&lt; ₹999)</option>
                              </select>
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-5">
                            <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newIsDeal}
                                onChange={(e) => setNewIsDeal(e.target.checked)}
                                className="rounded text-[#FF9900] focus:ring-[#FF9900]"
                              />
                              <span className="flex items-center gap-1 text-xs">
                                <Flame className="w-3.5 h-3.5 text-[#CC0C39]" />
                                Feature in Today's Deals
                              </span>
                            </label>
                          </div>
                        </>
                      )}

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">
                          Editorial One-Liner (Short Hook) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newOneLiner}
                          onChange={(e) => setNewOneLiner(e.target.value)}
                          placeholder="e.g. Unbeatable 42-hour playtime under ₹1,000 for college daily commutes."
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">
                          Original Editorial Review (2-3 Lines) *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={newReview}
                          onChange={(e) => setNewReview(e.target.value)}
                          placeholder="Explain why you recommend it, what to expect, and genuine experience..."
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Pros (One per line)
                        </label>
                        <textarea
                          rows={2}
                          value={newPros}
                          onChange={(e) => setNewPros(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Cons (One per line)
                        </label>
                        <textarea
                          rows={2}
                          value={newCons}
                          onChange={(e) => setNewCons(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>

                      {formError && (
                        <div className="sm:col-span-2 p-2 bg-rose-50 text-rose-700 rounded-lg">
                          {formError}
                        </div>
                      )}
                      {formSuccess && (
                        <div className="sm:col-span-2 p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                          {formSuccess}
                        </div>
                      )}

                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-[#FF7900] hover:bg-[#e66c00] text-white font-bold rounded-lg cursor-pointer"
                        >
                          Import &amp; Publish to Catalog
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Products Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <div className="p-3 bg-slate-100 font-bold text-slate-700 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span>Catalog Records ({products.length})</span>
                        {products.length > 0 && (
                          <button
                            onClick={handleClearAllProducts}
                            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                            title="Remove all products from catalog"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Clear All Products</span>
                          </button>
                        )}
                      </div>

                      {/* Filter by Section / Category */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <select
                          value={catalogFilter}
                          onChange={(e) => setCatalogFilter(e.target.value)}
                          className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 font-medium focus:outline-none"
                        >
                          <option value="all">Filter: All ({products.length})</option>
                          <option value="fashion">Fashion Only</option>
                          <option value="clothes">Clothes Only</option>
                          <option value="sneakers">Sneakers Only</option>
                          <option value="deals">Today's Deals</option>
                          <option value="unpublished">Unpublished Only</option>
                        </select>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                      {products.filter((p) => {
                        if (catalogFilter === 'fashion') return p.category === 'fashion';
                        if (catalogFilter === 'clothes') return p.subCategory === 'clothes';
                        if (catalogFilter === 'sneakers') return p.subCategory === 'sneakers';
                        if (catalogFilter === 'deals') return p.isDealOfTheDay;
                        if (catalogFilter === 'unpublished') return !p.published;
                        return true;
                      }).length === 0 ? (
                        <div className="p-8 text-center text-slate-500 space-y-2">
                          <p className="text-xs font-bold text-slate-700">No products currently in the catalog</p>
                          <p className="text-[11px] text-slate-400">
                            All products have been removed. You can import new verified Amazon products by entering a 10-character ASIN above.
                          </p>
                        </div>
                      ) : (
                        products
                          .filter((p) => {
                            if (catalogFilter === 'fashion') return p.category === 'fashion';
                            if (catalogFilter === 'clothes') return p.subCategory === 'clothes';
                            if (catalogFilter === 'sneakers') return p.subCategory === 'sneakers';
                            if (catalogFilter === 'deals') return p.isDealOfTheDay;
                            if (catalogFilter === 'unpublished') return !p.published;
                            return true;
                          })
                          .map((p) => (
                            <div key={p.id} className="p-3 flex items-center justify-between hover:bg-slate-50 gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded bg-white p-0.5 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                                <AmazonProductImage
                                  asin={p.asin}
                                  src={p.imageUrl}
                                  alt={p.title}
                                  brand={p.brand}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate max-w-xs">{p.title}</div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap mt-0.5">
                                  <span className="font-mono text-slate-600">ASIN: {p.asin}</span>
                                  <span>·</span>
                                  <span className="font-bold text-slate-800">₹{p.currentPrice}</span>
                                  <span>·</span>
                                  <span className="capitalize">{p.categoryName}</span>
                                  {p.subCategory && (
                                    <button
                                      onClick={() =>
                                        handleToggleProduct(p.id, {
                                          subCategory: p.subCategory === 'clothes' ? 'sneakers' : 'clothes',
                                        })
                                      }
                                      className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer"
                                      title="Click to toggle Clothes ↔ Sneakers"
                                    >
                                      {p.subCategory} ⇄
                                    </button>
                                  )}
                                  {p.gender && (
                                    <span className="text-[10px] text-slate-400">({p.gender})</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Verify Link */}
                              <a
                                href={buildAmazonAffiliateUrl(p.asin)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-slate-500 hover:text-[#007185] hover:bg-slate-100 rounded"
                                title={`Verify outbound affiliate URL for ${p.asin}`}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>

                              {/* Deal Toggle */}
                              <button
                                onClick={() => handleToggleProduct(p.id, { isDealOfTheDay: !p.isDealOfTheDay })}
                                className={`p-1.5 rounded transition-colors ${
                                  p.isDealOfTheDay ? 'text-[#CC0C39] bg-rose-50 font-bold' : 'text-slate-400 bg-slate-100'
                                }`}
                                title={p.isDealOfTheDay ? "Featured in Today's Deals (Click to remove)" : "Add to Today's Deals"}
                              >
                                <Flame className="w-3.5 h-3.5" />
                              </button>

                              {/* Published Toggle */}
                              <button
                                onClick={() => handleToggleProduct(p.id, { published: !p.published })}
                                className={`p-1.5 rounded transition-colors ${
                                  p.published ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 bg-slate-100'
                                }`}
                                title={p.published ? 'Published (Click to hide from store)' : 'Unpublished (Click to publish)'}
                              >
                                {p.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>

                              {/* Featured Toggle */}
                              <button
                                onClick={() => handleToggleProduct(p.id, { isFeatured: !p.isFeatured })}
                                className={`p-1.5 rounded text-[10px] font-bold ${
                                  p.isFeatured ? 'bg-orange-100 text-[#FF9900]' : 'bg-slate-100 text-slate-500'
                                }`}
                                title="Toggle featured flag"
                              >
                                Featured
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: PA-API Status */}
              {activeTab === 'paapi' && (
                <div className="space-y-6 text-xs">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Server className="w-4 h-4 text-[#FF7900]" />
                        <span>Amazon Product Advertising API (PA-API v5) Layer</span>
                      </h3>
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          paapiStatus?.configured
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {paapiStatus?.configured ? 'Active' : 'Demo Catalog Fallback'}
                      </span>
                    </div>

                    <p className="text-slate-600">
                      {paapiStatus?.statusMessage}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono">
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Marketplace</span>
                        <span className="font-bold text-slate-800">amazon.in (India)</span>
                      </div>
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Partner Tag</span>
                        <span className="font-bold text-slate-800">{AMAZON_ASSOCIATE_TAG}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Access Key Masked</span>
                        <span className="font-bold text-slate-800">{paapiStatus?.accessKeyMasked || 'Not Provided'}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Cache TTL Compliance</span>
                        <span className="font-bold text-slate-800">1 Hour (Amazon Guideline)</span>
                      </div>
                    </div>
                  </div>

                  {/* ASIN Test Lookup Sandbox */}
                  <div className="border border-slate-200 rounded-xl p-5 space-y-3">
                    <h4 className="font-bold text-sm text-slate-900">
                      Live ASIN Lookup &amp; Verification Test
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={testAsin}
                        onChange={(e) => setTestAsin(e.target.value.toUpperCase())}
                        placeholder="Enter ASIN (e.g. B09N3ZNHTY)"
                        className="px-3 py-2 border border-slate-300 rounded-lg flex-1 font-mono"
                      />
                      <button
                        onClick={handleTestPaapi}
                        disabled={testLoading}
                        className="px-4 py-2 bg-[#0B1220] hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer"
                      >
                        {testLoading ? 'Fetching...' : 'Query PA-API'}
                      </button>
                    </div>

                    {testResult && (
                      <div className="mt-3 bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-60">
                        <pre>{JSON.stringify(testResult, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Newsletter Subscribers */}
              {activeTab === 'subscribers' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        Newsletter Subscribers List ({subscribers.length})
                      </h3>
                      <p className="text-slate-500">
                        Users who consented to receive weekly curated Amazon India deal drops.
                      </p>
                    </div>
                    <a
                      href="/api/admin/newsletter/export"
                      target="_blank"
                      className="px-3 py-1.5 bg-[#0B1220] text-white font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download CSV</span>
                    </a>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {subscribers.map((s, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between bg-white hover:bg-slate-50">
                        <div>
                          <span className="font-bold text-slate-800">{s.email}</span>
                          <span className="text-slate-400 ml-2">({s.source})</span>
                        </div>
                        <span className="text-slate-400 font-mono">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Amazon Associates Requirements Checklist */}
              {activeTab === 'checklist' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-900">
                    <h3 className="font-bold text-sm">
                      Amazon Associates India &mdash; 100% Compliance Checklist
                    </h3>
                    <p className="mt-1 text-blue-800">
                      Before applying for or maintaining an active Associates account, verify these requirements:
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      {
                        title: 'Tracking Tag Configured Everywhere',
                        desc: `Affiliate links dynamically apply "amazonde0941f-21" to every outbound Amazon India URL.`,
                        status: true,
                      },
                      {
                        title: 'Mandatory Associates Disclosure in Footer',
                        desc: '"As an Amazon Associate I earn from qualifying purchases." is permanently displayed in the footer and modal.',
                        status: true,
                      },
                      {
                        title: 'No Brand Impersonation',
                        desc: 'The website clearly specifies it is an independent curation engine ("Amazon Deals"), not official Amazon.',
                        status: true,
                      },
                      {
                        title: 'Target Market URL Matching',
                        desc: 'All links target amazon.in rather than other international marketplaces.',
                        status: true,
                      },
                      {
                        title: 'Privacy Policy & Terms Provided',
                        desc: 'Public privacy policy detailing outbound links and cookie usage is live.',
                        status: true,
                      },
                      {
                        title: 'Original Editorial Content',
                        desc: 'Every product includes original 2-3 line reviews, genuine pros & cons, rather than scraping Amazon customer reviews.',
                        status: true,
                      },
                      {
                        title: 'No Offline or SMS Link Promotion',
                        desc: 'Links are shared directly on web pages and Instagram bio, compliant with Amazon Associates Operating Agreement.',
                        status: true,
                      },
                      {
                        title: 'Price Freshness & Disclaimer',
                        desc: 'Real-time price disclaimer included so users know prices on Amazon.in may fluctuate.',
                        status: true,
                      },
                      {
                        title: 'Three Qualifying Sales Rule (Your Action Required)',
                        desc: 'Amazon Associates accounts require 3 qualifying purchases within 180 days of signup to complete official review.',
                        status: false,
                      },
                      {
                        title: 'Add Website URL to Amazon Associates Console (Your Action Required)',
                        desc: 'Add this domain/URL to your "Website and Mobile App List" inside associates.amazon.in.',
                        status: false,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                          item.status
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-amber-50/50 border-amber-200'
                        }`}
                      >
                        {item.status ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{item.title}</div>
                          <p className="text-slate-600 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Multi-Merchant Architecture */}
              {activeTab === 'merchants' && (
                <div className="space-y-6">
                  {/* Overview Header */}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl p-5 border border-slate-700 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 max-w-2xl">
                        <div className="inline-flex items-center gap-1.5 bg-[#FF7900] text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                          <Globe className="w-3 h-3" />
                          <span>Universal Affiliate Engine</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          Multi-Merchant Integration &amp; Affiliate Architecture
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Centralized tracking parameters, link generation rules, and data sources across Amazon India, Flipkart, Myntra, and Meesho. Amazon India is currently active with verified tracking tag <code className="bg-black/30 px-1 py-0.5 rounded text-amber-300 font-mono">amazonde0941f-21</code>. Other merchants can be activated as your accounts are approved without modifying the website interface or product catalog.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => loadDashboardData(adminKey)}
                          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Refresh Integrations</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {merchantFeedback && (
                    <div
                      className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                        merchantFeedback.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {merchantFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{merchantFeedback.message}</span>
                    </div>
                  )}

                  {/* Merchants List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {merchants.map((merchant) => (
                      <div
                        key={merchant.id}
                        className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4"
                      >
                        <div>
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs"
                                style={{
                                  backgroundColor: merchant.branding?.primaryColor || '#0B1220',
                                  color: merchant.branding?.badgeText || '#FFFFFF',
                                }}
                              >
                                {merchant.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                                  <span>{merchant.name}</span>
                                  <span className="text-[11px] font-normal text-slate-400">
                                    ({merchant.domain})
                                  </span>
                                </h4>
                                <span className="text-[11px] text-slate-500">
                                  Network: <strong className="text-slate-700 uppercase">{merchant.trackingConfig?.network || 'Direct'}</strong>
                                </span>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div>
                              {merchant.status === 'active' && (
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Active Partner
                                </span>
                              )}
                              {merchant.status === 'configured' && (
                                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded">
                                  <Check className="w-3 h-3" />
                                  Configured
                                </span>
                              )}
                              {merchant.status === 'pending_approval' && (
                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">
                                  <AlertCircle className="w-3 h-3" />
                                  Pending Approval
                                </span>
                              )}
                              {merchant.status === 'disabled' && (
                                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                                  Disabled
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                            {merchant.statusNote}
                          </p>

                          {/* Technical Specifications */}
                          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs space-y-2 mt-3 font-mono">
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] text-slate-400">Tracking Parameter:</span>
                              <span className="font-bold text-slate-800">{merchant.trackingConfig?.paramName}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] text-slate-400">Tracking ID / Tag:</span>
                              <span className="font-bold text-slate-800">
                                {merchant.trackingConfig?.trackingId || (
                                  <span className="text-amber-600 font-normal italic">Not configured yet</span>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] text-slate-400">Data Source:</span>
                              <span className="text-slate-700 text-[11px] truncate max-w-[200px]" title={merchant.dataSource?.description}>
                                {merchant.dataSource?.type}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 truncate">
                              <span className="text-slate-400">Template: </span>
                              <span className="text-slate-700">{merchant.linkRules?.urlTemplate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => setEditingMerchant(merchant)}
                            className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                            <span>Configure Tracking</span>
                          </button>
                          <a
                            href={merchant.portalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            title={`Open official affiliate portal for ${merchant.name}`}
                          >
                            <span>Affiliate Portal</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Live Link Transformation Test Tool */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <Link className="w-4 h-4 text-[#FF7900]" />
                          <span>Merchant Deep-Link Transformation Tester</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Test how the universal affiliate engine appends affiliate tags and tracking parameters to raw product or category links.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleTestMerchantLink} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Select Merchant
                          </label>
                          <select
                            value={testMerchantId}
                            onChange={(e) => {
                              setTestMerchantId(e.target.value);
                              if (e.target.value === 'flipkart') {
                                setTestMerchantUrl('https://www.flipkart.com/big-billion-days-store');
                              } else if (e.target.value === 'amazon') {
                                setTestMerchantUrl('https://www.amazon.in/dp/B000GAYQJ0');
                              } else if (e.target.value === 'myntra') {
                                setTestMerchantUrl('https://www.myntra.com/fashion-deals');
                              } else {
                                setTestMerchantUrl('https://www.meesho.com/products');
                              }
                            }}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
                          >
                            {merchants.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.domain})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Destination URL or Path
                          </label>
                          <input
                            type="text"
                            value={testMerchantUrl}
                            onChange={(e) => setTestMerchantUrl(e.target.value)}
                            placeholder="e.g. https://www.flipkart.com/big-billion-days-store"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-[#FF7900]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={testMerchantLoading}
                          className="px-4 py-2 bg-[#FF7900] hover:bg-[#e66c00] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                        >
                          {testMerchantLoading ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                          <span>Generate &amp; Test Destination Link</span>
                        </button>
                      </div>
                    </form>

                    {testMerchantResult && (
                      <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs font-mono">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="font-semibold text-slate-700">Merchant:</span>
                          <span className="text-slate-900 font-bold">{testMerchantResult.merchantName}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="font-semibold text-slate-700">Tracking Active:</span>
                          <span className={testMerchantResult.isAffiliateTracked ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                            {testMerchantResult.isAffiliateTracked ? 'Yes (Affiliate parameters attached)' : 'Direct destination (Awaiting tracking ID)'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="font-semibold text-slate-700">Applied Rule:</span>
                          <span className="text-slate-800">{testMerchantResult.ruleApplied}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                          <span className="block text-[11px] text-slate-500 mb-1">Final Transformed Destination:</span>
                          <div className="p-2 bg-white border border-slate-200 rounded text-slate-900 break-all select-all flex items-center justify-between gap-2">
                            <span>{testMerchantResult.transformedUrl}</span>
                            <a
                              href={testMerchantResult.transformedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-sans font-semibold shrink-0 flex items-center gap-1"
                            >
                              <span>Open URL</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Edit Merchant Modal */}
                  {editingMerchant && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-extrabold text-slate-900">
                              Configure {editingMerchant.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              Set your approved affiliate tag and link rules.
                            </p>
                          </div>
                          <button
                            onClick={() => setEditingMerchant(null)}
                            className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveMerchant} className="space-y-3.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Integration Status
                            </label>
                            <select
                              value={editingMerchant.status}
                              onChange={(e) =>
                                setEditingMerchant({
                                  ...editingMerchant,
                                  status: e.target.value as any,
                                })
                              }
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
                            >
                              <option value="active">Active (Tracking live in links)</option>
                              <option value="configured">Configured (Ready for activation)</option>
                              <option value="pending_approval">Pending Approval (Awaiting affiliate acceptance)</option>
                              <option value="disabled">Disabled</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Tracking Parameter Name
                              </label>
                              <input
                                type="text"
                                value={editingMerchant.trackingConfig.paramName}
                                onChange={(e) =>
                                  setEditingMerchant({
                                    ...editingMerchant,
                                    trackingConfig: {
                                      ...editingMerchant.trackingConfig,
                                      paramName: e.target.value,
                                    },
                                  })
                                }
                                placeholder="e.g. tag, affid, utm_source"
                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-[#FF7900]"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Affiliate Tracking ID / Tag
                              </label>
                              <input
                                type="text"
                                value={editingMerchant.trackingConfig.trackingId}
                                onChange={(e) =>
                                  setEditingMerchant({
                                    ...editingMerchant,
                                    trackingConfig: {
                                      ...editingMerchant.trackingConfig,
                                      trackingId: e.target.value,
                                      isActive: Boolean(e.target.value),
                                    },
                                  })
                                }
                                placeholder="e.g. flipkart_aff_id"
                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-[#FF7900]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Affiliate Network Type
                            </label>
                            <select
                              value={editingMerchant.trackingConfig.network}
                              onChange={(e) =>
                                setEditingMerchant({
                                  ...editingMerchant,
                                  trackingConfig: {
                                    ...editingMerchant.trackingConfig,
                                    network: e.target.value as any,
                                  },
                                })
                              }
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
                            >
                              <option value="direct">Direct Official Affiliate Program</option>
                              <option value="cuelinks">Cuelinks Network</option>
                              <option value="earnkaro">EarnKaro Network</option>
                              <option value="impact">Impact Radius</option>
                              <option value="admitad">Admitad Network</option>
                              <option value="custom">Custom Network / Agency</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Status Note / Description
                            </label>
                            <input
                              type="text"
                              value={editingMerchant.statusNote}
                              onChange={(e) =>
                                setEditingMerchant({
                                  ...editingMerchant,
                                  statusNote: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setEditingMerchant(null)}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-[#FF7900] hover:bg-[#e66c00] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Merchant Settings</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Shopping Events */}
              {activeTab === 'events' && (
                <div className="space-y-6">
                  {/* Overview Header */}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl p-5 border border-slate-700 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 max-w-2xl">
                        <div className="inline-flex items-center gap-1.5 bg-[#FF7900] text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                          <Calendar className="w-3 h-3" />
                          <span>Festive Sales Management</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          Festive Shopping Events &amp; Mega Sale Cards
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Control official sales banners displayed in the hero section above Today&apos;s Deals. Both <strong>Amazon Great Indian Festival</strong> and <strong>Flipkart Big Billion Days</strong> are registered with verified destinations and responsive cards. Add other upcoming shopping sales (Myntra EORS, Meesho Maha Indian Price Drop) on demand.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setIsNewEventModalOpen(true)}
                          className="px-3.5 py-2 bg-[#FF7900] hover:bg-[#e66c00] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Shopping Event</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {eventFeedback && (
                    <div
                      className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                        eventFeedback.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {eventFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{eventFeedback.message}</span>
                    </div>
                  )}

                  {/* Events Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {shoppingEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                                  {evt.merchantName}
                                </span>
                                {evt.status === 'active' && (
                                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Live Now
                                  </span>
                                )}
                                {evt.status === 'upcoming' && (
                                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">
                                    Upcoming Festival
                                  </span>
                                )}
                                {evt.status === 'expired' && (
                                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded">
                                    Concluded
                                  </span>
                                )}
                              </div>
                              <h4 className="font-extrabold text-base text-slate-900 mt-1">
                                {evt.title}
                              </h4>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                            {evt.description}
                          </p>

                          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs space-y-1.5 mt-3">
                            <div className="flex items-center justify-between text-slate-500">
                              <span>Verified Destination:</span>
                              <a
                                href={evt.destinationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#007185] hover:underline font-mono text-[11px] truncate max-w-[240px] flex items-center gap-1"
                              >
                                <span>{evt.destinationUrl}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            </div>
                            <div className="flex items-center justify-between text-slate-500">
                              <span>Button CTA:</span>
                              <span className="font-semibold text-slate-800">{evt.ctaText}</span>
                            </div>
                            {evt.startDate && (
                              <div className="flex items-center justify-between text-slate-500">
                                <span>Dates:</span>
                                <span className="font-semibold text-slate-800">{evt.startDate}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => setEditingEvent(evt)}
                            className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                            <span>Edit Event Details</span>
                          </button>
                          <a
                            href={evt.destinationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>Open Link</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit Event Modal */}
                  {editingEvent && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-extrabold text-slate-900">
                              Edit {editingEvent.title}
                            </h3>
                            <p className="text-xs text-slate-500">
                              Update official event destination, dates, and status.
                            </p>
                          </div>
                          <button
                            onClick={() => setEditingEvent(null)}
                            className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveEvent} className="space-y-3.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Event Title
                            </label>
                            <input
                              type="text"
                              value={editingEvent.title}
                              onChange={(e) =>
                                setEditingEvent({
                                  ...editingEvent,
                                  title: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Event Status
                              </label>
                              <select
                                value={editingEvent.status}
                                onChange={(e) =>
                                  setEditingEvent({
                                    ...editingEvent,
                                    status: e.target.value as any,
                                  })
                                }
                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
                              >
                                <option value="active">Live Now</option>
                                <option value="upcoming">Upcoming Festival</option>
                                <option value="expired">Concluded</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Verified Event Timing
                              </label>
                              <input
                                type="text"
                                value={editingEvent.startDate || ''}
                                onChange={(e) =>
                                  setEditingEvent({
                                    ...editingEvent,
                                    startDate: e.target.value,
                                  })
                                }
                                placeholder="e.g. September/October"
                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Official Destination URL
                            </label>
                            <input
                              type="text"
                              value={editingEvent.destinationUrl}
                              onChange={(e) =>
                                setEditingEvent({
                                  ...editingEvent,
                                  destinationUrl: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-[#FF7900]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Description Copy
                            </label>
                            <textarea
                              rows={3}
                              value={editingEvent.description}
                              onChange={(e) =>
                                setEditingEvent({
                                  ...editingEvent,
                                  description: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Button CTA Label
                            </label>
                            <input
                              type="text"
                              value={editingEvent.ctaText}
                              onChange={(e) =>
                                setEditingEvent({
                                  ...editingEvent,
                                  ctaText: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setEditingEvent(null)}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-[#FF7900] hover:bg-[#e66c00] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Update Event</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Add New Shopping Event Modal */}
                  {isNewEventModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-extrabold text-slate-900">
                              Add New Festive Shopping Event
                            </h3>
                            <p className="text-xs text-slate-500">
                              Register a new shopping festival (Myntra EORS, Meesho Price Drop, etc.)
                            </p>
                          </div>
                          <button
                            onClick={() => setIsNewEventModalOpen(false)}
                            className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleCreateNewEvent} className="space-y-3.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Event Title *
                            </label>
                            <input
                              type="text"
                              required
                              value={newEventTitle}
                              onChange={(e) => setNewEventTitle(e.target.value)}
                              placeholder="e.g. Myntra End of Reason Sale"
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Merchant Platform
                              </label>
                              <select
                                value={newEventMerchant}
                                onChange={(e) => setNewEventMerchant(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
                              >
                                {merchants.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Event Status
                              </label>
                              <select
                                value={newEventStatus}
                                onChange={(e) => setNewEventStatus(e.target.value as any)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
                              >
                                <option value="upcoming">Upcoming Festival</option>
                                <option value="active">Live Now</option>
                                <option value="expired">Concluded</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Official Destination URL *
                            </label>
                            <input
                              type="url"
                              required
                              value={newEventUrl}
                              onChange={(e) => setNewEventUrl(e.target.value)}
                              placeholder="https://..."
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-[#FF7900]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Short Description
                            </label>
                            <textarea
                              rows={2}
                              value={newEventDesc}
                              onChange={(e) => setNewEventDesc(e.target.value)}
                              placeholder="Describe the discounts and festive offers..."
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF7900]"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setIsNewEventModalOpen(false)}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-[#FF7900] hover:bg-[#e66c00] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Create Event</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
