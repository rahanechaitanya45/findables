import {
  MerchantIntegration,
  ShoppingEvent,
  MerchantId,
} from '../../src/types/index.js';

class MerchantRegistryService {
  private merchants: Map<string, MerchantIntegration> = new Map();
  private shoppingEvents: Map<string, ShoppingEvent> = new Map();

  constructor() {
    this.seedDefaultMerchants();
    this.seedDefaultEvents();
  }

  private seedDefaultMerchants(): void {
    const amazonTag = process.env.AMAZON_ASSOCIATE_TAG || 'amazonde0941f-21';

    // 1. Amazon India (Active)
    this.merchants.set('amazon', {
      id: 'amazon',
      name: 'Amazon India',
      domain: 'amazon.in',
      status: 'active',
      statusNote: `Active Amazon Associates Program with approved tracking tag "${amazonTag}".`,
      portalUrl: 'https://affiliate-program.amazon.in/',
      trackingConfig: {
        trackingId: amazonTag,
        paramName: 'tag',
        network: 'direct',
        isActive: true,
      },
      dataSource: {
        type: 'paapi',
        isAuthorized: true,
        endpoint: 'webservices.amazon.in',
        description: 'Amazon Product Advertising API (PA-API v5) & Verified URL Resolver',
      },
      linkRules: {
        urlTemplate: 'https://www.amazon.in/dp/{id}/?tag={trackingId}',
        requiresCleanUrl: true,
        allowDeepLinks: true,
        exampleTransformedUrl: `https://www.amazon.in/dp/B000GAYQJ0/?tag=${amazonTag}`,
      },
      dataRefresh: {
        method: 'on_demand',
        frequency: 'Instant metadata fetch on ASIN ingestion',
        lastSync: new Date().toISOString(),
      },
      branding: {
        primaryColor: '#FF9900',
        badgeBg: '#FF9900',
        badgeText: '#0F1111',
      },
    });

    // 2. Flipkart (Configurable Architecture)
    const flipkartId = process.env.FLIPKART_AFFILIATE_ID || '';
    this.merchants.set('flipkart', {
      id: 'flipkart',
      name: 'Flipkart',
      domain: 'flipkart.com',
      status: flipkartId ? 'configured' : 'pending_approval',
      statusNote: flipkartId
        ? `Configured with affiliate ID "${flipkartId}".`
        : 'Architecture ready. Enter approved Flipkart AffID or partner network credentials in Admin to activate tracking.',
      portalUrl: 'https://affiliate.flipkart.com/',
      trackingConfig: {
        trackingId: flipkartId,
        paramName: 'affid',
        network: 'direct',
        isActive: Boolean(flipkartId),
      },
      dataSource: {
        type: 'official_api',
        isAuthorized: false,
        endpoint: 'affiliate-api.flipkart.net',
        description: 'Flipkart Affiliate API & Curated Product Feeds (Awaiting approved credentials)',
      },
      linkRules: {
        urlTemplate: 'https://www.flipkart.com/{path}?affid={trackingId}',
        requiresCleanUrl: true,
        allowDeepLinks: true,
        exampleTransformedUrl: flipkartId
          ? `https://www.flipkart.com/big-billion-days-store?affid=${flipkartId}`
          : 'https://www.flipkart.com/big-billion-days-store?affid=[YOUR_FLIPKART_AFFID]',
      },
      dataRefresh: {
        method: 'scheduled_sync',
        frequency: 'Configurable hourly/daily automated feed sync',
      },
      branding: {
        primaryColor: '#2874F0',
        badgeBg: '#2874F0',
        badgeText: '#FFFFFF',
      },
    });

    // 3. Myntra (Configurable Architecture)
    const myntraId = process.env.MYNTRA_AFFILIATE_ID || '';
    this.merchants.set('myntra', {
      id: 'myntra',
      name: 'Myntra',
      domain: 'myntra.com',
      status: myntraId ? 'configured' : 'pending_approval',
      statusNote: myntraId
        ? `Configured with partner ID "${myntraId}".`
        : 'Integration ready for Myntra Partner Program or affiliate network (Cuelinks/EarnKaro/Impact).',
      portalUrl: 'https://partner.myntra.com/',
      trackingConfig: {
        trackingId: myntraId,
        paramName: 'utm_source',
        network: 'cuelinks',
        subIdParam: 'subid',
        isActive: Boolean(myntraId),
      },
      dataSource: {
        type: 'product_feed',
        isAuthorized: false,
        description: 'Authorized Myntra partner fashion catalogue and deal feeds',
      },
      linkRules: {
        urlTemplate: 'https://www.myntra.com/{path}?utm_source={trackingId}',
        requiresCleanUrl: true,
        allowDeepLinks: true,
        exampleTransformedUrl: myntraId
          ? `https://www.myntra.com/fashion-deals?utm_source=${myntraId}`
          : 'https://www.myntra.com/fashion-deals?utm_source=[YOUR_PARTNER_TAG]',
      },
      dataRefresh: {
        method: 'manual',
        frequency: 'Weekly fashion editorial review',
      },
      branding: {
        primaryColor: '#FF3F6C',
        badgeBg: '#FF3F6C',
        badgeText: '#FFFFFF',
      },
    });

    // 4. Meesho (Configurable Architecture)
    const meeshoId = process.env.MEESHO_AFFILIATE_ID || '';
    this.merchants.set('meesho', {
      id: 'meesho',
      name: 'Meesho',
      domain: 'meesho.com',
      status: meeshoId ? 'configured' : 'pending_approval',
      statusNote: meeshoId
        ? `Configured with reseller/affiliate ID "${meeshoId}".`
        : 'Integration ready for Meesho affiliate or partner network tracking.',
      portalUrl: 'https://supplier.meesho.com/',
      trackingConfig: {
        trackingId: meeshoId,
        paramName: 'ref',
        network: 'earnkaro',
        isActive: Boolean(meeshoId),
      },
      dataSource: {
        type: 'manual_curation',
        isAuthorized: false,
        description: 'Verified value-budget picks and reseller catalogues',
      },
      linkRules: {
        urlTemplate: 'https://www.meesho.com/{path}?ref={trackingId}',
        requiresCleanUrl: true,
        allowDeepLinks: true,
        exampleTransformedUrl: meeshoId
          ? `https://www.meesho.com/products?ref=${meeshoId}`
          : 'https://www.meesho.com/products?ref=[YOUR_MEESHO_REF]',
      },
      dataRefresh: {
        method: 'manual',
        frequency: 'Bi-weekly catalog review',
      },
      branding: {
        primaryColor: '#9C27B0',
        badgeBg: '#9C27B0',
        badgeText: '#FFFFFF',
      },
    });
  }

