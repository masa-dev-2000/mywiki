import fs from 'fs';
import path from 'path';
import { Catalog, CatalogEntry } from '@/types/catalog';

export function getCatalog(): Catalog {
  const filePath = path.join(process.cwd(), 'content', 'catalog.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const catalog: Catalog = JSON.parse(raw);
  catalog.entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return catalog;
}

export function getEntryBySlug(slug: string): CatalogEntry | undefined {
  const catalog = getCatalog();
  return catalog.entries.find((e) => e.id === slug);
}

export function getAllTags(): string[] {
  const catalog = getCatalog();
  const tags = new Set<string>();
  catalog.entries.forEach((e) => e.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}
