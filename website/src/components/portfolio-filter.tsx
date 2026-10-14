"use client";
import { useState } from "react";
import { PortfolioGrid } from "./portfolio-grid";
import type { Content } from "@/lib/content";
export function PortfolioFilter({ items }: { items: Content[] }) {
  const [filter, setFilter] = useState("Semua");
  const categories = [
    "Semua",
    ...new Set(items.map((i) => i.category).filter(Boolean)),
  ] as string[];
  const shown = items.filter(
    (i) => filter === "Semua" || i.category === filter,
  );
  return (
    <>
      <div className="filters" aria-label="Filter kategori">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={category === filter ? "filter active" : "filter"}
            aria-pressed={category === filter}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <p className="eyebrow" aria-live="polite" style={{ marginBottom: 20 }}>
        {shown.length} KARYA
      </p>
      {shown.length ? (
        <PortfolioGrid items={shown} />
      ) : (
        <p className="empty-state">Belum ada karya untuk kategori ini.</p>
      )}
    </>
  );
}
