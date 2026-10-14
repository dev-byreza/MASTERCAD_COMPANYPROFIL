import Link from "next/link";
export default function NotFound() {
  return (
    <main className="container" style={{ paddingTop: 100, paddingBottom: 100 }}>
      <span className="eyebrow">404 / HALAMAN TIDAK DITEMUKAN</span>
      <h1 style={{ fontSize: 44, margin: "20px 0" }}>
        Halaman belum tersedia.
      </h1>
      <p>Alamat ini mungkin berubah atau kontennya belum diterbitkan.</p>
      <Link href="/" className="button" style={{ marginTop: 30 }}>
        Kembali ke beranda
      </Link>
    </main>
  );
}
