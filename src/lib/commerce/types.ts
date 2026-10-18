export type Gender = 'women' | 'men' | 'unisex';
export type ColorFamily =
  | 'neutral'
  | 'brown'
  | 'black'
  | 'white'
  | 'blue'
  | 'grey'
  | 'green'
  | 'red'
  | 'beige';

export const COLOR_FAMILIES: ColorFamily[] = [
  'black',
  'grey',
  'white',
  'beige',
  'neutral',
  'brown',
  'blue',
  'green',
  'red',
];

export interface ProductImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary?: boolean;
  isHover?: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  color: string;
  colorHex: string;
  colorFamily: ColorFamily;
  size: string;
  inStock: boolean;
  inventoryQuantity: number;
  price: number;
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
  price: number;
  compareAtPrice?: number;
  currency: string;
  category: string;
  categoryName: string;
  collection: string | null;
  collectionName: string | null;
  gender: Gender;
  material: string;
  images: ProductImage[];
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
  totalStock: number;
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
  id: string;
  productId: string;
  productSlug: string;
  variantId: string;
  title: string;
  category?: string;
  color: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
  maxQuantity: number;
}

export interface WishlistItem {
  productId: string;
  productSlug: string;
  title: string;
  category: string;
  price: number;
  image: string;
  addedAt: string;
}

export interface StoreSettings {
  store_name: string;
  tagline: string;
  announcement_enabled: boolean;
  announcement_text: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string | null;
  hero_cta_label: string;
  hero_cta_href: string;
  standard_shipping_amount: number; // cents
  express_shipping_amount: number; // cents
  free_shipping_threshold: number | null; // cents
  low_stock_threshold: number;
  contact_email: string;
  contact_phone: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  store_name: 'Cicero',
  tagline: 'Outerwear & Knitwear',
  announcement_enabled: true,
  announcement_text: 'Free shipping on orders over $300',
  hero_eyebrow: 'Autumn / Winter Campaign',
  hero_title: 'CICERO',
  hero_subtitle: 'Wool coats, jackets and knitwear cut for the cold months.',
  hero_image_url: null,
  hero_cta_label: 'Shop the collection',
  hero_cta_href: '/shop',
  standard_shipping_amount: 1500,
  express_shipping_amount: 3500,
  free_shipping_threshold: 30000,
  low_stock_threshold: 5,
  contact_email: 'care@cicero.store',
  contact_phone: null,
  instagram_url: null,
  tiktok_url: null,
};
