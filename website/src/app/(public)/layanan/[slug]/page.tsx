import Link from "next/link";
import { notFound } from "next/navigation";
import { publicItem } from "@/lib/content";
import { PageHeading } from "@/components/page-heading";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = publicItem("service", slug);
  return {
    title: item?.title || "Layanan tidak ditemukan",
    description: item?.description,
    alternates: { canonical: `/layanan/${slug}` },
    openGraph: { title: item?.title, description: item?.description },
  };
}
export default async function Service({ params }: Props) {
  const { slug } = await params;
  const item = publicItem("service", slug);
  if (!item) notFound();
  return (
    <main id="main" className="container page-content">
      <PageHeading
        label={item.category || "LAYANAN"}
        title={item.title}
        description={item.description}
      />
      <div className="detail-grid">
        <div className="prose">
          <p>{item.body}</p>
          <h2>Mulai dengan brief yang jelas.</h2>
          <p>
            Sampaikan fungsi, referensi, dimensi, dan tujuan penggunaan desain.
            Lingkup dan keluaran akhir ditentukan setelah kebutuhan Anda
            ditinjau.
          </p>
          <Link className="text-link" href="/layanan">
            Kembali ke layanan
          </Link>
        </div>
        <aside className="detail-panel">
          <h2>Lingkup keluaran</h2>
          <ul>
            {item.deliverables
              ?.split("\n")
              .filter(Boolean)
              .map((line) => (
                <li key={line}>{line}</li>
              ))}
          </ul>
          <Link className="button" href={`/kontak?layanan=${item.slug}`}>
            Konsultasikan layanan ini
          </Link>
        </aside>
      </div>
    </main>
  );
}
