'use client';

import { useState, useEffect } from 'react';
import ContentCard from '@/components/ContentCard';
import TagFilter from '@/components/TagFilter';
import { getReadIds } from '@/lib/storage';
import catalogData from '../../content/catalog.json';
import { CatalogEntry } from '@/types/catalog';

const entries: CatalogEntry[] = (catalogData.entries as CatalogEntry[]).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

const allTags = Array.from(new Set(entries.flatMap((e) => e.tags))).sort();

export default function HomePage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    getReadIds().then(setReadIds);
  }, []);

  const filtered = selectedTag
    ? entries.filter((e) => e.tags.includes(selectedTag))
    : entries;

  return (
    <>
      <TagFilter tags={allTags} selected={selectedTag} onSelect={setSelectedTag} />
      <div className="content-grid">
        {filtered.map((entry) => (
          <ContentCard
            key={entry.id}
            entry={entry}
            isRead={readIds.includes(entry.id)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">コンテンツがありません</div>
      )}
    </>
  );
}
