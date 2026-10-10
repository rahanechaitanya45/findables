import { INITIAL_PRODUCTS, CATEGORIES } from '../../src/data/mockProducts.ts';
import { Product, Category } from '../../src/types/index.ts';
import { amazonPaapiService } from './amazonPaapi.ts';

class ProductStore {
  private products: Product[] = [];
  private categories: Category[] = [];

  constructor() {
    this.products = [...INITIAL_PRODUCTS];
    this.categories = [...CATEGORIES];
  }

  public getCategories(): Category[] {
    return this.categories;
  }

  public getAllProducts(params?: {
    search?: string;
    category?: string;
    subCategory?: string;
    gender?: string;
    clothingType?: string;
    sneakerType?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'recommended' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
    featured?: boolean;
    trending?: boolean;
    editorPick?: boolean;
    dealOfTheDay?: boolean;
    under499?: boolean;
    under999?: boolean;
    student?: boolean;
    includeUnpublished?: boolean;
    page?: number;
    limit?: number;
  }) {
    let list = [...this.products];

    // Filter by publication status
    if (!params?.includeUnpublished) {
      list = list.filter((p) => p.published);
    }

    // Search query
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.asin.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
          p.editorialOneLiner.toLowerCase().includes(q) ||
          p.editorialReview.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (params?.category && params.category !== 'all') {
      list = list.filter((p) => p.category === params.category);
    }

    // SubCategory filter (e.g. 'clothes', 'sneakers')
    if (params?.subCategory && params.subCategory !== 'all') {
      list = list.filter((p) => p.subCategory === params.subCategory);
    }

    // Gender filter (e.g. 'men', 'women')
    if (params?.gender && params.gender !== 'all') {
      list = list.filter((p) => p.gender === params.gender || p.gender === 'unisex');
    }

    // Clothing type filter
    if (params?.clothingType && params.clothingType !== 'all') {
      list = list.filter((p) => p.clothingType === params.clothingType);
    }

    // Sneaker type filter
    if (params?.sneakerType && params.sneakerType !== 'all') {
      list = list.filter((p) => p.sneakerType === params.sneakerType);
    }

    // Brand filter
    if (params?.brand && params.brand !== 'all') {
      list = list.filter((p) => p.brand.toLowerCase() === params.brand?.toLowerCase());
    }

    // Price range
    if (typeof params?.minPrice === 'number' && !isNaN(params.minPrice)) {
      list = list.filter((p) => p.currentPrice >= params.minPrice!);
    }
    if (typeof params?.maxPrice === 'number' && !isNaN(params.maxPrice)) {
      list = list.filter((p) => p.currentPrice <= params.maxPrice!);
    }

    // Curated tags
    if (params?.featured) {
      list = list.filter((p) => p.isFeatured);
    }
    if (params?.trending) {
      list = list.filter((p) => p.isTrending);
    }
    if (params?.editorPick) {
      list = list.filter((p) => p.isEditorPick);
    }
    if (params?.dealOfTheDay) {
      list = list.filter((p) => p.isDealOfTheDay || (p.discountPercent && p.discountPercent >= 40));
    }
    if (params?.under499) {
      list = list.filter((p) => p.currentPrice <= 499 || p.isUnder499);
    }
    if (params?.under999) {
      list = list.filter((p) => p.currentPrice <= 999 || p.isUnder999);
    }
    if (params?.student) {
      list = list.filter((p) => p.isStudentEssential || p.category === 'student-essentials');
    }

    // Sorting
    const sort = params?.sort || 'recommended';
    if (sort === 'price_asc') {
      list.sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.currentPrice - a.currentPrice);
    } else if (sort === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'newest') {
      list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else {
      // Recommended: deals & featured first, then rating
      list.sort((a, b) => {
        const scoreA = (a.isDealOfTheDay ? 4 : 0) + (a.isEditorPick ? 3 : 0) + (a.isTrending ? 2 : 0) + (a.isFeatured ? 1 : 0);
        const scoreB = (b.isDealOfTheDay ? 4 : 0) + (b.isEditorPick ? 3 : 0) + (b.isTrending ? 2 : 0) + (b.isFeatured ? 1 : 0);
        return scoreB - scoreA;
      });
    }

    // Pagination
    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, Math.min(100, params?.limit || 24));
    const totalCount = list.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginatedItems = list.slice((page - 1) * limit, page * limit);

