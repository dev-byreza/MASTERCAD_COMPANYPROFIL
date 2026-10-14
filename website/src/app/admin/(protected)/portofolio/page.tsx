import Link from "next/link";
import { pageAdmin } from "@/lib/admin-session";
import { allRecords } from "@/lib/content";
import { RecordList } from "@/components/record-list";
export default async function PortfolioPage() {
  await pageAdmin();
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Portofolio.</h1>
          <p>Terbitkan proyek berizin dan studi konsep berlabel.</p>
        </div>
        <Link href="/admin/editor/new?type=portfolio" className="button">
          Tambah karya
        </Link>
      </div>
      <div className="admin-panel">
        <RecordList items={allRecords("portfolio")} />
      </div>
    </>
  );
}
