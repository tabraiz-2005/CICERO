import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('products')
        .select(`
      id,
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
      is_new_arrival,
      is_featured,
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
        sku,
        name,
        color,
        color_hex,
        color_family,
        size,
        price,
        inventory_quantity,
        is_active
      )
    `)
        .eq('status', 'active')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Supabase catalog error:', error);

        return NextResponse.json(
            { error: 'Unable to load the catalog.' },
            { status: 500 }
        );
    }

    return NextResponse.json({
        products: data,
        count: data.length,
    });
}