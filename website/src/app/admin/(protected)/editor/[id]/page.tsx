import { notFound } from "next/navigation";
import { pageAdmin } from "@/lib/admin-session";
import { allRecords } from "@/lib/content";
import { RecordEditor } from "@/components/record-editor";
export default async function Editor({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  await pageAdmin();
  const { id } = await params,
    { type } = await searchParams;
  if (id === "new") {
    if (!["service", "faq", "page", "portfolio"].includes(type || ""))
      notFound();
    return <RecordEditor type={type!} />;
  }
  const item = allRecords().find((r) => r.id === id);
  if (!item) notFound();
  return <RecordEditor initial={item} type={item.type} />;
}
