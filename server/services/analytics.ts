export interface OutboundClick {
  id: string;
  productId: string;
  asin: string;
  productTitle: string;
  category: string;
  pageLocation: string;
  timestamp: string;
  userAgent?: string;
}

class AnalyticsService {
  private clicks: OutboundClick[] = [];

  constructor() {
    // Seed some initial click stats for realistic demonstration
    const now = Date.now();
    this.clicks = [
      {
        id: 'clk-01',
        productId: 'boat-airdopes-141',
        asin: 'B09N3ZNHTY',
        productTitle: 'boAt Airdopes 141 Bluetooth Truly Wireless Earbuds',
        category: 'tech-gadgets',
        pageLocation: 'trending_deals',
        timestamp: new Date(now - 3600 * 1000 * 2).toISOString(),
      },
      {
        id: 'clk-02',
        productId: 'portronics-ruffpad-85',
        asin: 'B07M9T794G',
        productTitle: 'Portronics Ruffpad 8.5M Re-Writable LCD Writing Notepad',
        category: 'student-essentials',
        pageLocation: 'under_499_section',
        timestamp: new Date(now - 3600 * 1000 * 3).toISOString(),
      },
      {
        id: 'clk-03',
        productId: 'pigeon-handy-mini-chopper',
        asin: 'B01LZKTHPT',
        productTitle: 'Pigeon Handy Mini Plastic Chopper with 3 Blades',
        category: 'budget-under-499',
        pageLocation: 'home_hero',
        timestamp: new Date(now - 3600 * 1000 * 4).toISOString(),
      },
      {
        id: 'clk-04',
        productId: 'noise-pulse-2-max-smartwatch',
        asin: 'B0B3CQBRB4',
        productTitle: 'Noise Pulse 2 Max 1.85" Display Bluetooth Calling Smart Watch',
        category: 'fitness-wellness',
        pageLocation: 'product_detail_page',
        timestamp: new Date(now - 3600 * 1000 * 6).toISOString(),
      },
      {
        id: 'clk-05',
        productId: 'wipro-smart-bulb-9w',
        asin: 'B08F7J422K',
        productTitle: 'Wipro Next 9W B22 Wi-Fi Smart LED RGB Bulb',
        category: 'tech-gadgets',
        pageLocation: 'editors_picks',
        timestamp: new Date(now - 3600 * 1000 * 8).toISOString(),
      },
    ];
  }

  public recordClick(click: Omit<OutboundClick, 'id'>): OutboundClick {
    const entry: OutboundClick = {
      id: `clk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...click,
    };
    this.clicks.unshift(entry);
    // Keep last 1,000 clicks in memory
    if (this.clicks.length > 1000) {
      this.clicks = this.clicks.slice(0, 1000);
    }
    return entry;
  }

  public getSummary() {
    const totalClicks = this.clicks.length;

    // Clicks by Category
    const categoryCount: Record<string, number> = {};
    for (const c of this.clicks) {
      categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
    }

    // Top clicked products
    const productCount: Record<string, { asin: string; title: string; clicks: number }> = {};
    for (const c of this.clicks) {
      if (!productCount[c.productId]) {
        productCount[c.productId] = {
          asin: c.asin,
          title: c.productTitle,
          clicks: 0,
        };
      }
      productCount[c.productId].clicks += 1;
    }

    const topProducts = Object.entries(productCount)
      .map(([productId, val]) => ({ productId, ...val }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    return {
      totalClicks,
      topProducts,
      categoryDistribution: categoryCount,
      recentClicks: this.clicks.slice(0, 25),
    };
  }

  public exportCsv(): string {
    const headers = ['ID', 'Product ID', 'ASIN', 'Product Title', 'Category', 'Page Location', 'Timestamp'];
    const rows = this.clicks.map((c) => [
      c.id,
      c.productId,
      c.asin,
      `"${c.productTitle.replace(/"/g, '""')}"`,
      c.category,
      c.pageLocation,
      c.timestamp,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const analyticsService = new AnalyticsService();
