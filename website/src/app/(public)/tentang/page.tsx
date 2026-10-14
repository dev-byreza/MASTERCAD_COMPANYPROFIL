import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { settings } from "@/lib/content";
export const metadata = {
  title: "Studio",
  alternates: { canonical: "/tentang" },
};
export default function About() {
  const s = settings();
  return (
    <main id="main" className="container page-content">
      <PageHeading
        label="STUDIO / MASTERCAD"
        title="Berangkat dari fungsi. Dikerjakan dengan detail."
      />
      <div className="two-column">
        <div className="prose">
          <p>{s.about}</p>
          <h2>Memahami sebelum merancang.</h2>
          <p>
            Fungsi, dimensi, material, dan cara pembuatan menjadi dasar
            pembahasan. Kebutuhan yang jelas membantu menentukan lingkup model,
            gambar teknik, dan keluaran desain.
          </p>
          <Link className="button" href="/kontak">
            Diskusikan kebutuhan desain
          </Link>
        </div>
        <figure style={{ margin: 0 }}>
          <img
            className="detail-visual"
            src="/assets/engineering-hero.webp"
            alt="Ilustrasi konsep assembly mekanikal"
            width="1200"
            height="800"
          />
          <figcaption className="eyebrow">
            STUDI KONSEP / MECHANICAL ASSEMBLY
          </figcaption>
        </figure>
      </div>
    </main>
  );
}
