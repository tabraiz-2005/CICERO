import { Product, CategoryItem, CollectionItem, JournalArticle, SearchResult } from './types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_COLLECTIONS, MOCK_JOURNAL_ARTICLES } from './mockCatalog';

export interface FilterOptions {
  gender?: 'women' | 'men' | 'unisex' | 'all';
  category?: string;
  collection?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'featured' | 'newest' | 'price-low' | 'price-high';
  search?: string;
}

export async function getProducts(options: FilterOptions = {}): Promise<Product[]> {
  let products = [...MOCK_PRODUCTS];

  if (options.gender && options.gender !== 'all') {
    products = products.filter(
      (p) => p.gender === options.gender || p.gender === 'unisex'
    );
  }

  if (options.category) {
    products = products.filter((p) => p.category === options.category);
  }

  if (options.collection) {
    products = products.filter((p) => p.collection === options.collection);
  }

  if (options.color) {
    products = products.filter((p) =>
      p.availableColors.some(
        (c) => c.name.toLowerCase().includes(options.color!.toLowerCase())
      )
    );
  }

  if (options.size) {
    products = products.filter((p) =>
      p.availableSizes.includes(options.size!)
    );
  }

  if (options.minPrice !== undefined) {
    products = products.filter((p) => p.price >= options.minPrice!);
  }

  if (options.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= options.maxPrice!);
  }

  if (options.search) {
    const q = options.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (options.sort === 'newest') {
    products.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  } else if (options.sort === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (options.sort === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  return product || null;
}

export async function getCategories(gender?: string): Promise<CategoryItem[]> {
  if (!gender || gender === 'all') return MOCK_CATEGORIES;
  return MOCK_CATEGORIES.filter((c) => c.gender === gender || c.gender === 'all');
}

export async function getCategoryBySlug(slug: string): Promise<CategoryItem | null> {
  return MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
}

export async function getCollections(): Promise<CollectionItem[]> {
  return MOCK_COLLECTIONS;
}

export async function getCollectionBySlug(slug: string): Promise<CollectionItem | null> {
  return MOCK_COLLECTIONS.find((c) => c.slug === slug) || null;
}

export async function getJournalArticles(): Promise<JournalArticle[]> {
  return MOCK_JOURNAL_ARTICLES;
}

export async function getJournalArticleBySlug(slug: string): Promise<JournalArticle | null> {
  return MOCK_JOURNAL_ARTICLES.find((a) => a.slug === slug) || null;
}

export async function searchCatalog(query: string): Promise<SearchResult> {
  if (!query || query.trim().length === 0) {
    return { products: [], categories: [], articles: [], totalResults: 0 };
  }

  const q = query.toLowerCase().trim();

  const products = MOCK_PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );

  const categories = MOCK_CATEGORIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  );

  const articles = MOCK_JOURNAL_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.subtitle.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q)
  );

  return {
    products,
    categories,
    articles,
    totalResults: products.length + categories.length + articles.length,
  };
}
