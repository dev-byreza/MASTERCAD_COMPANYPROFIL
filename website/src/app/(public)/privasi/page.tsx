import { PageHeading } from "@/components/page-heading";
import { settings } from "@/lib/content";
export const metadata = {
  title: "Privasi",
  alternates: { canonical: "/privasi" },
};
export default function Privacy() {
  const s = settings();
  return (
    <main id="main" className="container page-content">
      <PageHeading
        label="KEBIJAKAN PRIVASI / 5 OKTOBER 2026"
        title="Data Anda, untuk konsultasi Anda."
      />
      <article className="prose">
        <h2>Data yang dikumpulkan</h2>
        <p>
          Formulir meminta nama, email, dan brief desain. Nomor telepon,
          perusahaan, dan lingkup layanan bersifat opsional. Persetujuan dan
          waktu pengiriman dicatat. Data digunakan untuk meninjau serta
          menindaklanjuti konsultasi, bukan untuk pemasaran otomatis.
        </p>
        <h2>Penyimpanan dan akses</h2>
        <p>
          Pesan disimpan dalam database aplikasi dan hanya dapat dibaca oleh
          admin yang diizinkan. Gambar draft dan area admin tidak tersedia untuk
          pengunjung. Jangan memasukkan dokumen rahasia, identitas sensitif,
          atau kata sandi ke formulir.
        </p>
        <h2>Retensi dan penghapusan</h2>
        <p>
          Target retensi pesan adalah 180 hari sejak diterima. Data dapat
          dihapus lebih awal atas permintaan yang terverifikasi. Backup
          operasional disimpan hingga 30 hari; penghapusan diterapkan kembali
          jika backup dipulihkan. Log teknis tidak berisi brief atau kontak
          pribadi.
        </p>
        <h2>Menghubungi MasterCAD</h2>
        <p>
          {s.email
            ? `Permintaan terkait data dapat dikirim ke ${s.email}.`
            : "Gunakan formulir kontak dengan menyertakan kode referensi pesan untuk meminta tindak lanjut terkait data Anda."}
        </p>
        <h2>Cookie dan pihak ketiga</h2>
        <p>
          Area admin menggunakan cookie untuk sesi login. Website ini tidak
          menggunakan pelacakan iklan atau mengirim pesan melalui email/WhatsApp
          otomatis. Informasi penyedia hosting dan penyimpanan akan dilengkapi
          sebelum rilis publik.
        </p>
      </article>
    </main>
  );
}
