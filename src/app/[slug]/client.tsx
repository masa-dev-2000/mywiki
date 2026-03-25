'use client';

import { useEffect } from 'react';
import IframeViewer from '@/components/IframeViewer';
import RatingForm from '@/components/RatingForm';
import { markAsRead } from '@/lib/storage';
import { CatalogEntry } from '@/types/catalog';

interface Props {
  entry: CatalogEntry;
}

export default function SlugPageClient({ entry }: Props) {
  useEffect(() => {
    markAsRead(entry.id);
  }, [entry.id]);

  const handlePrint = () => window.print();

  return (
    <>
      <button onClick={handlePrint} className="print-btn tap-target">🖨️ PDF保存</button>
      <IframeViewer src={`/mywiki/content/${entry.path}`} />
      <RatingForm contentId={entry.id} />
    </>
  );
}