  private seedDefaultEvents(): void {
    const amazonTag = process.env.AMAZON_ASSOCIATE_TAG || 'amazonde0941f-21';

    // 1. Amazon Great Indian Festival (Preserved exactly as existing)
    this.shoppingEvents.set('amazon-gif', {
      id: 'amazon-gif',
      merchantId: 'amazon',
      merchantName: 'Amazon India',
      title: 'Great Indian Festival 2026',
      tagline: 'Amazon India Official Event',
      description:
        'Blockbuster discounts up to 77% on trending clothes, sneakers, and everyday essentials. Shop official deals directly on Amazon.in with Prime fast delivery & easy returns.',
      badgeText: 'Amazon India Official Event',
      destinationUrl: `https://www.amazon.in/events/greatindianfestival?ref_=nav_cs_gb&tag=${amazonTag}`,
      secondaryUrl: `https://www.amazon.in/deals?tag=${amazonTag}`,
      secondaryCtaText: 'Explore All Amazon Deals',
      ctaText: 'Explore Great Indian Festival',
      status: 'active',
      startDate: '2026-09-26',
      endDate: '2026-10-31',
      datesVerified: true,
      affiliateTracked: true,
      theme: {
        gradient: 'bg-gradient-to-r from-[#131921] via-[#232F3E] to-[#131921]',
        glowColor1: 'bg-[#FF9900]/15',
        glowColor2: 'bg-[#CC0C39]/15',
        badgeBg: 'bg-[#FF9900] text-slate-950',
        badgeText: 'text-slate-950',
        buttonBg: 'bg-[#FFD814]',
        buttonHover: 'hover:bg-[#F7CA00]',
        buttonBorder: 'border-[#FCD200]',
        buttonText: 'text-slate-950',
      },
    });

    // 2. Flipkart Big Billion Days (New, matching dimensions, style & verified destination)
    const flipkartMerchant = this.merchants.get('flipkart');
    const flipkartTrackedUrl =
      flipkartMerchant && flipkartMerchant.trackingConfig.isActive && flipkartMerchant.trackingConfig.trackingId
        ? `https://www.flipkart.com/big-billion-days-store?affid=${flipkartMerchant.trackingConfig.trackingId}`
        : 'https://www.flipkart.com/big-billion-days-store';

    this.shoppingEvents.set('flipkart-bbd', {
      id: 'flipkart-bbd',
      merchantId: 'flipkart',
      merchantName: 'Flipkart',
      title: 'Flipkart Big Billion Days 2026',
      tagline: 'Flipkart Flagship Shopping Event',
      description:
        "India's biggest festive carnival featuring mega price drops on top brands, fashion specials, sneaker drops, and electronic deals with verified partner fulfillment.",
      badgeText: 'Flipkart Official Flagship Sale',
      destinationUrl: flipkartTrackedUrl,
      secondaryUrl: 'https://www.flipkart.com/offers-store',
      secondaryCtaText: 'Explore Flipkart Top Offers',
      ctaText: 'Explore Big Billion Days',
      status: 'upcoming',
      startDate: 'Festive Season (September/October)',
      endDate: 'Festive Finale',
      datesVerified: true,
      affiliateTracked: Boolean(flipkartMerchant?.trackingConfig.isActive),
      theme: {
        gradient: 'bg-gradient-to-r from-[#0a2540] via-[#103e7a] to-[#0a2540]',
        glowColor1: 'bg-[#2874F0]/25',
        glowColor2: 'bg-[#FFE500]/20',
        badgeBg: 'bg-[#FFE500] text-blue-950',
        badgeText: 'text-blue-950 font-extrabold',
        buttonBg: 'bg-[#FFE500]',
        buttonHover: 'hover:bg-[#f0d600]',
        buttonBorder: 'border-[#ebd200]',
        buttonText: 'text-blue-950 font-extrabold',
      },
    });
  }

