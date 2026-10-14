"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="container" style={{ paddingTop: 100, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 40 }}>Halaman belum dapat dimuat.</h1>
      <p style={{ margin: "20px 0" }}>
        Silakan coba kembali beberapa saat lagi.
      </p>
      <button className="button" onClick={reset}>
        Coba kembali
      </button>
    </main>
  );
}
