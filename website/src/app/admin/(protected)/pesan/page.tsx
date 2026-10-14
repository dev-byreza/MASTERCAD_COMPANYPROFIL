import Link from "next/link";
import { pageAdmin } from "@/lib/admin-session";
import { getDb } from "@/lib/db";
type Inquiry = {
  id: string;
  reference: string;
  name: string;
  company: string;
  status: string;
  created_at: string;
};
export default async function Inbox({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; cursor?: string }>;
}) {
  await pageAdmin();
  const query = await searchParams,
    status = ["NEW", "IN_PROGRESS", "CLOSED"].includes(query.status || "")
      ? query.status
      : "";
  const cursor = Math.max(0, Math.min(1000000, Number(query.cursor) || 0));
  const items = (
    status
      ? getDb()
          .prepare(
            "SELECT * FROM inquiries WHERE status=? ORDER BY created_at DESC,id LIMIT 21 OFFSET ?",
          )
          .all(status, cursor)
      : getDb()
          .prepare(
            "SELECT * FROM inquiries ORDER BY created_at DESC,id LIMIT 21 OFFSET ?",
          )
          .all(cursor)
  ) as Inquiry[];
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Pesan konsultasi.</h1>
          <p>Brief yang dikirim melalui website.</p>
        </div>
      </div>
      <div className="filters">
        {[
          ["", "Semua"],
          ["NEW", "Baru"],
          ["IN_PROGRESS", "Ditindaklanjuti"],
          ["CLOSED", "Selesai"],
        ].map(([value, label]) => (
          <Link
            href={`/admin/pesan?status=${value}`}
            className={status === value ? "filter active" : "filter"}
            key={value}
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="admin-panel">
        {items.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Referensi</th>
                  <th>Nama</th>
                  <th>Perusahaan</th>
                  <th>Status</th>
                  <th>Masuk</th>
                </tr>
              </thead>
              <tbody>
                {items.slice(0, 20).map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Link href={`/admin/pesan/${item.id}`}>
                        {item.reference}
                      </Link>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.company || "—"}</td>
                    <td>
                      <span className={`badge ${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {new Date(item.created_at).toLocaleString("id-ID", {
                        timeZone: "Asia/Makassar",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Belum ada pesan pada filter ini.</p>
        )}
        <div
          className="admin-list-links"
          style={{ marginTop: 24, marginBottom: 0 }}
        >
          {cursor > 0 && (
            <Link
              className="button secondary"
              href={`/admin/pesan?status=${status}&cursor=${Math.max(0, cursor - 20)}`}
            >
              Sebelumnya
            </Link>
          )}
          {items.length > 20 && (
            <Link
              className="button secondary"
              href={`/admin/pesan?status=${status}&cursor=${cursor + 20}`}
            >
              Berikutnya
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