  public getAllMerchants(): MerchantIntegration[] {
    return Array.from(this.merchants.values());
  }

  public getMerchant(id: string): MerchantIntegration | undefined {
    return this.merchants.get(id);
  }

  public updateMerchant(id: string, updates: Partial<MerchantIntegration>): MerchantIntegration {
    const current = this.merchants.get(id);
    if (!current) {
      throw new Error(`Merchant with id "${id}" not found.`);
    }

    const updated: MerchantIntegration = {
      ...current,
      ...updates,
      trackingConfig: {
        ...current.trackingConfig,
        ...(updates.trackingConfig || {}),
      },
      dataSource: {
        ...current.dataSource,
        ...(updates.dataSource || {}),
      },
      linkRules: {
        ...current.linkRules,
        ...(updates.linkRules || {}),
      },
      dataRefresh: {
        ...current.dataRefresh,
        ...(updates.dataRefresh || {}),
      },
      branding: {
        ...current.branding,
        ...(updates.branding || {}),
      },
    };

    // Auto-update status if trackingId is provided or cleared
    if (updates.trackingConfig?.trackingId) {
      updated.trackingConfig.isActive = true;
      if (updated.status === 'pending_approval') {
        updated.status = 'configured';
      }
    }

    this.merchants.set(id, updated);

    // If flipkart was updated, also update flipkart event link
    if (id === 'flipkart') {
      const flipkartEvent = this.shoppingEvents.get('flipkart-bbd');
      if (flipkartEvent) {
        if (updated.trackingConfig.isActive && updated.trackingConfig.trackingId) {
          flipkartEvent.destinationUrl = `https://www.flipkart.com/big-billion-days-store?affid=${updated.trackingConfig.trackingId}`;
          flipkartEvent.affiliateTracked = true;
        } else {
          flipkartEvent.destinationUrl = 'https://www.flipkart.com/big-billion-days-store';
          flipkartEvent.affiliateTracked = false;
        }
      }
    }

    return updated;
  }

