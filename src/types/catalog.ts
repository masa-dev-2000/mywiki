export interface CatalogEntry {
  id: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  status: 'seed' | 'fern' | 'evergreen';
  path: string;
}

export interface Catalog {
  entries: CatalogEntry[];
  updatedAt: string;
}

export interface Rating {
  contentId: string;
  clarity: number;
  depth: number;
  interest: number;
  practicality: number;
  memo: string;
  ratedAt: string;
}

export interface ReadingLog {
  contentId: string;
  readAt: string;
}

export interface AIInsight {
  preferences: string;
  feedback: string;
  suggestions: string[];
  generatedAt: string;
}
