import Link from "next/link";
import { notFound } from "next/navigation";
import { publicItem } from "@/lib/content";
import { PageHeading } from "@/components/page-heading";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = publicItem("portfolio", slug);
  return {
    title: item?.title || "Karya tidak ditemukan",
    description: item?.description,
    alternates: { canonical: `/portofolio/${slug}` },
    openGraph: { title: item?.title, description: item?.description },
  };
}
export default async function PortfolioDetail({ params }: Props) {
  const { slug } = await params;
  const item = publicItem("portfolio", slug);
  if (!item) notFound();
  return (
    <main id="main" className="container page-content">
      <PageHeading
        label={`${item.category} / ${item.kind === "CONCEPT" ? "STUDI KONSEP" : "PROYEK"}`}
        title={item.title}
        description={item.description}
      />
      {item.images?.map((image, i) => (
        <img
          key={image}
          className="detail-visual"
          src={image}
          alt={item.alts?.[i] || item.title}
          width="1200"
          height="800"
          loading={i ? "lazy" : "eager"}
        />
      ))}
      <div className="detail-grid">
        <div className="prose">
          <p>{item.body}</p>
          {item.kind === "CONCEPT" && (
            <p>Studi konsep ini tidak merepresentasikan pekerjaan pelanggan.</p>
          )}
          <Link className="text-link" href="/portofolio">
            Kembali ke portofolio
          </Link>
        </div>
        <aside className="detail-panel">
          <h2>Lingkup desain</h2>
          <ul>
            {item.deliverables
              ?.split("\n")
              .filter(Boolean)
              .map((line) => (
                <li key={line}>{line}</li>
              ))}
          </ul>
          <Link className="button" href="/kontak">
            Diskusikan kebutuhan serupa
          </Link>
        </aside>
      </div>
    </main>
  );
}
