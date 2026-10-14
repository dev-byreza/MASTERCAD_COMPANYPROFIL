import Link from "next/link";
import { notFound } from "next/navigation";
import { pageAdmin } from "@/lib/admin-session";
import { getDb } from "@/lib/db";
import { InquiryActions } from "@/components/inquiry-actions";
export default async function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await pageAdmin();
  const { id } = await params;
  const item = getDb().prepare("SELECT * FROM inquiries WHERE id=?").get(id) as
    | {
        id: string;
        reference: string;
        name: string;
        email: string;
        phone: string;
        company: string;
        service: string;
        message: string;
        status: string;
        version: number;
        created_at: string;
        consent_at: string;
        notice_version: string;
      }
    | undefined;
  if (!item) notFound();
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>{item.reference}</h1>
          <p>Konsultasi dari {item.name}</p>
        </div>
        <Link href="/admin/pesan" className="button secondary">
          Kembali ke kotak masuk
        </Link>
      </div>
      <InquiryActions id={id} status={item.status} version={item.version} />
      <div className="admin-panel">
        <h2>Detail pengirim</h2>
        <dl className="inquiry-details">
          {[
            ["Nama", item.name],
            ["Email", item.email],
            ["Telepon", item.phone || "—"],
            ["Perusahaan", item.company || "—"],
            ["Layanan", item.service || "Belum ditentukan"],
            [
              "Diterima",
              new Date(item.created_at).toLocaleString("id-ID", {
                timeZone: "Asia/Makassar",
              }),
            ],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="admin-panel">
        <h2>Brief desain</h2>
        <p className="message-body">{item.message}</p>
        <p className="eyebrow" style={{ marginTop: 20 }}>
          PERSETUJUAN TERCATAT · {item.notice_version}
        </p>
      </div>
    </>
  );
}
