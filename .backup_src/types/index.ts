export interface Product {
  id: string;
  asin: string;
  title: string;
  brand: string;
  category: string;
  categoryName: string;
  subCategory?: 'clothes' | 'sneakers' | string;
  clothingType?: 't-shirts-shirts' | 'jeans-trousers' | 'ethnic' | 'jackets-hoodies' | 'essentials' | string;
  sneakerType?: 'casual' | 'running' | 'everyday' | 'budget' | string;
  gender?: 'men' | 'women' | 'unisex';
  sizes?: string[];
  imageUrl: string;
  galleryImages?: string[];
  amazonUrl: string;
  currentPrice: number;
  originalPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  editorialOneLiner: string;
  editorialReview: string;
  pros: string[];
  cons: string[];
  bestSuitedFor: string;
  buyingConsiderations: string[];
  specs: Record<string, string>;
  isFeatured?: boolean;
  isTrending?: boolean;
  isEditorPick?: boolean;
  isDealOfTheDay?: boolean;
  isUnder499?: boolean;
  isUnder999?: boolean;
  isStudentEssential?: boolean;
  published: boolean;
  updatedAt: string;
  source: 'manual' | 'paapi';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
  itemCount?: number;
  featuredSubcategories?: {
    id: string;
    name: string;
    path: string;
    description: string;
    image?: string;
  }[];
}

export interface ClickEvent {
  id: string;
  productId: string;
  asin: string;
  productTitle: string;
  category: string;
  pageLocation: string;
  timestamp: string;
  userAgent?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
  source: string;
  active: boolean;
}

export interface PaapiStatus {
  configured: boolean;
  partnerTag: string;
  marketplace: string;
  host: string;
  accessKeyMasked: string;
  secretKeyConfigured: boolean;
  statusMessage: string;
}

export type MerchantId = 'amazon' | 'flipkart' | 'myntra' | 'meesho' | string;
export type IntegrationStatus = 'active' | 'pending_approval' | 'configured' | 'disabled';
export type AffiliateNetworkType = 'direct' | 'cuelinks' | 'earnkaro' | 'impact' | 'admitad' | 'custom';
export type DataSourceType = 'official_api' | 'paapi' | 'product_feed' | 'manual_curation' | 'url_resolver';
export type RefreshMethodType = 'realtime_api' | 'scheduled_sync' | 'on_demand' | 'manual';
export type EventStatus = 'active' | 'upcoming' | 'expired' | 'scheduled';

export interface MerchantIntegration {
  id: MerchantId;
  name: string;
  domain: string;
  status: IntegrationStatus;
  statusNote: string;
  portalUrl: string;
  trackingConfig: {
    trackingId: string;
    paramName: string;
    network: AffiliateNetworkType;
    subIdParam?: string;
    isActive: boolean;
  };
  dataSource: {
    type: DataSourceType;
    isAuthorized: boolean;
    endpoint?: string;
    description: string;
  };
  linkRules: {
    urlTemplate: string;
    requiresCleanUrl: boolean;
    allowDeepLinks: boolean;
    exampleTransformedUrl: string;
  };
  dataRefresh: {
    method: RefreshMethodType;
    frequency: string;
    lastSync?: string;
  };
  branding: {
    primaryColor: string;
    badgeBg: string;
    badgeText: string;
  };
}

export interface ShoppingEvent {
  id: string;
  merchantId: MerchantId;
  merchantName: string;
  title: string;
  tagline: string;
  description: string;
  badgeText: string;
  destinationUrl: string;
  secondaryUrl?: string;
  secondaryCtaText?: string;
  ctaText: string;
  status: EventStatus;
  startDate?: string;
  endDate?: string;
  datesVerified: boolean;
  affiliateTracked: boolean;
  theme: {
    gradient: string;
    glowColor1: string;
    glowColor2: string;
    badgeBg: string;
    badgeText: string;
    buttonBg: string;
    buttonHover: string;
    buttonBorder: string;
    buttonText: string;
  };
}

