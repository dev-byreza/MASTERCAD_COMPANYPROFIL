import Link from "next/link";
import { pageAdmin } from "@/lib/admin-session";
import { allRecords } from "@/lib/content";
import { RecordList } from "@/components/record-list";
export default async function ContentPage() {
  await pageAdmin();
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Konten website.</h1>
          <p>Layanan, FAQ dan halaman terstruktur.</p>
        </div>
      </div>
      <div className="admin-list-links">
        <Link href="/admin/editor/new?type=service" className="button">
          Tambah layanan
        </Link>
        <Link href="/admin/editor/new?type=faq" className="button secondary">
          Tambah FAQ
        </Link>
        <Link href="/admin/editor/new?type=page" className="button secondary">
          Tambah langkah proses
        </Link>
      </div>
      <div className="admin-panel">
        <RecordList
          items={allRecords().filter((r) =>
            ["service", "faq", "page"].includes(r.type),
          )}
        />
      </div>
    </>
  );
}
