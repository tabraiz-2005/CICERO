import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getJournalArticles } from '@/lib/commerce/api';

export const metadata = {
  title: 'LUCEVALIE Journal | Editorial Stories & Atelier Notes',
  description: 'Articles on cashmere provenance, European tailoring, architectural travel, and natural materials.',
};

export default async function JournalIndexPage() {
  const articles = await getJournalArticles();

  return (
    <div className="py-20 bg-maison-ivory text-maison-obsidian font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-taupe">
            MAISON PUBLISHING
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal">
            The LUCEVALIE Journal
          </h1>
          <p className="font-serif italic text-base text-maison-charcoal leading-relaxed font-light">
            Editorial essays on raw material provenance, architecture, craftsmanship, and European lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/journal/${article.slug}`}
              className="group space-y-4 block border border-maison-stone/40 p-6 bg-maison-surface hover:border-maison-obsidian/40 transition-colors"
            >
              <div className="relative aspect-[16/10] bg-maison-stone/30 overflow-hidden">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-maison-taupe">
                  <span>{article.category}</span>
                  <span>{article.readTime}</span>
                </div>

                <h2 className="font-serif text-2xl font-normal text-maison-obsidian group-hover:text-maison-taupe transition-colors">
                  {article.title}
                </h2>

                <p className="font-serif italic text-sm text-maison-charcoal">
                  {article.subtitle}
                </p>

                <p className="text-xs text-maison-taupe font-light line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="pt-2 text-xs uppercase tracking-[0.18em] text-maison-obsidian border-b border-maison-obsidian/40 group-hover:border-maison-obsidian inline-block">
                  READ ESSAY &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
