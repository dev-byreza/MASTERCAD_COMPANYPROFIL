import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "./security";
export async function pageAdmin() {
  try {
    return await requireAdmin(
      new Request(process.env.APP_URL || "http://127.0.0.1:3000", {
        headers: await headers(),
      }),
    );
  } catch {
    redirect("/admin/login");
  }
}
