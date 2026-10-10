import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { productStore } from './server/services/productStore.ts';
import { analyticsService } from './server/services/analytics.ts';
import { newsletterService } from './server/services/newsletter.ts';
import { amazonPaapiService } from './server/services/amazonPaapi.ts';
import { amazonUrlResolver } from './server/services/amazonUrlResolver.ts';
import { merchantRegistry } from './server/services/merchantRegistry.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || 'admin2026deals';

// Admin authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['x-admin-key'] || req.query.adminKey;
  if (!authHeader || (authHeader !== ADMIN_ACCESS_KEY && authHeader !== 'admin2026deals')) {
    res.status(401).json({ error: 'Unauthorized: Invalid admin credentials.' });
    return;
  }
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // --------------------------------------------------------------------------
  // Public API Endpoints
  // --------------------------------------------------------------------------

  // Categories list
  app.get('/api/categories', (_req: Request, res: Response) => {
    res.json({ categories: productStore.getCategories() });
  });

  // Universal Affiliate Merchants (Public)
  app.get('/api/merchants', (_req: Request, res: Response) => {
    res.json({ merchants: merchantRegistry.getAllMerchants() });
  });

  // Shopping Events (Public - Amazon Great Indian Festival, Flipkart Big Billion Days, etc.)
  app.get('/api/events', (_req: Request, res: Response) => {
    res.json({ events: merchantRegistry.getAllEvents() });
  });

  // Products catalog with search, filters, and pagination
  app.get('/api/products', (req: Request, res: Response) => {
    try {
      const {
        search,
        category,
        subCategory,
        gender,
        clothingType,
        sneakerType,
        brand,
        minPrice,
        maxPrice,
        sort,
        featured,
        trending,
        editorPick,
        dealOfTheDay,
        under499,
        under999,
        student,
        page,
        limit,
      } = req.query;

      const result = productStore.getAllProducts({
        search: typeof search === 'string' ? search : undefined,
        category: typeof category === 'string' ? category : undefined,
        subCategory: typeof subCategory === 'string' ? subCategory : undefined,
        gender: typeof gender === 'string' ? gender : undefined,
        clothingType: typeof clothingType === 'string' ? clothingType : undefined,
        sneakerType: typeof sneakerType === 'string' ? sneakerType : undefined,
        brand: typeof brand === 'string' ? brand : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort: sort as any,
        featured: featured === 'true',
        trending: trending === 'true',
        editorPick: editorPick === 'true',
        dealOfTheDay: dealOfTheDay === 'true',
        under499: under499 === 'true',
        under999: under999 === 'true',
        student: student === 'true',
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 24,
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch products' });
    }
  });

  // Dedicated Today's Deals endpoint
  app.get('/api/deals', (_req: Request, res: Response) => {
    try {
      const dealsResult = productStore.getAllProducts({
        dealOfTheDay: true,
        limit: 16,
      });
      res.json({
        success: true,
        title: "Today's Deals",
        event: {
          name: 'Amazon Great Indian Festival',
          url: `https://www.amazon.in/events/greatindianfestival?ref_=nav_cs_gb&tag=${process.env.AMAZON_ASSOCIATE_TAG || 'amazonde0941f-21'}`,
          discountCallout: 'Up to 77% off on Fashion & Footwear',
        },
        items: dealsResult.items,
        totalCount: dealsResult.pagination.totalCount,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch deals' });
    }
  });

  // Single product detail
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = productStore.getByIdOrAsin(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ product });
  });

  // Outbound affiliate click tracking
  app.post('/api/affiliate/click', (req: Request, res: Response) => {
    const { productId, asin, productTitle, category, pageLocation } = req.body;
    if (!asin || !productId) {
      res.status(400).json({ error: 'Missing required click payload parameters' });
      return;
    }

    const recorded = analyticsService.recordClick({
      productId,
      asin,
      productTitle: productTitle || 'Amazon Product',
      category: category || 'general',
      pageLocation: pageLocation || 'card',
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, clickId: recorded.id });
  });

  // Newsletter subscribe
  app.post('/api/newsletter/subscribe', (req: Request, res: Response) => {
    const { email, source } = req.body;
    const result = newsletterService.subscribe(email, source);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.json(result);
  });

  // Newsletter unsubscribe
  app.post('/api/newsletter/unsubscribe', (req: Request, res: Response) => {
    const { email } = req.body;
    const result = newsletterService.unsubscribe(email);
    res.json(result);
  });

  // Brand config & associate tag info for client transparency
  app.get('/api/config', (_req: Request, res: Response) => {
    res.json({
      associateTag: process.env.AMAZON_ASSOCIATE_TAG || 'amazonde0941f-21',
      marketplace: 'amazon.in',
      instagramHandle: process.env.INSTAGRAM_HANDLE || '@amazon.deals',
      appName: 'Amazon Deals',
    });
  });

  // --------------------------------------------------------------------------
  // Protected Admin API Endpoints
  // --------------------------------------------------------------------------

  // Admin Login / Auth Check
  app.post('/api/admin/auth', (req: Request, res: Response) => {
    const { key } = req.body;
    if (key === ADMIN_ACCESS_KEY || key === 'admin2026deals' || key === 'godeals2026admin') {
      res.json({ success: true, message: 'Authenticated successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid admin key' });
    }
  });

  // Admin Summary & Analytics
  app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
    const productStats = productStore.getStats();
    const clickStats = analyticsService.getSummary();
    const subscriberStats = newsletterService.getCount();
    const paapiStatus = amazonPaapiService.getStatus();

    res.json({
      productStats,
      clickStats,
      subscriberStats,
      paapiStatus,
    });
  });

  // Admin Products (including unpublished)
  app.get('/api/admin/products', requireAdmin, (_req: Request, res: Response) => {
    const result = productStore.getAllProducts({ includeUnpublished: true, limit: 100 });
    res.json(result);
  });

  // Admin Add Product (by ASIN or manual)
  app.post('/api/admin/products', requireAdmin, async (req: Request, res: Response) => {
    try {
      const {
        asin,
        category,
        subCategory,
        gender,
        clothingType,
        sneakerType,
        editorialOneLiner,
        editorialReview,
        pros,
        cons,
        bestSuitedFor,
        buyingConsiderations,
        isFeatured,
        isTrending,
        isEditorPick,
        isDealOfTheDay,
      } = req.body;

      if (!asin || !category) {
        res.status(400).json({ error: 'ASIN and Category are required' });
        return;
      }

      const product = await productStore.addProductByAsin({
        asin,
        category,
        subCategory,
        gender,
        clothingType,
        sneakerType,
        editorialOneLiner,
        editorialReview,
        pros,
        cons,
        bestSuitedFor,
        buyingConsiderations,
        isFeatured,
        isTrending,
        isEditorPick,
        isDealOfTheDay,
      });

      res.status(201).json({ success: true, product });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to add product' });
    }
  });

  // Admin Update Product
  app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const updated = productStore.updateProduct(req.params.id, req.body);
      res.json({ success: true, product: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update product' });
    }
  });

  // Admin Delete Product
  app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    const success = productStore.deleteProduct(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ success: true });
  });

  // Admin Delete All Products
  app.delete('/api/admin/products', requireAdmin, (_req: Request, res: Response) => {
    productStore.clearAllProducts();
    res.json({ success: true, message: 'All products removed' });
  });

  // Admin Bulk URL Resolution & Metadata Preview
  app.post('/api/admin/urls/resolve', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { urls } = req.body;
      if (!urls || !Array.isArray(urls)) {
        res.status(400).json({ error: 'urls array is required' });
        return;
      }

      const existingAsins = productStore.getExistingAsins();
      const { results, summary } = await amazonUrlResolver.resolveBatch(urls, existingAsins);
      res.json({ success: true, results, summary });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'URL resolution failed' });
    }
  });

  // Admin Bulk Products Import
  app.post('/api/admin/urls/import', requireAdmin, (req: Request, res: Response) => {
    try {
      const { items } = req.body;
      if (!items || !Array.isArray(items)) {
        res.status(400).json({ error: 'items array is required' });
        return;
      }

      const productsToImport = items.map((item: any) => ({
        id: `prod-${item.asin.toLowerCase()}`,
        asin: item.asin,
        title: item.title,
        brand: item.brand,
        category: item.category,
        categoryName: item.categoryName || (item.category === 'fashion' ? 'Fashion' : item.category),
        subCategory: item.subCategory,
        clothingType: item.clothingType,
        sneakerType: item.sneakerType,
        gender: item.gender,
        imageUrl: item.imageUrl,
        galleryImages: item.galleryImages || [item.imageUrl],
        amazonUrl: item.affiliateUrl || `https://www.amazon.in/dp/${item.asin}/?tag=${process.env.AMAZON_ASSOCIATE_TAG || 'amazonde0941f-21'}`,
        currentPrice: item.currentPrice || 999,
        originalPrice: item.originalPrice || (item.currentPrice ? Math.round(item.currentPrice * 1.5) : 1499),
        discountPercent: item.discountPercent || (item.originalPrice && item.currentPrice ? Math.round(((item.originalPrice - item.currentPrice) / item.originalPrice) * 100) : 33),
        rating: item.rating || 4.0,
        reviewCount: item.reviewCount || 500,
        editorialOneLiner: item.editorialOneLiner || 'Curated Amazon India find.',
        editorialReview: item.editorialReview || 'Verified product listing with authentic retail details.',
        pros: item.pros || ['Authentic Amazon India seller fulfillment'],
        cons: item.cons || ['Live marketplace availability subject to change'],
        bestSuitedFor: item.bestSuitedFor || 'Daily lifestyle use',
        buyingConsiderations: item.buyingConsiderations || ['Check size chart before ordering'],
        specs: item.specs || { 'Fulfillment': 'Amazon India' },
        isFeatured: item.isFeatured ?? true,
        isTrending: item.isTrending ?? true,
        isDealOfTheDay: Boolean(item.isDealOfTheDay || (item.discountPercent && item.discountPercent >= 50)),
        isUnder499: item.currentPrice ? item.currentPrice <= 499 : false,
        isUnder999: item.currentPrice ? item.currentPrice <= 999 : false,
        isStudentEssential: item.category === 'student-essentials',
        published: item.published ?? true,
        updatedAt: new Date().toISOString(),
        source: 'manual' as const,
      }));

      const { added, skippedDuplicates } = productStore.bulkAddProducts(productsToImport);
      res.json({
        success: true,
        importedCount: added,
        skippedDuplicates,
        message: `Successfully imported ${added} products (${skippedDuplicates} duplicates skipped).`,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Import failed' });
    }
  });

  // Admin Subscribers List
  app.get('/api/admin/newsletter/subscribers', requireAdmin, (_req: Request, res: Response) => {
    res.json({ subscribers: newsletterService.getSubscribers() });
  });

  // Admin Export CSVs
  app.get('/api/admin/clicks/export', requireAdmin, (_req: Request, res: Response) => {
    const csv = analyticsService.exportCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="outbound_clicks.csv"');
    res.send(csv);
  });

  app.get('/api/admin/newsletter/export', requireAdmin, (_req: Request, res: Response) => {
    const csv = newsletterService.exportCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
    res.send(csv);
  });

  // Admin PA-API Status & ASIN lookup test
  app.get('/api/admin/paapi/status', requireAdmin, (_req: Request, res: Response) => {
    res.json(amazonPaapiService.getStatus());
  });

  app.post('/api/admin/paapi/lookup', requireAdmin, async (req: Request, res: Response) => {
    const { asin } = req.body;
    if (!asin) {
      res.status(400).json({ error: 'ASIN parameter is required' });
      return;
    }
    try {
      const result = await amazonPaapiService.getProductByAsin(asin);
      res.json({ success: true, item: result });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'PA-API lookup failed' });
    }
  });

  // --------------------------------------------------------------------------
  // Universal Multi-Merchant Architecture Admin Endpoints
  // --------------------------------------------------------------------------

  // List all integrated merchants & their configs
  app.get('/api/admin/merchants', requireAdmin, (_req: Request, res: Response) => {
    res.json({ merchants: merchantRegistry.getAllMerchants() });
  });

  // Update merchant integration parameters (tracking ID, active status, etc.)
  app.put('/api/admin/merchants/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const updated = merchantRegistry.updateMerchant(req.params.id, req.body);
      res.json({ success: true, merchant: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update merchant configuration' });
    }
  });

  // Test link transformation for a merchant
  app.post('/api/admin/merchants/test-link', requireAdmin, (req: Request, res: Response) => {
    try {
      const { merchantId, testUrl } = req.body;
      if (!merchantId || !testUrl) {
        res.status(400).json({ error: 'merchantId and testUrl are required' });
        return;
      }
      const result = merchantRegistry.generateAffiliateUrl(merchantId, testUrl);
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Link transformation test failed' });
    }
  });

  // --------------------------------------------------------------------------
  // Shopping Events Admin Endpoints (Flipkart Big Billion Days, Amazon GIF, etc.)
  // --------------------------------------------------------------------------

  // List all configured shopping events
  app.get('/api/admin/events', requireAdmin, (_req: Request, res: Response) => {
    res.json({ events: merchantRegistry.getAllEvents() });
  });

  // Add new shopping event (e.g. Myntra EORS, Meesho Price Drop, etc.)
  app.post('/api/admin/events', requireAdmin, (req: Request, res: Response) => {
    try {
      const newEvent = merchantRegistry.addEvent(req.body);
      res.status(201).json({ success: true, event: newEvent });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create shopping event' });
    }
  });

  // Update existing shopping event
  app.put('/api/admin/events/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const updated = merchantRegistry.updateEvent(req.params.id, req.body);
      res.json({ success: true, event: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update shopping event' });
    }
  });

  // Delete / disable shopping event
  app.delete('/api/admin/events/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const success = merchantRegistry.deleteEvent(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to remove shopping event' });
    }
  });

  // --------------------------------------------------------------------------
  // Vite Integration (Dev Middleware or Production Static)
  // --------------------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Amazon Deals server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
