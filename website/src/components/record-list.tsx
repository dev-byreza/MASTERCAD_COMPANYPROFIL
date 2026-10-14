import Link from "next/link";
type Row = {
  id: string;
  type: string;
  draft: Record<string, unknown>;
  status: string;
  slug: string;
  version: number;
  sort_order: number;
};
export function RecordList({ items }: { items: Row[] }) {
  return items.length ? (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Judul</th>
            <th>Tipe</th>
            <th>Status</th>
            <th>Urutan</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <Link href={`/admin/editor/${item.id}`}>
                  {String(item.draft.title || item.draft.name || item.slug)}
                </Link>
              </td>
              <td>{item.type}</td>
              <td>
                <span className={`badge ${item.status}`}>{item.status}</span>
              </td>
              <td>{item.sort_order}</td>
              <td>
                <Link href={`/admin/editor/${item.id}`}>Buka editor</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>Belum ada konten. Buat Draft pertama untuk memulai.</p>
  );
}
