import { notFound } from "next/navigation";
import { pageAdmin } from "@/lib/admin-session";
import { allRecords } from "@/lib/content";
export default async function Preview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await pageAdmin();
  const { id } = await params;
  const row = allRecords().find((r) => r.id === id);
  if (!row) notFound();
  const p = row.draft;
  return (
    <>
      <div className="preview-label">
        Preview Draft privat · bukan konten publik
      </div>
      <div className="admin-panel">
        <h1 style={{ fontSize: 36, marginBottom: 24 }}>
          {p.title || p.headline || p.name}
        </h1>
        <p>{p.description || p.intro}</p>
        {p.images?.map((image: string, i: number) => (
          <img
            key={image}
            src={image}
            alt={p.alts?.[i] || "Preview"}
            className="detail-visual"
          />
        ))}
        <div className="prose" style={{ marginTop: 30 }}>
          <p>{p.body || p.about}</p>
          <p>{p.deliverables}</p>
        </div>
      </div>
    </>
  );
}
