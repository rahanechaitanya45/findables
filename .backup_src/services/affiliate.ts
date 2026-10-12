import { Product } from '../types';

export const AMAZON_ASSOCIATE_TAG = 'amazonde0941f-21';
export const AMAZON_MARKETPLACE_DOMAIN = 'amazon.in';
export const GREAT_INDIAN_FESTIVAL_BASE_URL = 'https://www.amazon.in/events/greatindianfestival?ref_=nav_cs_gb';

/**
 * Validates whether an ASIN is a valid 10-character alphanumeric Amazon Standard Identification Number.
 */
export function isValidAsin(asin: string): boolean {
  if (!asin || typeof asin !== 'string') return false;
  const clean = asin.trim();
  return /^[A-Z0-9]{10}$/i.test(clean);
}

/**
 * Centralized affiliate URL builder adhering strictly to Amazon Associates Program Operating Agreement.
 * Product link pattern: https://www.amazon.in/dp/ASIN/?tag=amazonde0941f-21
 */
export function buildAmazonAffiliateUrl(asin: string, pageLocation: string = 'catalog'): string {
  const cleanAsin = (asin || '').trim().toUpperCase();
  if (!isValidAsin(cleanAsin)) {
    // If not a standard ASIN, route to safe search on Amazon India with affiliate tag
    const query = encodeURIComponent(asin || 'deals');
    return `https://${AMAZON_MARKETPLACE_DOMAIN}/s?k=${query}&tag=${AMAZON_ASSOCIATE_TAG}`;
  }

  // Canonical Amazon India product detail destination with tracking tag
  return `https://${AMAZON_MARKETPLACE_DOMAIN}/dp/${cleanAsin}/?tag=${AMAZON_ASSOCIATE_TAG}`;
}

/**
 * Alias for backward compatibility with existing components
 */
export const generateAmazonAffiliateUrl = buildAmazonAffiliateUrl;

/**
 * Returns the verified Great Indian Festival promotional event link with affiliate tracking ID.
 */
export function getGreatIndianFestivalUrl(): string {
  return `${GREAT_INDIAN_FESTIVAL_BASE_URL}&tag=${AMAZON_ASSOCIATE_TAG}`;
}

/**
 * Returns the Amazon India Today's Deals landing page with affiliate tracking tag.
 */
export function getAmazonTodaysDealsUrl(): string {
  return `https://${AMAZON_MARKETPLACE_DOMAIN}/deals?tag=${AMAZON_ASSOCIATE_TAG}`;
}

export const FLIPKART_BIG_BILLION_DAYS_URL = 'https://www.flipkart.com/big-billion-days-store';
export const FLIPKART_OFFERS_URL = 'https://www.flipkart.com/offers-store';

/**
 * Returns the official Flipkart Big Billion Days destination URL,
 * appending affiliate tracking ID only if configured.
 */
export function getFlipkartBigBillionDaysUrl(affiliateId?: string): string {
  if (affiliateId && affiliateId.trim()) {
    return `${FLIPKART_BIG_BILLION_DAYS_URL}?affid=${encodeURIComponent(affiliateId.trim())}`;
  }
  return FLIPKART_BIG_BILLION_DAYS_URL;
}

/**
 * Returns the official Flipkart Offers Store URL.
 */
export function getFlipkartOffersUrl(affiliateId?: string): string {
  if (affiliateId && affiliateId.trim()) {
    return `${FLIPKART_OFFERS_URL}?affid=${encodeURIComponent(affiliateId.trim())}`;
  }
  return FLIPKART_OFFERS_URL;
}

/**
 * Generates the canonical, high-resolution original Amazon product image URL
 * hosted on Amazon's CloudFront SSL CDN for any ASIN.
 */
export function getAmazonProductImageUrl(asin: string): string {
  const cleanAsin = (asin || '').trim().toUpperCase();
  if (!isValidAsin(cleanAsin)) {
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
  }
  return `https://images-na.ssl-images-amazon.com/images/P/${cleanAsin}.01._SCLZZZZZZZ_.jpg`;
}

/**
 * Asynchronously logs an outbound affiliate click event to the backend analytics tracker.
 * Uses navigator.sendBeacon where available for zero-latency background recording
 * that never delays opening the destination Amazon link.
 */
export function recordAffiliateClick(
  product: Pick<Product, 'id' | 'asin' | 'title' | 'category'>,
  pageLocation: string = 'product_card'
): void {
  const payload = {
    productId: product.id,
    asin: product.asin,
    productTitle: product.title,
    category: product.category,
    pageLocation,
    timestamp: new Date().toISOString(),
  };

  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/affiliate/click', blob);
      return;
    }
  } catch {
    // Fall through to fetch
  }

  try {
    fetch('/api/affiliate/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Non-blocking telemetry
  }
}

/**
 * Convenience helper to both log the click and open the link safely in a new tab.
 */
export function trackAndOpenAffiliateLink(
  product: Pick<Product, 'id' | 'asin' | 'title' | 'category'>,
  pageLocation: string = 'product_card'
): void {
  const url = buildAmazonAffiliateUrl(product.asin, pageLocation);
  recordAffiliateClick(product, pageLocation);
  window.open(url, '_blank', 'noopener,noreferrer');
}
