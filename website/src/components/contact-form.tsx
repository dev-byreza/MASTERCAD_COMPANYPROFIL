"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import type { Content } from "@/lib/content";
export function ContactForm({
  services,
  selected,
}: {
  services: Content[];
  selected: string;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [fields, setFields] = useState<Record<string, string>>({}),
    [reference, setReference] = useState("");
  const key = useRef(""),
    lastPayload = useRef(""),
    errorRef = useRef<HTMLDivElement>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setFields({});
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name")),
      email: String(form.get("email")),
      phone: String(form.get("phone") || ""),
      company: String(form.get("company") || ""),
      service: String(form.get("service") || ""),
      message: String(form.get("message")),
      consent: form.get("consent") === "on",
      website: String(form.get("website") || ""),
    };
    const text = JSON.stringify(payload);
    if (lastPayload.current !== text || !key.current) {
      key.current = crypto.randomUUID();
      lastPayload.current = text;
    }
    try {
      const response = await fetch("/api/v1/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key.current,
        },
        body: text,
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error?.message || "Pengiriman gagal. Coba kembali.");
        setFields(result.error?.fields || {});
        setTimeout(() => errorRef.current?.focus(), 0);
      } else setReference(result.reference);
    } catch {
      setError("Koneksi terputus. Isian tetap tersedia; coba kirim kembali.");
    } finally {
      setBusy(false);
    }
  }
  if (reference)
    return (
      <div className="notice success" role="status">
        <h2 style={{ fontSize: 25, marginBottom: 16 }}>
          Brief Anda sudah tersimpan.
        </h2>
        <p style={{ color: "inherit" }}>
          Referensi: <strong>{reference}</strong>
          <br />
          Tim MasterCAD dapat meninjau pesan Anda untuk menindaklanjuti
          konsultasi.
        </p>
        <button
          className="button secondary"
          style={{ marginTop: 24 }}
          onClick={() => {
            setReference("");
            key.current = "";
            lastPayload.current = "";
          }}
        >
          Tulis kebutuhan lain
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="form-grid" aria-busy={busy}>
      {error && (
        <div
          className="notice error field full"
          role="alert"
          tabIndex={-1}
          ref={errorRef}
        >
          {error}
        </div>
      )}
      {[
        ["name", "Nama", "text", true],
        ["email", "Email", "email", true],
        ["phone", "Telepon", "tel", false],
        ["company", "Perusahaan", "text", false],
      ].map(([name, label, type, required]) => (
        <div className="field" key={String(name)}>
          <label htmlFor={String(name)}>
            {label} {!required && <span>(opsional)</span>}
          </label>
          <input
            id={String(name)}
            name={String(name)}
            type={String(type)}
            required={Boolean(required)}
            maxLength={
              name === "email"
                ? 254
                : name === "name"
                  ? 100
                  : name === "phone"
                    ? 30
                    : 150
            }
            autoComplete={
              name === "name"
                ? "name"
                : name === "email"
                  ? "email"
                  : name === "phone"
                    ? "tel"
                    : "organization"
            }
            aria-invalid={!!fields[String(name)]}
            aria-describedby={
              fields[String(name)] ? `${name}-error` : undefined
            }
          />
          {fields[String(name)] && (
            <span id={`${name}-error`} className="field-error">
              {fields[String(name)]}
            </span>
          )}
        </div>
      ))}
      <div className="field full">
        <label htmlFor="service">
          Pilihan Layanan / Paket <span>(opsional)</span>
        </label>
        <select
          name="service"
          id="service"
          defaultValue={
            services.some((s) => s.slug === selected) || selected === "bundle-all" ? selected : ""
          }
        >
          <option value="">Belum ditentukan / Tanya Rekomendasi</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
          <option value="bundle-all">
            ★ All-in-One Complete Pass (Semua 4 Layanan Sekaligus)
          </option>
        </select>
      </div>
      <div className="field full">
        <label htmlFor="message">Ceritakan kebutuhan desain Anda</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={5000}
          placeholder="Fungsi produk, referensi, ukuran, dan keluaran yang Anda butuhkan."
          aria-invalid={!!fields.message}
          aria-describedby="brief-note"
        />
        <span id="brief-note" className="eyebrow">
          MINIMAL 20 KARAKTER · TANPA INFORMASI RAHASIA
        </span>
      </div>
      <div className="honey" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          Saya menyetujui penggunaan data ini untuk menindaklanjuti konsultasi
          sesuai <Link href="/privasi">kebijakan privasi</Link>.
        </span>
      </label>
      <div className="submit-line">
        <button className="button" disabled={busy} type="submit">
          {busy ? "Menyimpan brief…" : "Kirim brief konsultasi"}
        </button>
        <p>Brief tersimpan setelah konfirmasi berhasil.</p>
      </div>
    </form>
  );
}
