# MasterCAD — company profile full stack

MVP lokal dengan Next.js, TypeScript, Better Auth, SQLite persisten dan media privat. Website berbahasa Indonesia, admin konten/portofolio, serta formulir konsultasi yang tersimpan di database.

Landing page terbaru dirancang mandiri tanpa skill 21st: hero foto lebar, charcoal/amber MasterCAD, panel layanan, karya unggulan dan proses kerja. Logo/aset asli serta label studi konsep dipertahankan; kontak dan proyek resmi belum diisi. Lihat [bukti desain terbaru](docs/evidence/custom-redesign.md). Jangan memakai skill 21st untuk revisi berikutnya kecuali diminta lagi oleh pengguna.

## Jalankan lokal

Gunakan Node.js ≥24.15; verifikasi sesi ini memakai Node 26.5.0. Jalankan dari folder `website`:

```powershell
npm ci
npm run setup
npm run admin:create -- --local
npm run dev
```

Website: http://127.0.0.1:3000/ · Admin: http://127.0.0.1:3000/admin/login

`setup` membuat `.env.local` dengan secret acak jika belum ada, menginisialisasi database dan schema auth. Akun lokal memakai email `admin@mastercad.local`; password acak disimpan di `.data/admin-access.txt`, bukan di source. Bila akun sudah ada, skrip tidak mengganti password. `.env.local` dan `.data/` diabaikan Git; jangan bagikan atau masukkan ke deploy statis.

Database `.data/mastercad.sqlite` bertahan saat server di-restart. Upload hasil re-encode berada di `.data/media`, di luar direktori publik. Aset awal `dist/assets` tetap disimpan.

## Menggunakan admin

1. Masuk memakai akses lokal. Pengaturan memuat identitas, profil, hero, kontak dan SEO.
2. Konten website memuat layanan, FAQ, dan langkah proses. Simpan draft lalu gunakan Preview untuk meninjau.
3. Publish menerapkan draft ke snapshot publik. Edit berikutnya tidak mengubah halaman publik sampai di-publish kembali. Unpublish menutup halaman dari publik; Arsip mengeluarkan item dari daftar aktif.
4. Portofolio mendukung kategori, tipe Konsep/Proyek, galeri maksimum enam gambar dan alt text. Proyek memerlukan konfirmasi izin publikasi. Media privat hanya dapat dibaca publik ketika dirujuk oleh item Published.
5. Form konsultasi menulis pesan ke inbox. Admin dapat membaca detail, memfilter status, menindaklanjuti dan menghapus. Form tidak mengirim email otomatis.

Gambar JPEG/PNG/WebP dibatasi 5 MB dan 20 megapixel; server mengubahnya ke WebP dan membuang metadata. SVG/GIF/HTML tidak diterima. Kontak kosong tidak menghasilkan alamat atau nomor buatan.

## Pemeriksaan

```powershell
npm run check
npm run test
npm run build
```

Untuk mencoba hasil build, hentikan dev server terlebih dahulu, lalu `npm start`. Keduanya menggunakan port 3000. Build produksi menggunakan webpack, sedangkan dev menggunakan Turbopack; output dipisah menjadi `.next` dan `.next-dev`.

`scripts/smoke.ts` menguji API HTTP terhadap dev server yang berjalan. Smoke ini membuat satu item/unggahan QA lokal, menguji publish, lalu mengarsipkannya. Gunakan hanya database development, bukan produksi.

## Dokumen

- [PRD](docs/PRD.md), [Design](docs/Design.md), [Implementation dan backlog](docs/Implementation.md).
- [Hasil build dan pengujian](docs/evidence/build-review.md).
- [Operasi dan batas produksi](docs/operations.md).

Belum di-deploy. Konfigurasi hosting statis lama bukan target deploy aplikasi Next.js ini. Untuk produksi diperlukan runtime Node dengan storage persisten atau migrasi ke PostgreSQL/private object storage, domain HTTPS, scheduler dan pemantauan. Detail konten, kontak, privasi serta izin karya harus ditinjau pemilik.
