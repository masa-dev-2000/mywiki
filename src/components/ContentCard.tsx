import Link from 'next/link';
import { CatalogEntry } from '@/types/catalog';

interface Props {
  entry: CatalogEntry;
  isRead: boolean;
  basePath: string;
}

export default function ContentCard({ entry, isRead, basePath }: Props) {
  const statusEmoji = { seed: '🌱', fern: '🌿', evergreen: '🌳' }[entry.status];

  return (
    <Link href={`${basePath}/${entry.id}/`} className="card content-card">
      <div className="card-header">
        <span className="card-status">{statusEmoji}</span>
        <span className="card-date">{entry.date}</span>
        {!isRead && <span className="unread-badge">●</span>}
      </div>
      <h2 className="card-title">{entry.title}</h2>
      <p className="card-desc">{entry.description}</p>
      <div className="card-tags">
        {entry.tags.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
    </Link>
  );
}
