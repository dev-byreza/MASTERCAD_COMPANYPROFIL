import { pageAdmin } from "@/lib/admin-session";
import { allRecords } from "@/lib/content";
import { RecordEditor } from "@/components/record-editor";
export default async function Settings() {
  await pageAdmin();
  return <RecordEditor initial={allRecords("settings")[0]} type="settings" />;
}
