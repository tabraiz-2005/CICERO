import { NextRequest, NextResponse } from 'next/server';
import {
    getCategories,
    getProducts,
} from '@/lib/commerce/supabaseApi';
import { getJournalArticles } from '@/lib/commerce/api';

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams
        .get('q')
        ?.trim()
        .slice(0, 100);

    if (!query) {
        return NextResponse.json({
            products: [],
            categories: [],
            articles: [],
            totalResults: 0,
        });
    }

    try {
        const [products, allCategories, allArticles] = await Promise.all([
            getProducts({ search: query }),
            getCategories('all'),
            getJournalArticles(),
        ]);

        const normalizedQuery = query.toLowerCase();

        const categories = allCategories.filter(
            (category) =>
                category.name.toLowerCase().includes(normalizedQuery) ||
                category.description.toLowerCase().includes(normalizedQuery)
        );

        const articles = allArticles.filter(
            (article) =>
                article.title.toLowerCase().includes(normalizedQuery) ||
                article.subtitle.toLowerCase().includes(normalizedQuery) ||
                article.excerpt.toLowerCase().includes(normalizedQuery)
        );

        return NextResponse.json({
            products,
            categories,
            articles,
            totalResults:
                products.length + categories.length + articles.length,
        });
    } catch (error) {
        console.error('Catalog search error:', error);

        return NextResponse.json(
            {
                products: [],
                categories: [],
                articles: [],
                totalResults: 0,
                error: 'Search is temporarily unavailable.',
            },
            { status: 500 }
        );
    }
} 