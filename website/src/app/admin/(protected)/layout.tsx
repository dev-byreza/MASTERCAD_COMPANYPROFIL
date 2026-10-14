import { AdminNav } from "@/components/admin-nav";
import { pageAdmin } from "@/lib/admin-session";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Workspace",
  robots: { index: false, follow: false },
};
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await pageAdmin();
  return (
    <div className="admin-shell">
      <AdminNav />
      <main className="admin-main">
        <div className="admin-topline">
          <span>MASTERCAD / WORKSPACE</span>
          <span>{admin.email}</span>
        </div>
        {children}
      </main>
    </div>
  );
}
