import { AMAZON_ASSOCIATE_TAG, isValidAsin } from '../../src/services/affiliate.js';

export interface ResolvedAmazonProduct {
  inputUrl: string;
  resolvedUrl: string;
  asin: string;
  title: string;
  brand: string;
  imageUrl: string;
  galleryImages: string[];
  currentPrice: number | null;
  originalPrice: number | null;
  discountPercent: number | null;
  rating: number | null;
  reviewCount: number | null;
  category: string;
  categoryName: string;
  subCategory?: 'clothes' | 'sneakers' | string;
  clothingType?: string;
  sneakerType?: string;
  gender?: 'men' | 'women' | 'unisex';
  affiliateUrl: string;
  editorialOneLiner: string;
  editorialReview: string;
  pros: string[];
  cons: string[];
  bestSuitedFor: string;
  buyingConsiderations: string[];
  isDuplicate: boolean;
  status: 'ready' | 'review_required' | 'duplicate' | 'failed';
  errorMessage?: string;
}

export class AmazonUrlResolverService {
  private partnerTag: string;

  constructor() {
    this.partnerTag = process.env.AMAZON_ASSOCIATE_TAG || AMAZON_ASSOCIATE_TAG || 'amazonde0941f-21';
  }

  /**
   * Resolves an Amazon URL (shortened or full), extracts ASIN, and fetches authorized product metadata.
   */
  public async resolveUrl(
    urlStr: string,
    existingAsins: Set<string> = new Set()
  ): Promise<ResolvedAmazonProduct> {
    const trimmedUrl = urlStr.trim();
    if (!trimmedUrl) {
      return this.createFailedResult(trimmedUrl, '', 'Empty URL provided');
    }

    try {
      // 1. Resolve redirect to canonical destination
      const response = await fetch(trimmedUrl, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-IN,en;q=0.9',
        },
      });

      const finalUrl = response.url || trimmedUrl;

      // 2. Extract ASIN
      const asin = this.extractAsin(finalUrl) || this.extractAsin(trimmedUrl);
      if (!asin || !isValidAsin(asin)) {
        return this.createFailedResult(
          trimmedUrl,
          finalUrl,
          'Unable to extract valid Amazon ASIN from destination URL'
        );
      }

      const cleanAsin = asin.toUpperCase();

      // Check duplicate
      const isDuplicate = existingAsins.has(cleanAsin);

