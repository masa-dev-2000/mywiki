'use client';

import { supabase } from './supabase';
import { Rating } from '@/types/catalog';

const LS_READ_KEY = 'mywiki_reads';
const LS_RATINGS_KEY = 'mywiki_ratings';
const LS_PENDING_KEY = 'mywiki_pending';

// --- Read tracking ---

export async function markAsRead(contentId: string): Promise<void> {
  const now = new Date().toISOString();
  // Always save to localStorage
  const reads = getLocalReads();
  reads[contentId] = now;
  localStorage.setItem(LS_READ_KEY, JSON.stringify(reads));

  if (supabase && navigator.onLine) {
    try {
      await supabase.from('wiki_readings').upsert(
        { content_id: contentId, read_at: now },
        { onConflict: 'content_id' }
      );
    } catch {
      addPending({ type: 'read', contentId, data: now });
    }
  } else {
    addPending({ type: 'read', contentId, data: now });
  }
}

export async function getReadIds(): Promise<string[]> {
  if (supabase && navigator.onLine) {
    try {
      const { data } = await supabase.from('wiki_readings').select('content_id');
      if (data) {
        const ids = data.map((r: { content_id: string }) => r.content_id);
        // Sync to localStorage
        const reads = getLocalReads();
        ids.forEach((id) => { if (!reads[id]) reads[id] = new Date().toISOString(); });
        localStorage.setItem(LS_READ_KEY, JSON.stringify(reads));
        return ids;
      }
    } catch { /* fall through */ }
  }
  return Object.keys(getLocalReads());
}

function getLocalReads(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(LS_READ_KEY) || '{}');
  } catch { return {}; }
}

// --- Ratings ---

export async function saveRating(rating: Rating): Promise<void> {
  const localRatings = getLocalRatings();
  localRatings[rating.contentId] = rating;
  localStorage.setItem(LS_RATINGS_KEY, JSON.stringify(localRatings));

  if (supabase && navigator.onLine) {
    try {
      await supabase.from('wiki_ratings').upsert(
        {
          content_id: rating.contentId,
          clarity: rating.clarity,
          depth: rating.depth,
          interest: rating.interest,
          practicality: rating.practicality,
          memo: rating.memo,
          rated_at: rating.ratedAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'content_id' }
      );
    } catch {
      addPending({ type: 'rating', contentId: rating.contentId, data: rating });
    }
  } else {
    addPending({ type: 'rating', contentId: rating.contentId, data: rating });
  }
}

export async function getRating(contentId: string): Promise<Rating | null> {
  if (supabase && navigator.onLine) {
    try {
      const { data } = await supabase
        .from('wiki_ratings')
        .select('*')
        .eq('content_id', contentId)
        .single();
      if (data) {
        return {
          contentId: data.content_id,
          clarity: data.clarity,
          depth: data.depth,
          interest: data.interest,
          practicality: data.practicality,
          memo: data.memo || '',
          ratedAt: data.rated_at,
        };
      }
    } catch { /* fall through */ }
  }
  const local = getLocalRatings();
  return local[contentId] || null;
}

export async function getAllRatings(): Promise<Rating[]> {
  if (supabase && navigator.onLine) {
    try {
      const { data } = await supabase.from('wiki_ratings').select('*');
      if (data) {
        return data.map((d: Record<string, unknown>) => ({
          contentId: d.content_id as string,
          clarity: d.clarity as number,
          depth: d.depth as number,
          interest: d.interest as number,
          practicality: d.practicality as number,
          memo: (d.memo as string) || '',
          ratedAt: d.rated_at as string,
        }));
      }
    } catch { /* fall through */ }
  }
  return Object.values(getLocalRatings());
}

function getLocalRatings(): Record<string, Rating> {
  try {
    return JSON.parse(localStorage.getItem(LS_RATINGS_KEY) || '{}');
  } catch { return {}; }
}

// --- Pending sync ---

interface PendingItem {
  type: 'read' | 'rating';
  contentId: string;
  data: unknown;
}

function addPending(item: PendingItem) {
  const pending = getPending();
  pending.push(item);
  localStorage.setItem(LS_PENDING_KEY, JSON.stringify(pending));
}

function getPending(): PendingItem[] {
  try {
    return JSON.parse(localStorage.getItem(LS_PENDING_KEY) || '[]');
  } catch { return []; }
}

export async function syncPendingData(): Promise<void> {
  if (!supabase || !navigator.onLine) return;
  const pending = getPending();
  if (pending.length === 0) return;

  const failed: PendingItem[] = [];
  for (const item of pending) {
    try {
      if (item.type === 'read') {
        await supabase.from('wiki_readings').upsert(
          { content_id: item.contentId, read_at: item.data },
          { onConflict: 'content_id' }
        );
      } else {
        const r = item.data as Rating;
        await supabase.from('wiki_ratings').upsert(
          {
            content_id: r.contentId,
            clarity: r.clarity,
            depth: r.depth,
            interest: r.interest,
            practicality: r.practicality,
            memo: r.memo,
            rated_at: r.ratedAt,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'content_id' }
        );
      }
    } catch {
      failed.push(item);
    }
  }
  localStorage.setItem(LS_PENDING_KEY, JSON.stringify(failed));
}

// Auto-sync on online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { syncPendingData(); });
}
