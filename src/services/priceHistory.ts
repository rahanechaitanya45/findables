export interface PriceSnapshot {
  price: number;
  date: string; // e.g., '2026-09-15'
  timestamp: number;
}

export interface ProductPriceHistory {
  asin: string;
  history: PriceSnapshot[];
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  isLowestEver: boolean;
  dropPercentage: number;
  trend: 'lowest' | 'down' | 'stable' | 'up';
}

const STORAGE_KEY = 'amazon_price_history';

/**
 * Retrieves the stored price history dictionary from localStorage.
 */
function getStorageMap(): Record<string, PriceSnapshot[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Saves the price history dictionary to localStorage.
 */
function saveStorageMap(map: Record<string, PriceSnapshot[]>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn('Failed to save price history to localStorage:', err);
  }
}

/**
 * Generates initial realistic simulated historical checkpoints for a product
 * so that fresh visitors immediately experience rich, price-conscious insights.
 */
function generateInitialHistory(asin: string, currentPrice: number, originalPrice?: number): PriceSnapshot[] {
  const now = Date.now();
  const dayMs = 86400000;
  const orig = originalPrice && originalPrice > currentPrice ? originalPrice : Math.round(currentPrice * 1.15);

  // Derive deterministic pseudo-random variation based on ASIN characters
  const hash = asin.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variationFactor = ((hash % 10) - 5) / 100; // -0.05 to +0.05

  // 30 days ago: closer to original / higher baseline
  const price30dAgo = Math.round(orig * 0.98);
  // 15 days ago: intermediate promo
  const price15dAgo = Math.max(currentPrice, Math.round(currentPrice * (1.08 + variationFactor)));
  // 5 days ago: prior checkpoint
  const price5dAgo = Math.max(currentPrice, Math.round(currentPrice * (1.03 + variationFactor)));

  return [
    {
      price: price30dAgo,
      date: '30d ago',
      timestamp: now - 30 * dayMs,
    },
    {
      price: price15dAgo,
      date: '15d ago',
      timestamp: now - 15 * dayMs,
    },
    {
      price: price5dAgo,
      date: '5d ago',
      timestamp: now - 5 * dayMs,
    },
    {
      price: currentPrice,
      date: 'Today',
      timestamp: now,
    },
  ];
}

/**
 * Retrieves or registers price history for a given ASIN, calculating lowest price and trend metrics.
 */
export function getProductPriceInsight(
  asin: string,
  currentPrice: number,
  originalPrice?: number
): ProductPriceHistory {
  if (!asin || typeof currentPrice !== 'number' || currentPrice <= 0) {
    return {
      asin: asin || '',
      history: [],
      lowestPrice: currentPrice || 0,
      highestPrice: currentPrice || 0,
      averagePrice: currentPrice || 0,
      isLowestEver: true,
      dropPercentage: 0,
      trend: 'lowest',
    };
  }

  const map = getStorageMap();
  let snapshots = map[asin];

  if (!snapshots || snapshots.length === 0) {
    snapshots = generateInitialHistory(asin, currentPrice, originalPrice);
    map[asin] = snapshots;
    saveStorageMap(map);
  } else {
    // If the latest stored price differs from the current price, add today's snapshot
    const last = snapshots[snapshots.length - 1];
    if (last && Math.abs(last.price - currentPrice) > 1) {
      snapshots.push({
        price: currentPrice,
        date: 'Today',
        timestamp: Date.now(),
      });
      // Keep up to 10 historical snapshots
      if (snapshots.length > 10) {
        snapshots = snapshots.slice(snapshots.length - 10);
      }
      map[asin] = snapshots;
      saveStorageMap(map);
    }
  }

  const prices = snapshots.map((s) => s.price);
  const lowestPrice = Math.min(...prices, currentPrice);
  const highestPrice = Math.max(...prices, currentPrice, originalPrice || currentPrice);
  const averagePrice = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);

  const isLowestEver = currentPrice <= lowestPrice;
  const dropPercentage =
    averagePrice > currentPrice
      ? Math.round(((averagePrice - currentPrice) / averagePrice) * 100)
      : 0;

  let trend: 'lowest' | 'down' | 'stable' | 'up' = 'stable';
  if (isLowestEver) {
    trend = 'lowest';
  } else if (currentPrice < averagePrice) {
    trend = 'down';
  } else if (currentPrice > averagePrice * 1.05) {
    trend = 'up';
  }

  return {
    asin,
    history: snapshots,
    lowestPrice,
    highestPrice,
    averagePrice,
    isLowestEver,
    dropPercentage,
    trend,
  };
}
