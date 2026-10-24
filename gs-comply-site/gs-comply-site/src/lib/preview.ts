import type { ArticleData } from '@/components/PostArticle';

export const PREVIEW_KEY = 'gscomply:post-preview';

export function writePreview(data: ArticleData): boolean {
  try {
    localStorage.setItem(PREVIEW_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function readPreview(): ArticleData | null {
  try {
    const raw = localStorage.getItem(PREVIEW_KEY);
    return raw ? (JSON.parse(raw) as ArticleData) : null;
  } catch {
    return null;
  }
}
