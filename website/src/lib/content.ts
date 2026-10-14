import { getDb } from "./db";
import { initialSettings } from "./seed";
export type Content = {
  title: string;
  slug: string;
  category?: string;
  description?: string;
  body?: string;
  deliverables?: string;
  kind?: string;
  images?: string[];
  alts?: string[];
  permission?: boolean;
  [key: string]: unknown;
};
export type RecordRow = {
  id: string;
  type: string;
  slug: string;
  draft: string;
  published: string | null;
  status: string;
  version: number;
  sort_order: number;
  updated_at: string;
  created_at: string;
};
export function publicContent(type: string): Content[] {
  return (
    getDb()
      .prepare(
        "SELECT published FROM records WHERE type=? AND status='Published' ORDER BY sort_order,created_at",
      )
      .all(type) as { published: string }[]
  ).map((row) => JSON.parse(row.published));
}
export function publicItem(type: string, slug: string): Content | undefined {
  return publicContent(type).find((item) => item.slug === slug);
}
export function settings(): typeof initialSettings {
  return { ...initialSettings, ...publicContent("settings")[0] };
}
export function allRecords(type?: string) {
  const rows = (
    type
      ? getDb()
          .prepare(
            "SELECT * FROM records WHERE type=? ORDER BY sort_order,created_at",
          )
          .all(type)
      : getDb()
          .prepare("SELECT * FROM records ORDER BY type,sort_order,created_at")
          .all()
  ) as RecordRow[];
  return rows.map((row) => ({
    ...row,
    draft: JSON.parse(row.draft),
    published: row.published ? JSON.parse(row.published) : null,
  }));
}
