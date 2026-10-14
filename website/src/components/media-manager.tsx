"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
type Media = {
  id: string;
  bytes: number;
  width: number;
  height: number;
  created_at: string;
};
export function MediaManager({ items }: { items: Media[] }) {
  const router = useRouter(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  async function upload(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/v1/admin/media", {
        method: "POST",
        body: form,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error?.message);
      setNotice(
        "Gambar tersimpan privat. Tambahkan melalui editor karya untuk menerbitkannya.",
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal.");
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: string) {
    if (!confirm("Hapus gambar yang tidak digunakan ini secara permanen?"))
      return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/media/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error?.message);
      }
      setNotice("Gambar dihapus.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    } finally {
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
      {notice && (
        <div className="notice success" role="status">
          {notice}
        </div>
      )}
      <div className="admin-panel">
        <div className="field">
          <label htmlFor="media-upload">
            Upload JPEG/PNG/WebP, maksimal 5 MB
          </label>
          <input
            id="media-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            onChange={(e) => {
              upload(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      </div>
      {items.length ? (
        <div className="media-list">
          {items.map((item) => (
            <div className="media-card" key={item.id}>
              <img
                src={`/api/v1/media/${item.id}`}
                alt="Preview media admin"
                width={item.width}
                height={item.height}
              />
              <p>
                {item.width} × {item.height} · {Math.round(item.bytes / 1024)}{" "}
                KB
              </p>
              <p>/api/v1/media/{item.id}</p>
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => {
                  navigator.clipboard
                    .writeText(`/api/v1/media/${item.id}`)
                    .then(() => setNotice("Alamat gambar disalin."))
                    .catch(() =>
                      setError(
                        "Tidak dapat menyalin. Pilih alamat gambar secara manual.",
                      ),
                    );
                }}
              >
                Salin alamat
              </button>
              <button
                className="button danger"
                disabled={busy}
                style={{ marginTop: 8 }}
                onClick={() => remove(item.id)}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-state">
          Belum ada gambar yang diunggah. Gambar ilustrasi bawaan tetap tersedia
          di editor studi konsep.
        </p>
      )}
    </>
  );
}
