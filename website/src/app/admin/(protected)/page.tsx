import Link from "next/link";
import { pageAdmin } from "@/lib/admin-session";
import { getDb } from "@/lib/db";
export default async function AdminHome() {
  await pageAdmin();
  const db = getDb();
  const count = (sql: string) => (db.prepare(sql).get() as { n: number }).n;
  const latest = db
    .prepare(
      "SELECT id,name,reference,status,created_at FROM inquiries ORDER BY created_at DESC LIMIT 5",
    )
    .all() as {
    id: string;
    name: string;
    reference: string;
    status: string;
    created_at: string;
  }[];
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Ringkasan workspace.</h1>
          <p>Konten aktif dan konsultasi yang perlu ditinjau.</p>
        </div>
        <Link className="button" href="/admin/pesan">
          Buka pesan konsultasi
        </Link>
      </div>
      <div className="stats">
        <div className="stat">
          <p>Pesan baru</p>
          <strong>
            {count("SELECT count(*) n FROM inquiries WHERE status='NEW'")}
          </strong>
        </div>
        <div className="stat">
          <p>Portofolio Published</p>
          <strong>
            {count(
              "SELECT count(*) n FROM records WHERE type='portfolio' AND status='Published'",
            )}
          </strong>
        </div>
        <div className="stat">
          <p>Konten Draft</p>
          <strong>
            {count("SELECT count(*) n FROM records WHERE status='Draft'")}
          </strong>
        </div>
      </div>
      <div className="admin-panel">
        <h2>Konsultasi terbaru</h2>
        {latest.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Referensi</th>
                  <th>Nama</th>
                  <th>Status</th>
                  <th>Masuk</th>
                </tr>
              </thead>
              <tbody>
                {latest.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <Link href={`/admin/pesan/${i.id}`}>{i.reference}</Link>
                    </td>
                    <td>{i.name}</td>
                    <td>
                      <span className={`badge ${i.status}`}>{i.status}</span>
                    </td>
                    <td>
                      {new Date(i.created_at).toLocaleDateString("id-ID", {
                        timeZone: "Asia/Makassar",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Belum ada pesan konsultasi.</p>
        )}
      </div>
      <div className="admin-panel">
        <h2>Mulai dari konten.</h2>
        <p>
          Layanan dan studi konsep awal tersedia untuk ditinjau. Sesuaikan
          informasi usaha dan kontak resmi sebelum publikasi website.
        </p>
        <div
          className="admin-list-links"
          style={{ marginTop: 22, marginBottom: 0 }}
        >
          <Link className="button secondary" href="/admin/konten">
            Edit layanan & FAQ
          </Link>
          <Link className="button secondary" href="/admin/portofolio">
            Kelola karya
          </Link>
          <Link className="button secondary" href="/admin/pengaturan">
            Identitas & kontak
          </Link>
        </div>
      </div>
    </>
  );
}
