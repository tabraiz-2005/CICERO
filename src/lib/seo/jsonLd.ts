import { Product, JournalArticle } from '../commerce/types';

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LUCEVALIE',
    legalName: 'LUCEVALIE Maison S.A.',
    url: 'https://lucevalie.com',
    logo: 'https://lucevalie.com/logo.png',
    description: 'European luxury maison built around quiet refinement, cashmere atelier craftsmanship, and architectural elegance.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Milan',
      addressCountry: 'Italy',
    },
    sameAs: [
      'https://instagram.com/lucevalie',
      'https://pinterest.com/lucevalie',
    ],
  };
}

export function generateProductSchema(product: Product) {
  const primaryImg = product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url || '';
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: [primaryImg],
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'LUCEVALIE',
    },
    offers: {
      '@type': 'Offer',
      url: `https://lucevalie.com/products/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
    },
  };
}

export function generateArticleSchema(article: JournalArticle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: [article.coverImage],
    datePublished: article.publishedDate,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'LUCEVALIE',
    },
  };
}
