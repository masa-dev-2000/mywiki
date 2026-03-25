import Link from 'next/link';
import catalogData from '../../../content/catalog.json';
import { CatalogEntry } from '@/types/catalog';
import SlugPageClient from './client';

const entries: CatalogEntry[] = catalogData.entries as CatalogEntry[];

export function generateStaticParams() {
  return entries.map((e) => ({ slug: e.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const entry = entries.find((e) => e.id === params.slug);
  return { title: entry ? `${entry.title} | MyWiki` : 'MyWiki' };
}

export default function SlugPage({ params }: { params: { slug: string } }) {
  const entry = entries.find((e) => e.id === params.slug);

  if (!entry) {
    return (
      <div className="content-page">
        <Link href="/" className="back-nav">← トップに戻る</Link>
        <div className="empty-state">コンテンツが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="content-page">
      <Link href="/" className="back-nav">← トップに戻る</Link>
      <div className="content-meta">
        <h1>{entry.title}</h1>
        <div className="content-meta-info">
          <span>{entry.date}</span>
          <span>{{ seed: '🌱', fern: '🌿', evergreen: '🌳' }[entry.status]}</span>
          {entry.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
      <SlugPageClient entry={entry} />
    </div>
  );
}
