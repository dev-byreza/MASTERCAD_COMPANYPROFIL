"use client";
import { useState } from "react";
export function LoginForm() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const values = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.get("email"),
          password: values.get("password"),
        }),
      });
      if (!res.ok) {
        setError(
          res.status === 429
            ? "Terlalu banyak percobaan. Coba kembali nanti."
            : "Email atau kata sandi tidak sesuai.",
        );
        setBusy(false);
        return;
      }
      window.location.assign("/admin");
    } catch {
      setError("Login belum tersedia. Coba kembali.");
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit}>
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      <div className="field">
        <label htmlFor="email">Email admin</label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="username"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="password">Kata sandi</label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </div>
      <button className="button" type="submit" disabled={busy}>
        {busy ? "Memeriksa akun…" : "Masuk ke workspace"}
      </button>
    </form>
  );
}
