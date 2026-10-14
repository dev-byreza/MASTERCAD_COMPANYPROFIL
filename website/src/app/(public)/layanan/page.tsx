import Link from "next/link";
import { publicContent } from "@/lib/content";
import { PageHeading } from "@/components/page-heading";
export const metadata = {
  title: "Layanan",
  alternates: { canonical: "/layanan" },
};
export default function Services() {
  const items = publicContent("service");
  return (
    <main id="main" className="container page-content">
      <PageHeading
        label="KEAHLIAN / LAYANAN"
        title="Dukungan desain, dari ide hingga dokumentasi."
        description="Tentukan lingkup yang sesuai dengan tahap pengembangan produk Anda."
      />
      <div className="service-list">
        {items.map((item, i) => (
          <Link
            className="service-row"
            key={item.slug}
            href={`/layanan/${item.slug}`}
          >
            <span className="service-number">0{i + 1}</span>
            <div>
              <p className="eyebrow">{item.category}</p>
              <h3>{item.title}</h3>
            </div>
            <p>{item.description}</p>
            <span className="service-view">Detail layanan</span>
          </Link>
        ))}
      </div>
      {!items.length && (
        <p className="empty-state">
          Informasi layanan sedang diperbarui. Silakan konsultasikan kebutuhan
          Anda.
        </p>
      )}
    </main>
  );
}
