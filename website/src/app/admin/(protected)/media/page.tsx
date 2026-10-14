import { pageAdmin } from "@/lib/admin-session";
import { getDb } from "@/lib/db";
import { MediaManager } from "@/components/media-manager";
export default async function Media() {
  await pageAdmin();
  const items = getDb()
    .prepare("SELECT * FROM media ORDER BY created_at DESC LIMIT 200")
    .all() as {
    id: string;
    bytes: number;
    width: number;
    height: number;
    created_at: string;
  }[];
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Media studio.</h1>
          <p>
            Gambar privat. Publik hanya melihat gambar yang dirujuk karya
            Published.
          </p>
        </div>
      </div>
      <MediaManager items={items} />
    </>
  );
}
