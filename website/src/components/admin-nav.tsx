"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
const nav = [
  ["/admin", "Ringkasan"],
  ["/admin/konten", "Konten website"],
  ["/admin/portofolio", "Portofolio"],
  ["/admin/media", "Media"],
  ["/admin/pesan", "Pesan konsultasi"],
  ["/admin/pengaturan", "Pengaturan"],
];
export function AdminNav() {
  const path = usePathname(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function logout() {
    setBusy(true);
    try {
      const res = await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!res.ok) throw new Error();
      window.location.assign("/admin/login");
    } catch {
      setError("Gagal keluar. Coba kembali.");
      setBusy(false);
    }
  }
  return (
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/admin">
        MASTERCAD
      </Link>
      <small>CONTENT WORKSPACE</small>
      <nav aria-label="Navigasi admin">
        {nav.map(([href, label]) => (
          <Link
            className={
              (href === "/admin" ? path === href : path.startsWith(href))
                ? "active"
                : ""
            }
            key={href}
            href={href}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="admin-side-bottom">
        <Link href="/" target="_blank">
          Lihat website
        </Link>
        <button disabled={busy} className="logout-button" onClick={logout}>
          {busy ? "Keluar…" : "Keluar akun"}
        </button>
        {error && <p role="alert">{error}</p>}
      </div>
    </aside>
  );
}