    return {
      items: paginatedItems,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    };
  }

  public getByIdOrAsin(idOrAsin: string): Product | null {
    const clean = idOrAsin.trim().toLowerCase();
    return this.products.find((p) => p.id.toLowerCase() === clean || p.asin.toLowerCase() === clean) || null;
  }

  public async addProductByAsin(data: {
    asin: string;
    category: string;
    subCategory?: string;
    gender?: 'men' | 'women' | 'unisex';
    clothingType?: string;
    sneakerType?: string;
    editorialOneLiner: string;
    editorialReview: string;
    pros?: string[];
    cons?: string[];
    bestSuitedFor?: string;
    buyingConsiderations?: string[];
    isFeatured?: boolean;
    isTrending?: boolean;
    isEditorPick?: boolean;
    isDealOfTheDay?: boolean;
  }): Promise<Product> {
    const cleanAsin = data.asin.trim().toUpperCase();
    const existing = this.products.find((p) => p.asin.toUpperCase() === cleanAsin);
    if (existing) {
      throw new Error(`Product with ASIN ${cleanAsin} already exists in the catalog.`);
    }

    // Query Amazon PA-API
    const paapiData = await amazonPaapiService.getProductByAsin(cleanAsin);

    const categoryObj = this.categories.find((c) => c.id === data.category) || this.categories[0];
    const newPrice = paapiData?.price?.amount || 999;

    const newProduct: Product = {
      id: `prod-${cleanAsin.toLowerCase()}`,
      asin: cleanAsin,
      title: paapiData?.title || `Amazon Product (${cleanAsin})`,
      brand: paapiData?.brand || 'Amazon Brand',
      category: categoryObj.id,
      categoryName: categoryObj.name,
      subCategory: data.subCategory || (categoryObj.id === 'fashion' ? 'clothes' : undefined),
      gender: data.gender,
      clothingType: data.clothingType,
      sneakerType: data.sneakerType,
      imageUrl: paapiData?.imageUrl || `https://images-na.ssl-images-amazon.com/images/P/${cleanAsin}.01._SCLZZZZZZZ_.jpg`,
      amazonUrl: `https://www.amazon.in/dp/${cleanAsin}/?tag=${process.env.AMAZON_ASSOCIATE_TAG || 'amazonde0941f-21'}`,
      currentPrice: newPrice,
      originalPrice: Math.round(newPrice * 1.5),
      discountPercent: 33,
      rating: 4.2,
      reviewCount: 1200,
      editorialOneLiner: data.editorialOneLiner || 'Curated pick for quality and practical value on Amazon India.',
      editorialReview: data.editorialReview || 'Selected based on reliable build quality, realistic everyday usefulness, and solid community feedback.',
      pros: data.pros && data.pros.length > 0 ? data.pros : ['Good build quality', 'Reliable daily performance'],
      cons: data.cons && data.cons.length > 0 ? data.cons : ['Limited color variants'],
      bestSuitedFor: data.bestSuitedFor || 'Smart shoppers looking for tested value.',
      buyingConsiderations: data.buyingConsiderations && data.buyingConsiderations.length > 0 ? data.buyingConsiderations : ['Check Amazon seller ratings before placing order.'],
      specs: { 'Fulfillment': 'Amazon India', 'Warranty': 'Standard Domestic Manufacturer Warranty' },
      isFeatured: Boolean(data.isFeatured),
      isTrending: Boolean(data.isTrending),
      isEditorPick: Boolean(data.isEditorPick),
      isDealOfTheDay: Boolean(data.isDealOfTheDay),
      isUnder499: newPrice <= 499,
      isUnder999: newPrice <= 999,
      published: true,
      updatedAt: new Date().toISOString(),
      source: paapiData?.isMockDemo ? 'manual' : 'paapi',
    };

    this.products.unshift(newProduct);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product not found with id: ${id}`);
    }

    const updated = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.products[index] = updated;
    return updated;
  }

  public deleteProduct(id: string): boolean {
    const initialLength = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < initialLength;
  }

  public clearAllProducts(): void {
    this.products = [];
    this.recalculateCategoryCounts();
  }

  public getExistingAsins(): Set<string> {
    return new Set(this.products.map((p) => p.asin.toUpperCase()));
  }

  public recalculateCategoryCounts(): void {
    this.categories = this.categories.map((c) => ({
      ...c,
      itemCount: this.products.filter((p) => p.category === c.id && p.published).length,
    }));
  }

  public bulkAddProducts(newProducts: Product[]): { added: number; skippedDuplicates: number } {
    let added = 0;
    let skippedDuplicates = 0;

    for (const prod of newProducts) {
      const asinUpper = prod.asin.toUpperCase();
      const exists = this.products.some((p) => p.asin.toUpperCase() === asinUpper);
      if (exists) {
        skippedDuplicates++;
      } else {
        this.products.unshift(prod);
        added++;
      }
    }

    this.recalculateCategoryCounts();
    return { added, skippedDuplicates };
  }

  public getStats() {
    return {
      totalProducts: this.products.length,
      publishedCount: this.products.filter((p) => p.published).length,
      featuredCount: this.products.filter((p) => p.isFeatured).length,
      fashionCount: this.products.filter((p) => p.category === 'fashion').length,
      clothesCount: this.products.filter((p) => p.subCategory === 'clothes').length,
      sneakersCount: this.products.filter((p) => p.subCategory === 'sneakers').length,
      studentEssentialsCount: this.products.filter((p) => p.category === 'student-essentials').length,
      dealsCount: this.products.filter((p) => p.isDealOfTheDay).length,
      under999Count: this.products.filter((p) => p.currentPrice <= 999).length,
      categoriesCount: this.categories.length,
    };
  }
}

export const productStore = new ProductStore();
