import 'server-only';

import { createClient } from '@/lib/supabase/server';
import type {
    CategoryItem,
    CollectionItem,
    CurrencyCode,
    Product,
    ProductVariant,
} from './types';

export interface SupabaseFilterOptions {
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

interface TaxonomyRelation {
    slug: string;
    name: string;
}

interface ProductImageRow {
    id: string;
    url: string;
    alt_text: string;
    width: number | null;
    height: number | null;
    position: number;
    is_primary: boolean;
    is_hover: boolean;
}

interface ProductVariantRow {
    id: string;
    legacy_id: string | null;
    sku: string;
    name: string;
    color: string;
    color_hex: string;
    color_family: ProductVariant['colorFamily'];
    size: string;
    price: number | string;
    compare_at_price: number | string | null;
    inventory_quantity: number;
    is_active: boolean;
    image_url: string | null;
}

interface ProductRow {
    id: string;
    legacy_id: string | null;
    sku: string;
    slug: string;
    title: string;
    subtitle: string | null;
    description: string;
    price: number | string;
    compare_at_price: number | string | null;
    currency: CurrencyCode;
    gender: Product['gender'];
    material: string | null;
    care_instructions: string[] | null;
    craftsmanship_notes: string | null;
    fit_info: string | null;
    shipping_info: string | null;
    seo_title: string | null;
    seo_description: string | null;
    is_new_arrival: boolean;
    is_featured: boolean;
    is_bestseller: boolean;
    related_product_slugs: string[] | null;
    complete_the_look_slugs: string[] | null;
    category: TaxonomyRelation | TaxonomyRelation[] | null;
    collection: TaxonomyRelation | TaxonomyRelation[] | null;
    product_images: ProductImageRow[] | null;
    product_variants: ProductVariantRow[] | null;
}

interface CategoryRow {
    id: string;
    legacy_id: string | null;
    slug: string;
    name: string;
    gender: CategoryItem['gender'];
    description: string | null;
    hero_image_url: string | null;
}

interface CollectionRow {
    id: string;
    legacy_id: string | null;
    slug: string;
    name: string;
    season: string | null;
    description: string | null;
    story_quote: string | null;
    hero_image_url: string | null;
}

const PRODUCT_SELECT = `
  id,
  legacy_id,
  sku,
  slug,
  title,
  subtitle,
  description,
  price,
  compare_at_price,
  currency,
  gender,
  material,
  care_instructions,
  craftsmanship_notes,
  fit_info,
  shipping_info,
  seo_title,
  seo_description,
  is_new_arrival,
  is_featured,
  is_bestseller,
  related_product_slugs,
  complete_the_look_slugs,
  category:categories (
    slug,
    name
  ),
  collection:collections (
    slug,
    name
  ),
  product_images (
    id,
    url,
    alt_text,
    width,
    height,
    position,
    is_primary,
    is_hover
  ),
  product_variants (
    id,
    legacy_id,
    sku,
    name,
    color,
    color_hex,
    color_family,
    size,
    price,
    compare_at_price,
    inventory_quantity,
    is_active,
    image_url
  )
`;

function firstRelation<T>(relation: T | T[] | null): T | null {
    if (Array.isArray(relation)) {
        return relation[0] ?? null;
    }

    return relation;
}

function mapProduct(row: ProductRow): Product {
    const category = firstRelation(row.category);
    const collection = firstRelation(row.collection);

    const images = [...(row.product_images ?? [])]
        .sort((a, b) => a.position - b.position)
        .map((image) => ({
            url: image.url,
            alt: image.alt_text,
            width: image.width ?? 1400,
            height: image.height ?? 1800,
            isPrimary: image.is_primary,
            isHover: image.is_hover,
        }));

    const variants: ProductVariant[] = (row.product_variants ?? []).map(
        (variant) => ({
            id: variant.legacy_id ?? variant.id,
            sku: variant.sku,
            name: variant.name,
            color: variant.color,
            colorHex: variant.color_hex,
            colorFamily: variant.color_family,
            size: variant.size,
            inStock: variant.is_active && variant.inventory_quantity > 0,
            inventoryQuantity: variant.inventory_quantity,
            price: Number(variant.price),
            compareAtPrice:
                variant.compare_at_price === null
                    ? undefined
                    : Number(variant.compare_at_price),
            image: variant.image_url ?? undefined,
        })
    );

    const colors = new Map<string, string>();

    for (const variant of variants) {
        if (!colors.has(variant.color)) {
            colors.set(variant.color, variant.colorHex);
        }
    }

    return {
        id: row.legacy_id ?? row.id,
        sku: row.sku,
        slug: row.slug,
        title: row.title,
        subtitle: row.subtitle ?? undefined,
        description: row.description,
        price: Number(row.price),
        compareAtPrice:
            row.compare_at_price === null
                ? undefined
                : Number(row.compare_at_price),
        currency: row.currency,
        category: (category?.slug ?? 'accessories') as Product['category'],
        collection: (collection?.slug ??
            'timeless-essentials') as Product['collection'],
        gender: row.gender,
        material: row.material ?? '',
        images,
        variants,
        availableColors: Array.from(colors, ([name, hex]) => ({
            name,
            hex,
        })),
        availableSizes: Array.from(
            new Set(variants.map((variant) => variant.size))
        ),
        careInstructions: row.care_instructions ?? [],
        craftsmanshipNotes: row.craftsmanship_notes ?? '',
        fitInfo: row.fit_info ?? '',
        shippingInfo: row.shipping_info ?? '',
        seoTitle: row.seo_title ?? row.title,
        seoDescription: row.seo_description ?? row.description,
        isNewArrival: row.is_new_arrival,
        isFeatured: row.is_featured,
        isBestseller: row.is_bestseller,
        relatedProductSlugs: row.related_product_slugs ?? [],
        completeTheLookSlugs: row.complete_the_look_slugs ?? [],
    };
}

export async function getProducts(
    options: SupabaseFilterOptions = {}
): Promise<Product[]> {
    const supabase = await createClient();

    let query = supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('status', 'active');

    if (options.gender && options.gender !== 'all') {
        if (options.gender === 'unisex') {
            query = query.eq('gender', 'unisex');
        } else {
            query = query.in('gender', [options.gender, 'unisex']);
        }
    }

    if (options.category) {
        const { data: category, error: categoryError } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', options.category)
            .maybeSingle();

        if (categoryError) {
            console.error('Supabase category lookup error:', categoryError);
            throw new Error('Unable to load the requested category.');
        }

        if (!category) {
            return [];
        }

        query = query.eq('category_id', category.id);
    }

    if (options.collection) {
        const { data: collection, error: collectionError } = await supabase
            .from('collections')
            .select('id')
            .eq('slug', options.collection)
            .maybeSingle();

        if (collectionError) {
            console.error('Supabase collection lookup error:', collectionError);
            throw new Error('Unable to load the requested collection.');
        }

        if (!collection) {
            return [];
        }

        query = query.eq('collection_id', collection.id);
    }

    if (options.minPrice !== undefined) {
        query = query.gte('price', options.minPrice);
    }

    if (options.maxPrice !== undefined) {
        query = query.lte('price', options.maxPrice);
    }

    if (options.sort === 'price-low') {
        query = query.order('price', { ascending: true });
    } else if (options.sort === 'price-high') {
        query = query.order('price', { ascending: false });
    } else if (options.sort === 'newest') {
        query = query
            .order('is_new_arrival', { ascending: false })
            .order('published_at', { ascending: false });
    } else {
        query = query
            .order('is_featured', { ascending: false })
            .order('published_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
        console.error('Supabase products error:', error);
        throw new Error('Unable to load products.');
    }

    let products = ((data ?? []) as unknown as ProductRow[]).map(mapProduct);

    if (options.color) {
        const color = options.color.toLowerCase();

        products = products.filter((product) =>
            product.availableColors.some((item) =>
                item.name.toLowerCase().includes(color)
            )
        );
    }

    if (options.size) {
        products = products.filter((product) =>
            product.availableSizes.includes(options.size as string)
        );
    }

    if (options.search) {
        const search = options.search.toLowerCase().trim();

        products = products.filter(
            (product) =>
                product.title.toLowerCase().includes(search) ||
                product.description.toLowerCase().includes(search) ||
                product.material.toLowerCase().includes(search)
        );
    }

    return products;
}

export async function getProductBySlug(
    slug: string
): Promise<Product | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('slug', slug)
        .eq('status', 'active')
        .maybeSingle();

    if (error) {
        console.error('Supabase product error:', error);
        throw new Error('Unable to load this product.');
    }

    return data ? mapProduct(data as unknown as ProductRow) : null;
}

export async function getCategories(
    gender?: string
): Promise<CategoryItem[]> {
    const supabase = await createClient();

    const [{ data: categoryData, error: categoryError }, productResult] =
        await Promise.all([
            supabase
                .from('categories')
                .select('id, legacy_id, slug, name, gender, description, hero_image_url')
                .eq('is_active', true)
                .order('sort_order'),
            supabase
                .from('products')
                .select('category_id')
                .eq('status', 'active'),
        ]);

    if (categoryError || productResult.error) {
        console.error(
            'Supabase categories error:',
            categoryError ?? productResult.error
        );
        throw new Error('Unable to load categories.');
    }

    const counts = new Map<string, number>();

    for (const product of productResult.data ?? []) {
        if (product.category_id) {
            counts.set(
                product.category_id,
                (counts.get(product.category_id) ?? 0) + 1
            );
        }
    }

    return ((categoryData ?? []) as unknown as CategoryRow[])
        .filter(
            (category) =>
                !gender ||
                gender === 'all' ||
                category.gender === 'all' ||
                category.gender === gender
        )
        .map((category) => ({
            id: category.legacy_id ?? category.id,
            slug: category.slug,
            name: category.name,
            gender: category.gender,
            description: category.description ?? '',
            heroImage: category.hero_image_url ?? '',
            itemCount: counts.get(category.id) ?? 0,
        }));
}

export async function getCategoryBySlug(
    slug: string
): Promise<CategoryItem | null> {
    const categories = await getCategories('all');
    return categories.find((category) => category.slug === slug) ?? null;
}

export async function getCollections(): Promise<CollectionItem[]> {
    const supabase = await createClient();

    const [{ data: collectionData, error: collectionError }, productResult] =
        await Promise.all([
            supabase
                .from('collections')
                .select(
                    'id, legacy_id, slug, name, season, description, story_quote, hero_image_url'
                )
                .eq('is_active', true)
                .order('sort_order'),
            supabase
                .from('products')
                .select('collection_id')
                .eq('status', 'active'),
        ]);

    if (collectionError || productResult.error) {
        console.error(
            'Supabase collections error:',
            collectionError ?? productResult.error
        );
        throw new Error('Unable to load collections.');
    }

    const counts = new Map<string, number>();

    for (const product of productResult.data ?? []) {
        if (product.collection_id) {
            counts.set(
                product.collection_id,
                (counts.get(product.collection_id) ?? 0) + 1
            );
        }
    }

    return ((collectionData ?? []) as unknown as CollectionRow[]).map(
        (collection) => ({
            id: collection.legacy_id ?? collection.id,
            slug: collection.slug,
            name: collection.name,
            season: collection.season ?? '',
            description: collection.description ?? '',
            storyQuote: collection.story_quote ?? '',
            heroImage: collection.hero_image_url ?? '',
            featuredProductsCount: counts.get(collection.id) ?? 0,
        })
    );
}

export async function getCollectionBySlug(
    slug: string
): Promise<CollectionItem | null> {
    const collections = await getCollections();
    return collections.find((collection) => collection.slug === slug) ?? null;
}