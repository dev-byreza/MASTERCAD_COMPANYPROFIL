"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function InquiryActions({
  id,
  status,
  version,
}: {
  id: string;
  status: string;
  version: number;
}) {
  const router = useRouter(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function update(next: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next, expectedVersion: version }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error?.message);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memperbarui.");
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (
      !confirm(
        "Hapus pesan ini secara permanen beserta kontak pribadi? Tindakan ini tidak dapat dibatalkan dari workspace.",
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/inquiries/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedVersion: version }),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error?.message);
      }
      router.push("/admin/pesan");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
      setBusy(false);
    }
  }
  return (
    <>
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      <div className="editor-toolbar">
        <span className={`badge ${status}`}>{status}</span>
        {status !== "IN_PROGRESS" && (
          <button
            className="button"
            disabled={busy}
            onClick={() => update("IN_PROGRESS")}
          >
            {status === "CLOSED" ? "Buka kembali" : "Tandai ditindaklanjuti"}
          </button>
        )}
        {status === "IN_PROGRESS" && (
          <button
            className="button"
            disabled={busy}
            onClick={() => update("CLOSED")}
          >
            Tandai selesai
          </button>
        )}
        <button className="button danger" disabled={busy} onClick={remove}>
          Hapus permanen
        </button>
      </div>
    </>
  );
}