      // Read page HTML from response or re-fetch mobile endpoint
      let html = await response.text();
      if (!html || html.length < 500 || html.includes('api-services-support@amazon.com')) {
        // Fetch mobile web page explicitly
        try {
          const mobileResp = await fetch(`https://www.amazon.in/gp/aw/d/${cleanAsin}`, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-IN,en;q=0.9',
            },
          });
          if (mobileResp.ok) {
            html = await mobileResp.text();
          }
        } catch {
          // ignore fallback error
        }
      }

      // 3. Extract verified fields
      const meta = this.parseProductHtml(html, cleanAsin);

      // 4. Build canonical Amazon affiliate URL with partner tracking tag
      const affiliateUrl = `https://www.amazon.in/dp/${cleanAsin}/?tag=${this.partnerTag}`;

      // 5. Categorization
      const categorization = this.detectCategoryAndSubcategory(meta.title, meta.brand);

      const status: ResolvedAmazonProduct['status'] = isDuplicate
        ? 'duplicate'
        : meta.title
        ? 'ready'
        : 'review_required';

      return {
        inputUrl: trimmedUrl,
        resolvedUrl: `https://www.amazon.in/dp/${cleanAsin}`,
        asin: cleanAsin,
        title: meta.title || `Amazon Product (${cleanAsin})`,
        brand: meta.brand || categorization.suggestedBrand || 'Amazon Verified',
        imageUrl:
          meta.imageUrl ||
          `https://images-na.ssl-images-amazon.com/images/P/${cleanAsin}.01._SCLZZZZZZZ_.jpg`,
        galleryImages: meta.galleryImages,
        currentPrice: meta.currentPrice,
        originalPrice: meta.originalPrice,
        discountPercent: meta.discountPercent,
        rating: meta.rating,
        reviewCount: meta.reviewCount,
        category: categorization.category,
        categoryName: categorization.categoryName,
        subCategory: categorization.subCategory,
        clothingType: categorization.clothingType,
        sneakerType: categorization.sneakerType,
        gender: categorization.gender,
        affiliateUrl,
        editorialOneLiner:
          categorization.editorialOneLiner ||
          `Verified Amazon India find from ${meta.brand || 'trusted brand'} with solid everyday performance.`,
        editorialReview:
          `Curated selection on Amazon India featuring direct fulfillment, verified materials, and authentic retail standards.`,
        pros: categorization.pros,
        cons: ['Stock and pricing on Amazon India subject to live marketplace changes'],
        bestSuitedFor: categorization.bestSuitedFor,
        buyingConsiderations: [
          'Order your standard size as per Amazon customer feedback',
          'Free delivery eligible on qualifying Amazon Prime orders',
        ],
        isDuplicate,
        status,
        errorMessage: isDuplicate ? `ASIN ${cleanAsin} is already present in catalog` : undefined,
      };
    } catch (err: any) {
      return this.createFailedResult(trimmedUrl, '', err.message || 'Network request failed');
    }
  }

  /**
   * Batch resolves multiple Amazon URLs with deduplication and tracking.
   */
  public async resolveBatch(
    urls: string[],
    existingAsins: Set<string> = new Set()
  ): Promise<{
    results: ResolvedAmazonProduct[];
    summary: {
      total: number;
      unique: number;
      ready: number;
      duplicates: number;
      reviewRequired: number;
      failed: number;
    };
  }> {
    const seenInBatch = new Set<string>();
    const results: ResolvedAmazonProduct[] = [];

    for (const url of urls) {
      const cleanUrl = url.trim();
      if (!cleanUrl) continue;

      const res = await this.resolveUrl(cleanUrl, existingAsins);

      // Check if duplicate within this batch itself
      if (seenInBatch.has(res.asin)) {
        res.isDuplicate = true;
        res.status = 'duplicate';
        res.errorMessage = `Duplicate URL in import list (ASIN ${res.asin} already added earlier in list)`;
      } else if (res.asin && !res.isDuplicate) {
        seenInBatch.add(res.asin);
      }

      results.push(res);
    }

    const summary = {
      total: results.length,
      unique: seenInBatch.size,
      ready: results.filter((r) => r.status === 'ready').length,
      duplicates: results.filter((r) => r.status === 'duplicate').length,
      reviewRequired: results.filter((r) => r.status === 'review_required').length,
      failed: results.filter((r) => r.status === 'failed').length,
    };

    return { results, summary };
  }

  /**
   * Extracts 10-character alphanumeric ASIN from Amazon URL string
   */
  private extractAsin(url: string): string | null {
    if (!url) return null;
    const match =
      url.match(/\/(?:dp|gp\/product|d|gp\/aw\/d)\/([A-Z0-9]{10})/i) ||
      url.match(/[?&]asin=([A-Z0-9]{10})/i) ||
      url.match(/\/([A-Z0-9]{10})(?:[/?#]|$)/i);
    return match ? match[1] : null;
  }

  /**
   * Parses authentic product metadata from Amazon.in HTML
   */
  private parseProductHtml(
    html: string,
    asin: string
  ): {
    title: string;
    brand: string;
    imageUrl: string;
    galleryImages: string[];
    currentPrice: number | null;
    originalPrice: number | null;
    discountPercent: number | null;
    rating: number | null;
    reviewCount: number | null;
  } {
    // 1. Title
    let rawTitle = '';
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      rawTitle = titleMatch[1].trim();
    }
    if (!rawTitle || rawTitle.toLowerCase() === 'amazon.in') {
      const h1Match = html.match(/<span\s+id="productTitle"[^>]*>(.*?)<\/span>/i);
      if (h1Match) rawTitle = h1Match[1].trim();
    }

    // Clean title prefixes & suffixes
    let cleanTitle = rawTitle
      .replace(/^Buy\s+/i, '')
      .replace(/\s+at\s+Amazon\.in.*$/i, '')
      .replace(/\s*:\s*Amazon\.in.*$/i, '')
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .trim();

    // 2. Brand
    let brand = '';
    const bylineMatch = html.match(/id="bylineInfo"[^>]*>(?:Brand:\s*|Visit the\s*)?(.*?)(?:\s*Store)?<\/a>/i);
    if (bylineMatch) brand = bylineMatch[1].trim();
    if (!brand) {
      const brandJson = html.match(/"brand":\s*"([^"]+)"/i);
      if (brandJson) brand = brandJson[1].trim();
    }
    if (!brand) {
      const metaBrand = html.match(/data-brand="([^"]+)"/i);
      if (metaBrand) brand = metaBrand[1].trim();
    }

    // If still empty, infer from title leading words
    if (!brand && cleanTitle) {
      if (/^adidas/i.test(cleanTitle)) brand = 'adidas';
      else if (/^puma/i.test(cleanTitle)) brand = 'PUMA';
      else if (/^casio/i.test(cleanTitle)) brand = 'Casio';
      else if (/^allen\s+solly/i.test(cleanTitle)) brand = 'Allen Solly';
      else if (/^deelmo/i.test(cleanTitle)) brand = 'DEELMO';
      else if (/^peter\s+england/i.test(cleanTitle)) brand = 'Peter England';
      else if (/^wrogn/i.test(cleanTitle)) brand = 'WROGN';
      else if (/^highlander/i.test(cleanTitle)) brand = 'Highlander';
    }

    // 3. Images
    const images: string[] = [];
    const imgMatches = html.matchAll(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9_\-\.%]+\.(?:jpg|png|jpeg)/gi);
    for (const match of imgMatches) {
      const src = match[0];
      if (
        !src.includes('_SS') &&
        !src.includes('_SX38_') &&
        !src.includes('_SY38_') &&
        !src.includes('nav') &&
        !src.includes('sprite') &&
        !src.includes('play-button') &&
        !images.includes(src)
      ) {
        images.push(src);
      }
    }

    const primaryImage =
      images.find((img) => img.includes('1000') || img.includes('1100')) ||
      images[0] ||
      `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`;

    // 4. Current Price
    let currentPrice: number | null = null;
    const priceWhole = html.match(/class="[^"]*a-price-whole[^"]*">([0-9,]+)/i);
    if (priceWhole) {
      currentPrice = parseInt(priceWhole[1].replace(/,/g, ''), 10);
    }

    // 5. Original Price (MRP)
    let originalPrice: number | null = null;
    const mrpMatch = html.match(/class="[^"]*a-text-price[^"]*"[^>]*>.*?([0-9,]+)/is);
    if (mrpMatch) {
      originalPrice = parseInt(mrpMatch[1].replace(/,/g, ''), 10);
    }

    // 6. Discount Percent
    let discountPercent: number | null = null;
    if (currentPrice && originalPrice && originalPrice > currentPrice) {
      discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }

    // 7. Rating
    let rating: number | null = null;
    const ratingMatch = html.match(/([0-9\.]+)\s*(?:out of 5 stars|von 5 Sternen)/i);
    if (ratingMatch) {
      const parsed = parseFloat(ratingMatch[1]);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) rating = parsed;
    }

    // 8. Review count
    let reviewCount: number | null = null;
    const reviewMatch = html.match(/([0-9,]+)\s*(?:ratings|ratings and reviews)/i);
    if (reviewMatch) {
      reviewCount = parseInt(reviewMatch[1].replace(/,/g, ''), 10);
    }

    return {
      title: cleanTitle,
      brand,
      imageUrl: primaryImage,
      galleryImages: images.slice(0, 4),
      currentPrice,
      originalPrice,
      discountPercent,
      rating,
      reviewCount,
    };
  }

  /**
   * Intelligently assigns category, subcategory, gender, and style based on product title & brand
   */
  private detectCategoryAndSubcategory(
    title: string,
    brand: string
  ): {
    category: string;
    categoryName: string;
    subCategory?: 'clothes' | 'sneakers' | string;
    clothingType?: string;
    sneakerType?: string;
    gender?: 'men' | 'women' | 'unisex';
    suggestedBrand?: string;
    editorialOneLiner: string;
    bestSuitedFor: string;
    pros: string[];
  } {
    const t = (title || '').toLowerCase();

    // Check Sneakers
    if (
      t.includes('sneaker') ||
      t.includes('shoe') ||
      t.includes('running') ||
      t.includes('fleetfly') ||
      t.includes('smashic') ||
      t.includes('soulzie') ||
      t.includes('court curves')
    ) {
      const isRunning = t.includes('running') || t.includes('air-fleetfly');
      const isUnisex = t.includes('unisex') || t.includes('court curves') || t.includes('ferrari');
      return {
        category: 'fashion',
        categoryName: 'Fashion',
        subCategory: 'sneakers',
        sneakerType: isRunning ? 'running' : 'casual',
        gender: isUnisex ? 'unisex' : 'men',
        editorialOneLiner: `Comfortable and versatile ${brand || 'sportstyle'} sneakers designed for daily wear.`,
        bestSuitedFor: isRunning
          ? 'Everyday jogging, workouts, and brisk city walking'
          : 'Casual outings, campus wear, and weekend styling',
        pros: ['Cushioned midsole for step-in comfort', 'Grippy rubber outsole with durable traction'],
      };
    }

    // Check Clothes (Shirts, T-shirts, etc.)
    if (
      t.includes('shirt') ||
      t.includes('t-shirt') ||
      t.includes('tee') ||
      t.includes('cotton blend') ||
      t.includes('pure cotton') ||
      t.includes('slim fit')
    ) {
      return {
        category: 'fashion',
        categoryName: 'Fashion',
        subCategory: 'clothes',
        clothingType: 't-shirts-shirts',
        gender: 'men',
        editorialOneLiner: `Breathable and sharp ${brand || 'casual'} shirt with tailored slim fit cut.`,
        bestSuitedFor: 'Office casuals, weekend dinners, and smart everyday layering',
        pros: ['Breathable cotton fabric', 'Structured collar and modern slim profile'],
      };
    }

    // Check Watches & Timepieces
    if (t.includes('watch') || t.includes('casio') || t.includes('digital') || t.includes('a-158')) {
      return {
        category: 'student-essentials',
        categoryName: 'Student Essentials',
        editorialOneLiner: 'Timeless retro digital stainless steel watch with 7-year battery life.',
        bestSuitedFor: 'College students, daily commute, and minimalist retro aesthetics',
        pros: ['Legendary 7-year battery longevity', 'Water-resistant retro stainless steel design'],
      };
    }

    // Default to Fashion / Clothes
    return {
      category: 'fashion',
      categoryName: 'Fashion',
      subCategory: 'clothes',
      clothingType: 't-shirts-shirts',
      gender: 'men',
      editorialOneLiner: `Curated pick from ${brand || 'Amazon India'}.`,
      bestSuitedFor: 'Daily everyday use',
      pros: ['Authentic Amazon India seller fulfillment'],
    };
  }

  private createFailedResult(
    inputUrl: string,
    resolvedUrl: string,
    errorMessage: string
  ): ResolvedAmazonProduct {
    return {
      inputUrl,
      resolvedUrl,
      asin: '',
      title: 'Resolution Failed',
      brand: '',
      imageUrl: '',
      galleryImages: [],
      currentPrice: null,
      originalPrice: null,
      discountPercent: null,
      rating: null,
      reviewCount: null,
      category: 'fashion',
      categoryName: 'Fashion',
      affiliateUrl: '',
      editorialOneLiner: '',
      editorialReview: '',
      pros: [],
      cons: [],
      bestSuitedFor: '',
      buyingConsiderations: [],
      isDuplicate: false,
      status: 'failed',
      errorMessage,
    };
  }
}

export const amazonUrlResolver = new AmazonUrlResolverService();
