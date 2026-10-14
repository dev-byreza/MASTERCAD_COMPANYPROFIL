import Link from "next/link";
import type { Content } from "@/lib/content";
// Adapted composition from 21st uiable/Portfolio Showcase Grid (29523).
// Uses restrained surfaces, genuine domain copy and public snapshots.
export function PortfolioGrid({ items }: { items: Content[] }) {
  return (
    <div className="portfolio-grid">
      {items.map((item, i) => (
        <Link
          className={`portfolio-item ${i % 3 === 0 ? "portfolio-wide" : ""}`}
          key={item.slug}
          href={`/portofolio/${item.slug}`}
        >
          <div className="portfolio-image">
            <img
              src={item.images?.[0]}
              alt={item.alts?.[0] || item.title}
              loading="lazy"
              width="1200"
              height="800"
            />
            <span className="image-label">
              {item.kind === "CONCEPT" ? "STUDI KONSEP" : "PROYEK"}
            </span>
          </div>
          <div className="portfolio-info">
            <div>
              <p className="eyebrow">{item.category}</p>
              <h3>{item.title}</h3>
            </div>
            <span className="text-link">Lihat detail</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
