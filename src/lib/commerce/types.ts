export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Multiplier relative to USD
  label: string;
  flag: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string; // e.g. "Vicuña Beige / Size M"
  color: string; // Color label, e.g., "Oatmeal Vicuña"
  colorHex: string; // Color swatch hex, e.g., "#D9C3B0"
  colorFamily: 'neutral' | 'brown' | 'black' | 'white' | 'blue' | 'grey';
  size: string; // e.g. "S", "M", "L", "XL", "48", "50", "One Size"
  inStock: boolean;
  inventoryQuantity: number;
  price: number; // In base USD
  compareAtPrice?: number;
  image?: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  price: number; // In base USD
  compareAtPrice?: number;
  currency: CurrencyCode;
  category: 'outerwear' | 'knitwear' | 'tailoring' | 'leather-goods' | 'footwear' | 'accessories';
  collection: 'autumn-winter-2026' | 'cashmere-atelier' | 'heritage-tailoring' | 'timeless-essentials';
  gender: 'women' | 'men' | 'unisex';
  material: string; // e.g., "100% Ultrafine Mongolian Cashmere & Pure Silk"
  images: {
    url: string;
    alt: string;
    width: number;
    height: number;
    isPrimary?: boolean;
    isHover?: boolean;
  }[];
  variants: ProductVariant[];
  availableColors: { name: string; hex: string }[];
  availableSizes: string[];
  careInstructions: string[];
  craftsmanshipNotes: string;
  fitInfo: string;
  shippingInfo: string;
  seoTitle: string;
  seoDescription: string;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  relatedProductSlugs?: string[];
  completeTheLookSlugs?: string[];
}

export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  gender: 'women' | 'men' | 'all';
  description: string;
  heroImage: string;
  itemCount: number;
}

export interface CollectionItem {
  id: string;
  slug: string;
  name: string;
  season: string;
  description: string;
  storyQuote: string;
  heroImage: string;
  featuredProductsCount: number;
}

export interface CartItem {
  id: string; // cart item unique ID
  productId: string;
  productSlug: string;
  variantId: string;
  title: string;
  color: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
  maxQuantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  isGiftWrapped: boolean;
  giftMessage?: string;
  itemCount: number;
}

export interface WishlistItem {
  productId: string;
  productSlug: string;
  title: string;
  category: string;
  price: number;
  image: string;
  selectedColor?: string;
  selectedSize?: string;
  addedAt: string;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  contentHtml: string;
  author: string;
  publishedDate: string;
  category: 'Craftsmanship' | 'Atelier' | 'Travel' | 'Materials' | 'Collections';
  readTime: string;
  coverImage: string;
  galleryImages?: string[];
}

export interface PrivateAppointmentRequest {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  serviceType: 'personal-styling' | 'private-boutique-visit' | 'gift-consultation' | 'bespoke-tailoring';
  preferredDate: string;
  preferredContactMethod: 'email' | 'phone' | 'whatsapp';
  notes?: string;
}

export interface SearchResult {
  products: Product[];
  categories: CategoryItem[];
  articles: JournalArticle[];
  totalResults: number;
}
