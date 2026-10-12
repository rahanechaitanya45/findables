import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { Header } from './components/Header';
import { ShopByCategories } from './components/ShopByCategories';
import { TodaysDealsSection } from './components/TodaysDealsSection';
import { TrustSection } from './components/TrustSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { LocationModal } from './components/LocationModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Toast } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BackButton } from './components/BackButton';
import {
  AffiliateDisclosureModal,
  PrivacyTermsModal,
  ContactModal,
} from './components/LegalModals';
import { FashionPage } from './pages/FashionPage';
import { ClothesPage } from './pages/ClothesPage';
import { SneakersPage } from './pages/SneakersPage';
import { GenericCategoryPage } from './pages/GenericCategoryPage';
import { Product, Category } from './types';
import { INITIAL_PRODUCTS, CATEGORIES } from './data/mockProducts';
import { AlertCircle, Home, ShoppingBag } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Client-side URL Routing State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Delivery Location State
  const [deliveryLocation, setDeliveryLocation] = useState<string>(() => {
    try {
      return localStorage.getItem('amazon_delivery_location') || 'Mumbai 400001';
    } catch {
      return 'Mumbai 400001';
    }
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('amazon_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Modals state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [privacyTab, setPrivacyTab] = useState<'privacy' | 'terms'>('privacy');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [, startTransition] = useTransition();

  // Navigation handler with browser history pushState
  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const newPath = window.location.pathname || '/';
      setCurrentPath(newPath);

      // Handle product route via back/forward
      if (newPath.startsWith('/product/') || newPath.startsWith('/products/')) {
        const id = newPath.replace(/^\/products?\//, '').replace(/\/+$/, '');
        const found = products.find(
          (p) => p.id === id || p.asin.toLowerCase() === id.toLowerCase()
        );
        if (found) {
          setSelectedProduct(found);
        }
      } else if (!window.location.hash.startsWith('#product=')) {
        // If navigated back to a non-product page, close modal
        setSelectedProduct(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  // Persist delivery location
  useEffect(() => {
    try {
      localStorage.setItem('amazon_delivery_location', deliveryLocation);
    } catch {
      // ignore
    }
  }, [deliveryLocation]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('amazon_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Load products from API
  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=100');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          setProducts(data.items);
        }
      }
    } catch {
      // Retain INITIAL_PRODUCTS fallback
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle direct product URL on initial load and refresh
  useEffect(() => {
    const path = window.location.pathname || '/';
    if (path.startsWith('/product/') || path.startsWith('/products/')) {
      const prodId = path.replace(/^\/products?\//, '').replace(/\/+$/, '');
      const found = products.find(
        (p) => p.id === prodId || p.asin.toLowerCase() === prodId.toLowerCase()
      );
      if (found) {
        setSelectedProduct(found);
      } else {
        // Fetch specific product by ID or ASIN from server if not found in list
        fetch(`/api/products/${prodId}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.product) {
              setSelectedProduct(data.product);
            }
          })
          .catch(() => {});
      }
    }
  }, [products]);

  // Listen to hash changes for deep modal links & backwards compatibility
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product=')) {
        const productId = hash.replace('#product=', '');
        const found = products.find(
          (p) => p.id === productId || p.asin.toLowerCase() === productId.toLowerCase()
        );
        if (found) {
          setSelectedProduct(found);
        }
      } else if (hash === '#admin') {
        setIsAdminOpen(true);
      } else if (hash === '#disclosure') {
        setIsDisclosureOpen(true);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [products]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    // Update path to /product/:id for clean, shareable URLs
    const newPath = `/product/${product.id}`;
    if (currentPath !== newPath) {
      window.history.pushState(null, '', newPath);
      setCurrentPath(newPath);
    }
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
    if (currentPath.startsWith('/product/') || currentPath.startsWith('/products/')) {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.history.replaceState(null, '', '/');
        setCurrentPath('/');
      }
    } else if (window.location.hash.startsWith('#product=')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [product, ...prev];
      }
    });
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const handleSearch = (q: string, category?: string) => {
    startTransition(() => {
      setSearchQuery(q);
      if (category && category !== 'all') {
        setSelectedCategory(category);
      }
    });
  };

  // Route resolver
  const renderCurrentView = () => {
    // Normalizing clean path without trailing slashes
    const path = currentPath.replace(/\/+$/, '') || '/';

    // 1. Fashion Clothes Subcategory: /categories/fashion/clothes or /category/fashion/clothes
    if (path === '/categories/fashion/clothes' || path === '/category/fashion/clothes') {
      return (
        <ClothesPage
          products={products}
          onSelectProduct={handleSelectProduct}
          onToggleWishlist={toggleWishlist}
          isWishlisted={isWishlisted}
          onNavigate={navigate}
        />
      );
    }

    // 2. Fashion Sneakers Subcategory: /categories/fashion/sneakers or /category/fashion/sneakers
    if (path === '/categories/fashion/sneakers' || path === '/category/fashion/sneakers') {
      return (
        <SneakersPage
          products={products}
          onSelectProduct={handleSelectProduct}
          onToggleWishlist={toggleWishlist}
          isWishlisted={isWishlisted}
          onNavigate={navigate}
        />
      );
    }

    // 3. Fashion Primary Hub: /categories/fashion or /category/fashion
    if (path === '/categories/fashion' || path === '/category/fashion') {
      return (
        <FashionPage
          products={products}
          onSelectProduct={handleSelectProduct}
          onToggleWishlist={toggleWishlist}
          isWishlisted={isWishlisted}
          onNavigate={navigate}
        />
      );
    }

    // 4. Dedicated Today's Deals Page: /deals, /todays-deals, /deals/today
    if (path === '/deals' || path === '/todays-deals' || path === '/deals/today') {
      return (
        <TodaysDealsSection
          onSelectProduct={handleSelectProduct}
          onToggleWishlist={toggleWishlist}
          isWishlisted={isWishlisted}
          onNavigateCategory={navigate}
          onNavigate={navigate}
          isStandalonePage={true}
        />
      );
    }

    // 5. Generic category routes: /categories/:categoryId or /category/:categoryId
    if (path.startsWith('/categories/') || path.startsWith('/category/')) {
      const catId = path.replace(/^\/categories?\//, '');
      const foundCategory = categories.find(
        (c) => c.id.toLowerCase() === catId.toLowerCase()
      );
      if (foundCategory) {
        return (
          <GenericCategoryPage
            category={foundCategory}
            products={products}
            onSelectProduct={handleSelectProduct}
            onToggleWishlist={toggleWishlist}
            isWishlisted={isWishlisted}
            onNavigate={navigate}
          />
        );
      }
    }

    // 6. Direct product route: /product/:id or /products/:id
    if (path.startsWith('/product/') || path.startsWith('/products/')) {
      const prodId = path.replace(/^\/products?\//, '');
      const found = products.find(
        (p) => p.id === prodId || p.asin.toLowerCase() === prodId.toLowerCase()
      );
      if (found) {
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-1">
              <BackButton label="Back to Homepage" fallbackPath="/" onNavigate={navigate} />
            </div>
            {/* Show background collections while PDP modal is presented */}
            <div id="categories-section">
              <ShopByCategories categories={categories} onNavigate={navigate} />
            </div>
            <TodaysDealsSection
              onSelectProduct={handleSelectProduct}
              onToggleWishlist={toggleWishlist}
              isWishlisted={isWishlisted}
              onNavigateCategory={navigate}
            />
          </div>
        );
      }
    }

    // 7. Homepage (Default)
    if (path === '/' || path === '/home') {
      return (
        <div className="space-y-4 sm:space-y-6">
          {/* Section 2: Shop by Categories */}
          <div id="categories-section">
            <ShopByCategories
              categories={categories}
              onNavigate={navigate}
            />
          </div>

          {/* Section 3: Today's Deals */}
          <TodaysDealsSection
            onSelectProduct={handleSelectProduct}
            onToggleWishlist={toggleWishlist}
            isWishlisted={isWishlisted}
            onNavigateCategory={navigate}
          />

          {/* Section 4: Findables Mission & Brand Philosophy */}
          <TrustSection onOpenDisclosure={() => setIsDisclosureOpen(true)} />
        </div>
      );
    }

    // 8. 404 Fallback with Clean Recovery
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            The page you're looking for doesn't exist or has moved. Explore our top curated deals below.
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-900 bg-[#FFD814] hover:bg-[#F7CA00] rounded-xl border border-[#FCD200] transition-colors cursor-pointer min-h-[40px]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#EAEDED] text-[#0F1111]">
        {/* Toast Notifications */}
        <Toast />

        {/* Section 1: Compact, Responsive Header */}
        <Header
          onSearch={handleSearch}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            if (catId === 'fashion') {
              navigate('/categories/fashion');
            } else if (catId !== 'all') {
              navigate(`/categories/${catId}`);
            } else {
              navigate('/');
            }
          }}
          categories={categories}
          products={products}
          onSelectProduct={handleSelectProduct}
          deliveryLocation={deliveryLocation}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          wishlistCount={wishlist.length}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenDisclosure={() => setIsDisclosureOpen(true)}
          onNavigate={navigate}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-[1500px] w-full mx-auto px-2.5 sm:px-4 py-3 sm:py-4">
          {renderCurrentView()}
        </main>

        {/* Section 4: Compact, Clean Footer with Affiliate Disclosure & Navigation */}
        <Footer
          onOpenDisclosure={() => setIsDisclosureOpen(true)}
          onOpenPrivacy={() => {
            setPrivacyTab('privacy');
            setIsPrivacyOpen(true);
          }}
          onOpenTerms={() => {
            setPrivacyTab('terms');
            setIsPrivacyOpen(true);
          }}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={handleCloseProductModal}
            onSelectProduct={handleSelectProduct}
            allProducts={products}
            onToggleWishlist={toggleWishlist}
            isWishlisted={isWishlisted(selectedProduct.id)}
            deliveryLocation={deliveryLocation}
          />
        )}

        {/* Wishlist / Deals Drawer */}
        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          savedProducts={wishlist}
          onSelectProduct={(p) => {
            setIsWishlistOpen(false);
            handleSelectProduct(p);
          }}
          onRemoveFromWishlist={(id) => {
            const item = products.find((p) => p.id === id);
            if (item) toggleWishlist(item);
            else setWishlist((prev) => prev.filter((p) => p.id !== id));
          }}
          onClearWishlist={() => setWishlist([])}
        />

        {/* Delivery Location Modal */}
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentLocation={deliveryLocation}
          onSelectLocation={(loc) => setDeliveryLocation(loc)}
        />

        {/* Admin Dashboard */}
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.hash === '#admin') {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }}
          categories={categories}
          onProductUpdated={loadProducts}
        />

        {/* Affiliate Disclosure Modal */}
        <AffiliateDisclosureModal
          isOpen={isDisclosureOpen}
          onClose={() => {
            setIsDisclosureOpen(false);
            if (window.location.hash === '#disclosure') {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }}
        />

        {/* Privacy & Terms Modal */}
        <PrivacyTermsModal
          isOpen={isPrivacyOpen}
          onClose={() => setIsPrivacyOpen(false)}
          initialTab={privacyTab}
        />

        {/* Contact Modal */}
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
}
