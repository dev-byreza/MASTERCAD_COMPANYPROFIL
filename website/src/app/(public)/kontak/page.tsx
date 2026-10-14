import { publicContent, settings } from "@/lib/content";
import { PageHeading } from "@/components/page-heading";
import { ContactForm } from "@/components/contact-form";
export const metadata = {
  title: "Konsultasi",
  alternates: { canonical: "/kontak" },
};
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ layanan?: string; paket?: string }>;
}) {
  const s = settings(),
    query = await searchParams;
  const requested = query.layanan || query.paket || "";
  const mapped =
    requested === "database"
      ? "database-teknik-mesin"
      : requested === "lisp" || requested === "plugin-lisp-cad"
        ? "plugin-sketchup-lisp-autocad"
        : requested === "lms" || requested === "lms-autocad-inventor"
          ? "lms-pembelajaran-cad"
          : requested === "license" || requested === "lisensi"
            ? "lisensi-software-cad"
            : requested;

  return (
    <main id="main" className="container page-content">
      <PageHeading
        label="KONTAK / ORDER AKSES LIFETIME"
        title="Mulai Akses CAD & Database Anda."
        description="Pilih paket atau konsultasikan kebutuhan Database Teknik Mesin, Plugin SketchUp & LISP AutoCAD, LMS Pembelajaran CAD, dan Lisensi Software CAD."
      />
      <div className="two-column contact-layout">
        <ContactForm
          services={publicContent("service")}
          selected={mapped}
        />
        <aside className="contact-info">
          <h2>Sebelum mengirim.</h2>
          <p>
            Sertakan fungsi produk, dimensi yang diketahui, referensi, dan
            keluaran yang diinginkan. Estimasi lingkup, waktu, serta biaya
            dibahas setelah kebutuhan ditinjau.
          </p>
          <p>
            Jangan sertakan dokumen rahasia atau data sensitif pada brief awal.
          </p>
          {s.email && (
            <p>
              <a href={`mailto:${s.email}`}>{s.email}</a>
            </p>
          )}
          {s.whatsapp && (
            <p>
              <a
                href={`https://wa.me/${s.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Konsultasi via WhatsApp
              </a>
            </p>
          )}
          {s.address && <p>{s.address}</p>}
        </aside>
      </div>
    </main>
  );
}