  public getAllEvents(): ShoppingEvent[] {
    return Array.from(this.shoppingEvents.values());
  }

  public getEvent(id: string): ShoppingEvent | undefined {
    return this.shoppingEvents.get(id);
  }

  public updateEvent(id: string, updates: Partial<ShoppingEvent>): ShoppingEvent {
    const current = this.shoppingEvents.get(id);
    if (!current) {
      throw new Error(`Shopping event "${id}" not found.`);
    }

    const updated: ShoppingEvent = {
      ...current,
      ...updates,
      theme: {
        ...current.theme,
        ...(updates.theme || {}),
      },
    };

    this.shoppingEvents.set(id, updated);
    return updated;
  }

  public addEvent(eventData: Omit<ShoppingEvent, 'id'> & { id?: string }): ShoppingEvent {
    const id = eventData.id || `event-${Date.now()}`;
    const newEvent: ShoppingEvent = {
      ...eventData,
      id,
    };
    this.shoppingEvents.set(id, newEvent);
    return newEvent;
  }

  public deleteEvent(id: string): boolean {
    if (id === 'amazon-gif' || id === 'flipkart-bbd') {
      // Prevent deleting core required festive events, but allow disabling
      const evt = this.shoppingEvents.get(id);
      if (evt) {
        evt.status = 'expired';
        return true;
      }
    }
    return this.shoppingEvents.delete(id);
  }

  /**
   * Generates or tests a destination affiliate URL for any merchant
   */
  public generateAffiliateUrl(merchantId: string, rawUrlOrPath: string): {
    originalUrl: string;
    transformedUrl: string;
    isAffiliateTracked: boolean;
    merchantName: string;
    ruleApplied: string;
  } {
    const merchant = this.merchants.get(merchantId);
    if (!merchant) {
      throw new Error(`Merchant "${merchantId}" not found`);
    }

    const hasTracking = merchant.trackingConfig.isActive && Boolean(merchant.trackingConfig.trackingId);

    let cleanTarget = (rawUrlOrPath || '').trim();
    if (!cleanTarget.startsWith('http://') && !cleanTarget.startsWith('https://')) {
      cleanTarget = `https://${merchant.domain}/${cleanTarget.replace(/^\/+/, '')}`;
    }

    let transformedUrl = cleanTarget;
    let ruleApplied = 'Direct merchant destination (no tracking tag attached)';

    if (hasTracking) {
      try {
        const urlObj = new URL(cleanTarget);
        urlObj.searchParams.set(merchant.trackingConfig.paramName, merchant.trackingConfig.trackingId);
        transformedUrl = urlObj.toString();
        ruleApplied = `Appended ${merchant.trackingConfig.paramName}=${merchant.trackingConfig.trackingId}`;
      } catch {
        // Fallback simple query append
        const joinChar = cleanTarget.includes('?') ? '&' : '?';
        transformedUrl = `${cleanTarget}${joinChar}${merchant.trackingConfig.paramName}=${merchant.trackingConfig.trackingId}`;
        ruleApplied = `Appended parameter with ${joinChar}`;
      }
    }

    return {
      originalUrl: rawUrlOrPath,
      transformedUrl,
      isAffiliateTracked: hasTracking,
      merchantName: merchant.name,
      ruleApplied,
    };
  }
}

export const merchantRegistry = new MerchantRegistryService();
