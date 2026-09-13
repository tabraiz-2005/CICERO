import { getJournalArticleBySlug } from '@/lib/commerce/api';
import { generateArticleSchema } from '@/lib/seo/jsonLd';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps) {
  const article = await getJournalArticleBySlug(params.slug);
  if (!article) return {};

  return {
    title: `${article.title} | LUCEVALIE Journal`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImage }],
    },
  };
}

export default async function JournalArticlePage({ params }: PageProps) {
  const article = await getJournalArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const articleSchema = generateArticleSchema(article);

  return (
    <article className="py-16 sm:py-24 bg-maison-ivory text-maison-obsidian font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-10">
        {/* Category & Meta */}
        <div className="text-center space-y-4">
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-gold">
            {article.category} &bull; {article.publishedDate} &bull; {article.readTime}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-maison-obsidian leading-tight">
            {article.title}
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-maison-taupe font-light">
            {article.subtitle}
          </p>
          <div className="text-xs uppercase tracking-[0.18em] text-maison-charcoal pt-2">
            BY {article.author.toUpperCase()}
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-[16/10] w-full bg-maison-stone/30 overflow-hidden">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
        </div>

        {/* HTML Article Content */}
        <div
          className="prose prose-lg max-w-none text-maison-charcoal font-light leading-relaxed font-sans space-y-6 pt-4 border-b border-maison-stone/40 pb-12"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Back Link */}
        <div className="text-center pt-6">
          <Link
            href="/journal"
            className="text-xs uppercase tracking-[0.2em] text-maison-obsidian border-b border-maison-obsidian pb-1 hover:text-maison-taupe transition-colors"
          >
            &larr; BACK TO JOURNAL STORIES
          </Link>
        </div>
      </div>
    </article>
  );
}
