"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MediaPicker } from "./media-picker";
type EditorRecord = {
  id: string;
  type: string;
  slug: string;
  draft: Record<string, unknown>;
  published: Record<string, unknown> | null;
  status: string;
  version: number;
  sort_order: number;
};
export function RecordEditor({
  initial,
  type,
}: {
  initial?: EditorRecord;
  type: string;
}) {
  const router = useRouter();
  const [record, setRecord] = useState(initial),
    [payload, setPayload] = useState<Record<string, unknown>>(
      initial?.draft || {
        title: "",
        description: "",
        body: "",
        kind: "CONCEPT",
        images: [],
        alts: [],
      },
    ),
    [slug, setSlug] = useState(initial?.slug || ""),
    [order, setOrder] = useState(initial?.sort_order || 0),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    [dirty, setDirty] = useState(false),
    [uploading, setUploading] = useState(false);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function change(key: string, value: unknown) {
    setPayload((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setNotice("");
  }
  const fields =
    type === "settings"
      ? [
          ["name", "Nama bisnis"],
          ["tagline", "Tagline"],
          ["headline", "Headline beranda (baris baru diperbolehkan)"],
          ["intro", "Pengantar beranda"],
          ["about", "Profil studio"],
          ["email", "Email resmi"],
          ["phone", "Telepon resmi"],
          ["whatsapp", "WhatsApp (digit, contoh 628...)"],
          ["address", "Alamat"],
          ["seoTitle", "Judul SEO default"],
          ["seoDescription", "Deskripsi SEO default"],
        ]
      : [
          ["title", "Judul"],
          ...(type === "portfolio" || type === "service"
            ? [
                ["category", "Kategori"],
                ["description", "Ringkasan"],
              ]
            : []),
          ["body", "Isi / penjelasan"],
          ...(type === "portfolio" || type === "service"
            ? [["deliverables", "Lingkup keluaran (satu per baris)"]]
            : []),
        ];
  async function save() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const data = {
        type,
        slug: type === "settings" ? "site" : slug,
        payload: cleanPayload(),
        sortOrder: order,
        ...(record ? { expectedVersion: record.version } : {}),
      };
      const response = await fetch(
        "/api/v1/admin/records" + (record ? "/" + record.id : ""),
        {
          method: record ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message);
      setRecord(result);
      setPayload(result.draft);
      setDirty(false);
      setNotice("Draft tersimpan. Terbitkan untuk memperbarui website publik.");
      if (!record) router.replace(`/admin/editor/${result.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }
  function cleanPayload() {
    const keys =
      type === "settings"
        ? fields.map((f) => f[0])
        : [
            "title",
            "category",
            "description",
            "body",
            "deliverables",
            ...(type === "portfolio"
              ? ["kind", "permission", "images", "alts"]
              : []),
          ];
    return Object.fromEntries(
      keys.filter((k) => payload[k] !== undefined).map((k) => [k, payload[k]]),
    );
  }
  async function action(action: string) {
    if (!record) return;
    if (dirty) {
      setError("Simpan Draft sebelum mengubah status publikasi.");
      return;
    }
    if (
      action !== "publish" &&
      !confirm(
        action === "archive"
          ? "Arsipkan konten? Konten akan hilang dari website publik."
          : "Batalkan publikasi? Konten dan media yang hanya digunakan di sini tidak dapat dilihat publik.",
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/records/${record.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedVersion: record.version }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error?.message);
      setRecord(result);
      setNotice(
        action === "publish"
          ? "Konten diterbitkan. Website publik sudah diperbarui."
          : "Status publikasi diperbarui.",
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Operasi gagal.");
    } finally {
      setBusy(false);
    }
  }
  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
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
      change("images", [...((payload.images as string[]) || []), result.url]);
      change("alts", [...((payload.alts as string[]) || []), ""]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal.");
    } finally {
      setUploading(false);
    }
  }
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>
            {type === "settings"
              ? "Identitas & kontak."
              : record
                ? "Edit konten."
                : "Buat konten baru."}
          </h1>
          <p>
            {type === "settings"
              ? "Informasi yang digunakan pada website publik."
              : "Simpan Draft, tinjau, lalu terbitkan saat siap."}
          </p>
        </div>
      </div>
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
      <div className="editor-toolbar">
        <span className={`badge ${record?.status || "Draft"}`}>
          {record?.status || "Draft"}
          {dirty ? " · belum disimpan" : ""}
        </span>
        <button
          className="button secondary"
          disabled={busy || uploading}
          onClick={save}
        >
          {busy ? "Memproses…" : "Simpan Draft"}
        </button>
        {record && (
          <>
            <Link
              href={`/admin/preview/${record.id}`}
              className="button secondary"
              target="_blank"
            >
              Preview Draft
            </Link>
            <button
              className="button"
              disabled={busy || dirty || uploading}
              onClick={() => action("publish")}
            >
              Terbitkan
            </button>
            {type !== "settings" && record.status === "Published" && (
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => action("unpublish")}
              >
                Unpublish
              </button>
            )}
            {type !== "settings" && (
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => action("archive")}
              >
                Arsipkan
              </button>
            )}
          </>
        )}
      </div>
      <div className="admin-panel">
        <div className="admin-form">
          {type !== "settings" && (
            <div className="form-grid">
              <div className="field">
                <label htmlFor="slug">
                  Slug URL (huruf kecil dan tanda hubung)
                </label>
                <input
                  id="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setDirty(true);
                  }}
                  maxLength={100}
                />
              </div>
              <div className="field">
                <label htmlFor="sort">Urutan tampil</label>
                <input
                  id="sort"
                  type="number"
                  min={0}
                  max={9999}
                  value={order}
                  onChange={(e) => {
                    setOrder(Number(e.target.value));
                    setDirty(true);
                  }}
                />
              </div>
            </div>
          )}
          {fields.map(([key, label]) => (
            <div className="field" key={key}>
              <label htmlFor={key}>{label}</label>
              {[
                "body",
                "deliverables",
                "about",
                "intro",
                "description",
                "headline",
                "seoDescription",
                "address",
              ].includes(key) ? (
                <textarea
                  id={key}
                  className={key === "body" || key === "about" ? "large" : ""}
                  value={String(payload[key] || "")}
                  onChange={(e) => change(key, e.target.value)}
                />
              ) : (
                <input
                  id={key}
                  value={String(payload[key] || "")}
                  onChange={(e) => change(key, e.target.value)}
                  maxLength={key === "title" ? 150 : 300}
                />
              )}
            </div>
          ))}
          {type === "portfolio" && (
            <>
              <MediaPicker
                disabled={
                  uploading || ((payload.images as string[]) || []).length >= 6
                }
                onSelect={(url) => {
                  const images = (payload.images as string[]) || [];
                  if (!images.includes(url)) {
                    change("images", [...images, url]);
                    change("alts", [...((payload.alts as string[]) || []), ""]);
                  }
                }}
              />
              <div className="field">
                <label htmlFor="kind">Jenis karya</label>
                <select
                  id="kind"
                  value={String(payload.kind || "CONCEPT")}
                  onChange={(e) => change("kind", e.target.value)}
                >
                  <option value="CONCEPT">Studi Konsep</option>
                  <option value="PROJECT">Proyek pelanggan</option>
                </select>
              </div>
              {payload.kind === "PROJECT" && (
                <label className="consent">
                  <input
                    type="checkbox"
                    checked={Boolean(payload.permission)}
                    onChange={(e) => change("permission", e.target.checked)}
                  />
                  <span>
                    Saya mengonfirmasi izin publikasi proyek dan gambar telah
                    diperoleh.
                  </span>
                </label>
              )}
              <div className="field">
                <label htmlFor="upload">
                  Gambar (JPEG/PNG/WebP ≤5 MB, maksimal 6)
                </label>
                <input
                  id="upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={
                    uploading ||
                    ((payload.images as string[]) || []).length >= 6
                  }
                  onChange={(e) => {
                    upload(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                {uploading && <p role="status">Memproses gambar…</p>}
              </div>
              {((payload.images as string[]) || []).map((image, i) => (
                <div className="admin-panel" key={image}>
                  <img
                    src={image}
                    alt={String(
                      ((payload.alts as string[]) || [])[i] || "Preview admin",
                    )}
                    style={{ maxWidth: 320, marginBottom: 15 }}
                  />
                  <div className="field">
                    <label htmlFor={`alt-${i}`}>Alt text gambar {i + 1}</label>
                    <input
                      id={`alt-${i}`}
                      value={((payload.alts as string[]) || [])[i] || ""}
                      onChange={(e) => {
                        const alts = [...((payload.alts as string[]) || [])];
                        alts[i] = e.target.value;
                        change("alts", alts);
                      }}
                      maxLength={300}
                    />
                  </div>
                  <button
                    className="button secondary"
                    style={{ marginTop: 14 }}
                    onClick={() => {
                      change(
                        "images",
                        (payload.images as string[]).filter((_, n) => n !== i),
                      );
                      change(
                        "alts",
                        (payload.alts as string[]).filter((_, n) => n !== i),
                      );
                    }}
                  >
                    Lepas dari karya
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
