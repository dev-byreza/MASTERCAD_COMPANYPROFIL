---
title: PRD MasterCAD Full Stack
status: Draft
version: 0.4
owner: Pemilik MasterCAD
last_updated: 2026-10-13
---

# PRD — MasterCAD Company Profile Full Stack

## 1. Ringkasan

Website berbahasa Indonesia untuk menjelaskan jasa CAD engineering design, menampilkan portofolio terpercaya, dan menerima permintaan konsultasi. Admin memperbarui konten dan menindaklanjuti pesan tanpa mengubah kode. MVP menghubungkan website publik, admin yang terlindungi, database, dan penyimpanan gambar; Pengunjung tidak perlu akun.

Lingkup company profile + admin konten, portofolio, formulir kontak telah dikonfirmasi pengguna pada 5 Oktober 2026. Pada 13 Oktober 2026, pengguna menetapkan tiga paket langganan bulanan/tahunan: Database (Basic), LMS, dan Gabungan; renewal ditagih otomatis; LMS dan Database dibangun baru untuk subdomain; gateway pilihan Xendit. Harga di halaman `/paket` adalah rekomendasi awal yang diminta pengguna dan belum menjadi harga final. MVP company profile sudah tersedia lokal; modul pelanggan, produk, dan pembayaran belum tersedia. Bukti serta batas implementasi dicatat di [Implementation.md](Implementation.md) dan [build-review.md](evidence/build-review.md). Dokumen tetap **Draft**; harga, domain produksi, isi produk, target operasional, dan persetujuan rilis belum final.

## 2. Konteks dan bukti

| Jenis | Fakta / asumsi |
|---|---|
| Brand dari dokumen sebelumnya | Logo MasterCAD, amber `#FFBF00`, bahasa Indonesia, CAD engineering |
| File lokal | Aset asli tersedia di `dist/assets/`; aplikasi Next.js, API, auth, SQLite lokal dan media privat sekarang tersedia di `src/`, `scripts/`, `db/` |
| Hosting | `.openai/hosting.json` mengatur hosting statis `dist`; runtime backend belum diverifikasi |
| Git | Folder proyek dan website belum repository Git; pekerjaan pengguna dipertahankan |
| Asumsi MVP | Satu perusahaan, satu peran Admin; media gambar saja, Pesan tanpa lampiran |
| Pilihan pengguna (13 Oktober 2026) | Kedua modul dibangun baru; auto-renew; tiga paket (Database/Basic saja, LMS saja, Gabungan); periode bulanan/tahunan; Xendit untuk recurring. |
| Belum tersedia | Kontak resmi, alamat, layanan final, portofolio nyata, izin karya, domain dan nama subdomain, biaya hosting, identitas Admin produksi; persetujuan harga rekomendasi, aktivasi merchant/recurring Xendit, jenis konten dan alat awal; akun Admin lokal acak tersedia untuk mencoba MVP |
| Rekomendasi harga (belum final) | Database Rp39.000/bulan atau Rp390.000/tahun; LMS Rp129.000/bulan atau Rp1.290.000/tahun; Gabungan Rp159.000/bulan atau Rp1.590.000/tahun. Harga tahunan = 10× harga bulanan (setara kira-kira dua bulan bebas). Halaman lokal `/paket` ditandai noindex dan tombolnya hanya menuju konsultasi, bukan checkout. |
| Batas klaim | Jangan mengarang pelanggan, statistik, sertifikasi, testimoni, atau proyek. Karya konsep berlabel Konsep |

Dokumen statis sebelumnya disimpan dalam `archive/`; file historis bukan spesifikasi aktif.

## 3. Glosarium dan pengguna

- **Pengunjung**: pengguna publik yang membaca konten Published dan membuat Pesan.
- **Admin**: akun aktif yang diizinkan mengelola konten, gambar, dan Pesan.
- **Konten**: profil, layanan, proses, FAQ, dan pengaturan kontak.
- **Portofolio**: karya dengan kategori, deskripsi, gambar dan jenis `PROJECT` atau `CONCEPT`.
- **Pesan**: permintaan konsultasi dengan status `NEW`, `IN_PROGRESS`, `CLOSED`.
- **Draft / Published / Archived**: status publikasi; hanya Published boleh terlihat publik.
- **Media**: gambar admin; berkas Draft tetap privat.
- **Pelanggan**: akun pembeli terpisah dari Admin, dapat mengakses modul sesuai langganan aktif.
- **Paket**: pilihan berbayar dengan periode bulanan atau tahunan, harga, dan hak modul yang ditentukan server.
- **Langganan**: hubungan pelanggan-paket dengan masa berlaku dan status pembayaran/renewal.
- **Entitlement**: hak terverifikasi untuk masuk ke modul LMS dan/atau Database hingga masa berlaku.
- **Database pelanggan**: katalog privat bahan CAD/engineering dengan metadata, pencarian, preview dan unduhan terbatas pada hak paket.
- **LMS**: katalog kursus privat dengan modul/lesson, materi, pemutar video, dan progres belajar.

| Peran | Kebutuhan | Izin |
|---|---|---|
| Pengunjung | Memahami layanan, melihat karya, konsultasi | Baca Published; kirim Pesan; tidak baca draft atau Pesan |
| Pelanggan | Membeli paket dan menggunakan LMS/Database | Login pelanggan; akses hanya modul ber-entitlement aktif; tidak dapat membuka admin |
| Admin | Mengelola informasi dan tindak lanjut | Login; CRUD Konten/Portofolio/Media; baca/ubah status/hapus Pesan |

## 4. Tujuan dan metrik

Semua angka adalah **target awal usulan**, bukan hasil aktual. Baseline belum tersedia.

| ID | Tujuan | Target dan pengukuran |
|---|---|---|
| G-01 | Informasi mudah ditemukan | 4 dari 5 peserta menemukan layanan dan detail karya dalam ≤2 menit; uji sebelum rilis |
| G-02 | Admin mandiri | Edit layanan dan publish karya dalam ≤5 menit tanpa pengembang; uji sebelum rilis |
| G-03 | Konsultasi tercatat | 100% respons sukses uji memiliki tepat satu Pesan; retry tidak menggandakan; integrasi/E2E |
| G-04 | Aman dan mudah dioperasikan | Seluruh pemeriksaan akses, privasi, aksesibilitas, performa, dan restore kritis lulus; gate rilis dan 30 hari pertama |
| G-05 | Menjual akses digital berbayar | Paket bulanan/tahunan dapat dibeli, callback diverifikasi satu kali, dan pelanggan aktif dapat masuk ke modul sesuai entitlement; uji staging sebelum rilis |

Target jumlah leads/pendapatan menunggu baseline. MVP tidak memasang pelacakan iklan; gunakan uji pengguna dan metrik teknis.

## 5. Scope dan strategi rilis

**MVP company profile:** beranda, tentang, layanan/detail, portofolio/filter/detail, proses, FAQ, kontak, privasi; login admin; editor; preview privat; publish/unpublish; unggah gambar; kotak masuk; pengaturan; SEO; backup dan runbook.

**Fase layanan berlangganan (tambahan scope, belum siap rilis):** enam varian harga dari tiga paket (Database/Basic, LMS, Gabungan) × dua periode (bulanan/tahunan); akun pelanggan; recurring auto-charge via Xendit; dashboard akun; LMS dan Database baru dengan hak akses per paket. Pengguna meminta rekomendasi harga dan telah menerima usulan awal yang ditampilkan di `/paket`: Database Rp39.000/bulan atau Rp390.000/tahun; LMS Rp129.000/bulan atau Rp1.290.000/tahun; Gabungan Rp159.000/bulan atau Rp1.590.000/tahun. Angka ini perlu persetujuan sebelum konfigurasi harga/checkout aktif. Default perencanaan LMS: katalog course→module→lesson, materi dan progres; Database: katalog teknik mesin dengan metadata, search/filter, preview, tools, dan unduhan jika berlisensi. Sistem dibangun sebagai aplikasi modular dan nantinya dipetakan ke subdomain produksi; domain/session bersama perlu konfigurasi aman. Harga final, isi produk, domain dan kuota belum final.

**Non-goals MVP company profile:** pemesanan, pembayaran, unggah CAD/PDF, CRM, multi bahasa, artikel, peran editor, analytics bisnis, dan email otomatis. Fitur akun/pembayaran hanya masuk pada fase layanan berlangganan tersendiri. Form menyimpan Pesan ke kotak masuk Admin. Link WhatsApp/email hanya tersedia jika kontak resmi diberikan; tidak mengklaim mengirim pesan ke kanal tersebut.

Dependensi: runtime aplikasi, PostgreSQL, penyimpanan media, domain/HTTPS, jadwal backup/purge. Penyedia dan biaya belum dipilih.

## 6. Alur pengguna

| ID | Peran | Alur | Alternatif/error |
|---|---|---|---|
| US-01 | Pengunjung | Beranda → layanan → detail → kontak | Empty state; slug tidak ada 404 |
| US-02 | Pengunjung | Portofolio → filter → detail → kontak | Tanpa hasil; label Konsep; Draft/Archived 404 |
| US-03 | Pengunjung | Isi brief → persetujuan → kirim → referensi | Validasi inline, limit, gagal simpan, retry aman |
| US-04 | Admin | Login → edit draft → preview → publish | Login salah, sesi habis, konflik edit, gagal simpan |
| US-05 | Admin | Buat karya → upload → publish/unpublish | Berkas ditolak; upload gagal; media privat |
| US-06 | Admin | Kotak masuk → detail → ubah status → hapus | Status invalid, data hilang, akses ditolak |
| US-07 | Calon pelanggan | Pilih paket bulanan/tahunan → buat akun → bayar → lihat hasil | Pembayaran pending/gagal, webhook terlambat/duplikat |
| US-08 | Pelanggan aktif | Login → buka LMS atau Database → kembali ke akun | Langganan habis/dibatalkan, subdomain gagal, token kedaluwarsa |
| US-09 | Admin/operator | Lihat pelanggan dan status langganan → bantu masalah akses | Provider tidak tersedia, status berbeda antara webhook dan sistem |

## 7. Requirement fungsional

| ID | Kebutuhan | Prioritas | Tujuan | Penerimaan |
|---|---|---|---|---|
| FR-01 | Sajikan profil, layanan, proses, FAQ, kontak dari konten Published | Must | G-01 | AC-01 |
| FR-02 | Daftar/filter/detail karya membedakan PROJECT dan CONCEPT | Must | G-01 | AC-02 |
| FR-03 | Form memvalidasi dan menyimpan satu Pesan sebelum sukses | Must | G-03 | AC-03 |
| FR-04 | Hanya Admin aktif dapat masuk dan menjalankan operasi admin; logout mencabut sesi | Must | G-04 | AC-04 |
| FR-05 | Admin mengedit, mengurutkan, preview dan publish Konten | Must | G-02 | AC-05 |
| FR-06 | Admin membuat, mengedit, publish, arsip Portofolio dan mengelola gambar | Must | G-02 | AC-06 |
| FR-07 | Admin membaca, memfilter, mengubah status, menghapus Pesan | Must | G-03 | AC-07 |
| FR-08 | Metadata, sitemap, status HTTP benar; admin/draft tidak diindeks | Must | G-01 | AC-08 |
| FR-09 | Admin mengatur identitas, CTA, kontak, SEO default tanpa menyimpan rahasia layanan | Must | G-02 | AC-09 |
| FR-10 | Calon pelanggan dapat melihat paket, masa berlaku, harga, hak akses dan aturan renewal sebelum checkout | Must (fase langganan) | G-05 | AC-10 |
| FR-11 | Pelanggan dapat membuat akun dan memulai checkout untuk paket bulanan atau tahunan; harga/produk berasal dari konfigurasi tervalidasi server | Must (fase langganan) | G-05 | AC-11 |
| FR-12 | Status pembayaran hanya berubah dari callback provider terverifikasi atau rekonsiliasi operator; event duplikat tidak menggandakan akses | Must (fase langganan) | G-05 | AC-12 |
| FR-13 | Akses LMS dan Database hanya diberikan untuk pelanggan dengan langganan aktif dan hak paket yang sesuai | Must (fase langganan) | G-05 | AC-13 |
| FR-14 | Pelanggan dapat melihat status, masa aktif, riwayat tagihan, memperbarui metode pembayaran, dan membatalkan auto-renew | Must (fase langganan) | G-05 | AC-14 |
| FR-15 | Admin/operator dapat mencari akun dan status langganan serta mencatat perubahan manual dengan alasan/audit | Should (fase langganan) | G-05 | AC-15 |
| FR-16 | Pelanggan paket LMS/Gabungan dapat membuka lesson dan melanjutkan progres terakhir; paket lain ditolak | Must (fase langganan) | G-05 | AC-16 |
| FR-17 | Pelanggan paket Database/Gabungan dapat menelusuri katalog dan mengunduh bahan sesuai haknya; direct URL tanpa entitlement ditolak | Must (fase langganan) | G-05 | AC-17 |
| FR-18 | Admin dapat membuat/mengubah/menerbitkan course/lesson dan item katalog Database tanpa mengubah kode | Must (fase langganan) | G-02/G-05 | AC-18 |
| FR-19 | Beranda menampilkan Autodesk License dan jasa Engineering Design CAD, dengan CTA WhatsApp berpesan sesuai kebutuhan bila nomor resmi tersedia | Must | G-01 | AC-19 |

## 8. Kriteria penerimaan

### AC-01 — Website publik

Given Konten Published, When halaman dibuka, Then informasi sesuai konten aktif, menu mobile berfungsi dan CTA ke `/kontak`. Kontak kosong tidak menghasilkan tautan palsu. Konten kosong memakai penjelasan netral; tidak ada informasi bisnis fiktif.

### AC-02 — Portofolio

Given dua Published dan satu Draft, When daftar/filter/detail dibuka, Then hanya Published terlihat, filter kategori bekerja, dan CONCEPT berlabel Konsep di kartu/detail. Slug Draft/Archived menghasilkan 404 di halaman maupun API.

### AC-03 — Kontak

Given nama/email/brief/persetujuan valid, When dikirim, Then Pesan NEW tersimpan lalu kode referensi muncul. Retry dengan kunci/payload sama tidak membuat duplikasi; kunci sama/payload berbeda 409. Invalid 422, limit 429, gagal simpan 503 tanpa sukses palsu. Isian tetap tersedia untuk retry.

### AC-04 — Admin

Given anonim/non-admin, When membuka halaman/API/media admin, Then data tidak dapat dibaca/diubah. Login salah menggunakan pesan generik. Setelah logout/sesi dicabut, request berikutnya ditolak. Registrasi publik dimatikan; Admin pertama dibuat melalui langkah operator aman.

### AC-05 — Konten

Given Admin login, When menyimpan Draft, Then edit tersimpan tanpa mengubah publik. Setelah Publish sukses, publik berubah dalam ≤60 detik. Input invalid/slug duplikat ditolak. Penyimpanan versi lama menghasilkan konflik, bukan menimpa edit lain. Preview tetap privat.

### AC-06 — Portofolio dan Media

Given Admin login, When upload valid, Then preview privat tersedia. Publish memerlukan judul, slug unik, kategori, deskripsi, jenis karya, minimal satu gambar dan alt text; PROJECT memerlukan konfirmasi izin publikasi. Unpublish menutup detail/API/media untuk anonim dalam ≤60 detik; tidak menjanjikan penarikan salinan yang telah diunduh pihak lain.

### AC-07 — Kotak masuk

Given Pesan tersimpan, When Admin melihat detail/filter, Then data sesuai form. Transisi NEW → IN_PROGRESS → CLOSED dan CLOSED → IN_PROGRESS dicatat tanpa mengubah brief. Hapus permanen memerlukan konfirmasi UI dan menghapus PII dari database aktif; tidak ada ekspor massal MVP.

### AC-08 — SEO

Given halaman Published, When dirender, Then title, description, canonical, Open Graph tersedia dan sitemap memuat URL publik saja. Slug tidak ada 404. Admin/preview/API diberi noindex sesuai tipe respons; autentikasi tetap wajib. Structured data tidak berisi klaim tak terverifikasi.

### AC-09 — Pengaturan

Given pengaturan valid tersimpan, When website dibuka, Then identitas/CTA sesuai. WhatsApp/email kosong disembunyikan; URL eksternal hanya skema aman. Password/token/API key tidak disimpan melalui editor konten.

### AC-19 — Autodesk License dan Engineering Design CAD

Given halaman utama dibuka, When pengunjung mencapai bagian lisensi dan desain, Then kedua penawaran tampil dengan pesan konsultasi yang sesuai. Jika nomor WhatsApp resmi tersedia, tombol membuka chat `wa.me` dengan teks awal yang relevan; jika kosong, tombol membuka `/kontak` dan menjelaskan nomor WA belum diatur. Materi tidak menyebut MasterCAD sebagai reseller/partner resmi Autodesk kecuali status tersebut sudah dikonfirmasi pemilik.

### AC-10 — Paket

Given tiga paket telah dikonfigurasi dan dipublikasikan, When calon pelanggan membuka halaman paket, Then dapat membandingkan Database, LMS dan Gabungan pada periode bulanan/tahunan, melihat enam harga total yang diatur pemilik, hak akses, auto-renew/cancel, dan pajak/biaya sebelum checkout. Nilai harga dari browser tidak dipercaya server.

### AC-11 — Checkout

Given calon pelanggan memilih paket bulanan atau tahunan, When checkout dimulai, Then akun dan transaksi terkait tercatat sebagai pending dan diarahkan ke checkout provider resmi. Kegagalan/penutupan checkout tidak memberikan akses; callback provider menjadi sumber konfirmasi, bukan halaman redirect browser.

### AC-12 — Pembayaran dan idempotensi

Given callback pembayaran diterima, When signature, merchant/order reference, nominal, mata uang, status dan replay diperiksa, Then hanya pembayaran valid dapat mengaktifkan/menambah masa langganan satu kali. Event duplikat aman; event invalid tidak mengubah status; status ambigu masuk rekonsiliasi.

### AC-13 — Akses modul

Given akun memiliki langganan aktif dan hak modul, When membuka link LMS/Database, Then sesi/token berumur pendek membawa identitas dan hak minimal ke sistem tujuan. Tanpa hak, setelah masa aktif, token kedaluwarsa, atau kegagalan verifikasi, sistem tujuan menolak akses. URL subdomain langsung tidak boleh melewati pemeriksaan entitlement.

### AC-14 — Akun dan renewal

Given pelanggan login, When membuka halaman akun, Then status, paket, tanggal mulai/akhir, metode pembayaran tersimpan via token provider, siklus charge berikutnya dan tindakan update/cancel auto-renew tampil. Gagal charge memberi status/grace period dan instruksi pemulihan; akses mengikuti grace policy yang diinformasikan sebelum checkout. Sistem tidak menyimpan PAN/CVV.

### AC-15 — Operasi langganan

Given operator terotorisasi, When mencari pelanggan atau merekonsiliasi status, Then perubahan manual memerlukan alasan, tercatat tanpa data kartu rahasia, dan tercermin konsisten pada akses modul.

### AC-16 — LMS

Given pelanggan memiliki entitlement LMS aktif, When membuka course/lesson, Then hanya materi Published tampil, video/materi dimuat melalui endpoint berizin, dan progres tersimpan serta dapat dilanjutkan. Paket Database saja, expiry atau akses anonim ditolak pada halaman dan API.

### AC-17 — Database pelanggan

Given pelanggan memiliki entitlement Database aktif, When mencari/filter item atau mengunduh file, Then metadata Published cocok dengan filter dan file diberikan setelah pengecekan sesi, paket, expiry dan rate/kuota. URL direct/object storage tidak dapat dipakai anonim atau oleh paket LMS saja.

### AC-18 — Pengelolaan konten produk

Given Admin login, When mengedit draft course/lesson/item Database dan memublikasikannya, Then konten baru muncul pada modul pelanggan tanpa deployment kode. Draft/media privat tetap tertutup. Tanpa konten nyata, pelanggan melihat empty state jujur tanpa bahan demo yang tampak sebagai produk asli.

## 9. Requirement nonfungsional

Seluruh target berikut merupakan asumsi perencanaan, diverifikasi sebelum rilis.

| ID | Atribut | Target/kondisi | Verifikasi |
|---|---|---|---|
| NFR-01 | Keamanan | Server memeriksa Admin aktif pada setiap operasi admin; tanpa secrets di bundle/log; proteksi origin, upload, injection, rate limit | Tes akses negatif, CSRF, validasi file, scan secrets |
| NFR-02 | Privasi | Nama/email/brief wajib; telepon/perusahaan/layanan opsional; catat persetujuan dan versi pemberitahuan; purge Pesan setelah 180 hari | Tes purge, minimisasi, redaction, restore dengan daftar penghapusan |
| NFR-03 | Aksesibilitas | Sasaran WCAG 2.2 AA alur utama; keyboard/focus/label/error announcement; nol serious/critical pada pemindai | Audit otomatis + keyboard/kontras manual |
| NFR-04 | Performa | LCP ≤2,5 detik, CLS ≤0,1 pada profil mobile tercatat; p95 API kontak ≤2 detik pada 10 req/detik selama 5 menit selain request yang ditolak limit | Lab Lighthouse/load test staging; INP ≤200 ms ketika data lapangan cukup |
| NFR-05 | Keandalan | Tanpa sukses palsu/duplikasi; outage DB terkontrol; target uptime 99,5%/30 hari, RPO ≤24 jam, RTO ≤4 jam | Failure injection, monitor, restore DB+media |
| NFR-06 | Operasi | Request ID; log tanpa brief/email/telepon/password; alarm 5xx >5% selama 5 menit atau backup gagal | Tes log, health, alarm |
| NFR-07 | Pemeliharaan | Lockfile; migrasi tercatat; lint/typecheck/build dan tes kritis gate CI | CI bersih; migrasi DB baru |
| NFR-08 | Kompatibilitas | Dua rilis stabil terbaru Chrome/Edge/Firefox/Safari saat rilis; tanpa overflow 360–1440 px | Matriks browser, desktop/mobile |
| NFR-09 | Keamanan pembayaran | Verifikasi signature callback, replay protection, idempotency, harga dari server, tanpa menyimpan PAN/CVV atau secret provider di browser | Uji kontrak sandbox, replay, nominal mismatch, secret scan |
| NFR-10 | Keandalan entitlement | Pembayaran terkonfirmasi tidak hilang; perubahan hak akses diterapkan ≤5 menit setelah status authoritative; kegagalan tujuan tidak membocorkan token/sesi | Webhook retry/reconcile, probe grant/revoke, audit |
| NFR-11 | Privasi pelanggan | Data akun/transaksi minimum; token LMS berumur pendek dan scope terbatas; retensi invoice/transaksi ditetapkan menurut kewajiban wilayah sebelum rilis | Review skema, token, kebijakan dan purge |
| NFR-12 | Keamanan konten belajar | Video, materi course dan file Database hanya diakses lewat pemeriksaan entitlement; file storage tidak publik dan URL download berumur pendek | Direct URL/anonymous/module cross-access, revoke dan expiry checks |

## 10. Data dan privasi

- Publikasi hanya konten disetujui pemilik. Draft/media asli privat. PROJECT memerlukan izin publikasi; CONCEPT berlabel.
- Pesan adalah data pribadi untuk menjawab konsultasi. Form tidak meminta identitas sensitif atau desain rahasia. Persetujuan terpisah dari marketing.
- Halaman privasi menjelaskan tujuan, kontak penghapusan, penyedia, dan retensi. Pemilik meninjau teks sebelum rilis; dokumen tidak menyatakan kepatuhan hukum otomatis.
- Retensi usulan: Pesan 180 hari sejak dibuat, log 14 hari, audit admin 90 hari, backup terenkripsi 30 hari. Permintaan penghapusan sah ditangani lebih awal. Audit tidak menyalin brief.
- Daftar ID penghapusan tanpa PII bertahan sampai backup yang relevan kedaluwarsa; restore mengulang penghapusan sebelum trafik dibuka. Media tanpa referensi dibersihkan setelah 7 hari; media terpakai tidak dapat dihapus.
- Backup mencakup data dan media. Export kontak massal, marketing otomatis, pelacakan iklan berada di luar MVP.

## 11. Risiko

| ID | Risiko | Peluang 1–5 | Dampak 1–5 | Skor | Mitigasi / penanggung jawab / pemicu |
|---|---|---:|---:|---:|---|
| RISK-01 | Konten/izin karya belum lengkap | 4 | 4 | 16 | Pemilik menyiapkan data sebelum publish; konsep dilabeli |
| RISK-02 | Hosting statis tidak menjalankan backend | 4 | 4 | 16 | Pengembang spike runtime/DB/scheduler/media pada M0 |
| RISK-03 | Spam form/login | 4 | 4 | 16 | Pengembang: limit terpusat, honeypot, validasi; operator pantau penolakan |
| RISK-04 | PII/draft bocor | 3 | 5 | 15 | Pengembang: akses server, privat/no-store, redaction, uji anonim sebelum M1/M2 |
| RISK-05 | Data atau media hilang | 2 | 5 | 10 | Operator membuktikan backup/restore sebelum rilis |
| RISK-06 | Scope melebar | 3 | 3 | 9 | Pemilik taruh portal/pembayaran di fase lanjut; revisi PRD dahulu |
| RISK-07 | Callback palsu atau replay mengaktifkan langganan | 3 | 5 | 15 | Pengembang verifikasi tanda tangan/status/nominal dan idempotency; uji sandbox sebelum akses pelanggan dibuka |
| RISK-08 | Aplikasi LMS/Database tidak mendukung integrasi entitlement/SSO | 4 | 5 | 20 | Pemilik memastikan pemilik sistem, domain, API/OIDC/SAML dan environment uji sebelum memilih pola integrasi; rilis diblokir bila akses langsung tidak dapat ditutup |
| RISK-09 | Auto-renewal, refund, atau pajak tidak sesuai aturan pelanggan | 3 | 4 | 12 | Pemilik menentukan negara/entitas jual, kebijakan pembatalan/refund, biaya/pajak dan teks persetujuan sebelum checkout live |

## 12. Keputusan terbuka

| Keputusan | Asumsi kerja | Pemilik | Tenggat | Status |
|---|---|---|---|---|
| Kontak, layanan, foto, izin | Draft privat; publik hanya fakta terverifikasi | Pemilik MasterCAD | Sebelum M2 publish final | Belum tersedia |
| Domain/biaya/region/runtime | Uji jalur Sites yang ada; backend/storage setelah spike | Pemilik + pengembang | M0 sebelum deployment | Belum diverifikasi |
| Admin pertama | Email Admin; pemulihan melalui operator | Pemilik + operator | M1 sebelum login nyata | Belum diberikan |
| Retensi/privasi | Usulan §10 | Pemilik | M3 sebelum rilis | Proposed |
| Versi stack | Rilis stabil didukung; lockfile setelah spike | Pengembang | M0 | Proposed di Design.md |
| Produk pelanggan | LMS & Database dibangun baru; konten/kebutuhan produk dan URL subdomain belum diberikan | Pemilik MasterCAD | Sebelum TASK-014 | Arah disepakati; rincian terbuka |
| CTA WhatsApp | Tombol WA langsung mengikuti nomor yang dikelola Admin; nomor resmi belum diisi | Pemilik MasterCAD | Sebelum publish landing page | Implementasi menampilkan formulir kontak sebagai fallback |
| Kebijakan paket | Tiga paket Database/Basic, LMS, Gabungan serta periode bulanan/tahunan disepakati; usulan enam harga tercantum di §2; fitur tepat, pajak/biaya dan persetujuan harga tetap diperlukan | Pemilik MasterCAD | Sebelum TASK-014 | Struktur dan gateway Xendit dipilih; harga masih rekomendasi |
| Auto-renew | Auto-charge diminta; grace, retry, cancel, refund | Pemilik MasterCAD | Sebelum TASK-015 | Auto-renew disepakati; ketentuan terbuka |
| Gateway dan SSO | Xendit recurring dipilih; negara settlement, akun merchant/kanal aktif, domain produksi dan nama subdomain tetap perlu ditetapkan | Pemilik + pengembang | Sebelum TASK-015 | Provider dipilih; onboarding/domain terbuka |

Tidak menghalangi penyusunan dokumen atau pengembangan lokal dengan data contoh yang dilabeli.

## 13. Traceability dan gate rilis

| Tujuan | Alur | Requirement | Ukuran keberhasilan |
|---|---|---|---|
| G-01 | US-01, US-02 | FR-01, FR-02, FR-08, NFR-03, NFR-04, NFR-08 | Navigasi, karya, SEO, performa, aksesibilitas/browser |
| G-02 | US-04, US-05 | FR-04, FR-05, FR-06, FR-09, NFR-07 | Admin mandiri dan CI |
| G-03 | US-03, US-06 | FR-03, FR-07, NFR-02, NFR-05 | Form → simpan → kotak masuk, retry/purge |
| G-04 | US-03, US-04, US-05, US-06 | NFR-01, NFR-02, NFR-05, NFR-06 | Akses, log, restore, monitor |
| G-05 | US-07, US-08, US-09 | FR-10–FR-15, NFR-01, NFR-05, NFR-06, NFR-09–NFR-11 | Checkout sandbox, status idempotent, grant/revoke akses dua modul, rekonsiliasi |

Gate rilis: seluruh Must dan NFR kritis mempunyai bukti di [Implementation.md](Implementation.md), pemilik meninjau konten/privasi, dan alur kontak/admin berjalan di staging. Website tidak dinyatakan selesai sebelum penyimpanan persisten dan alur nyata diuji.

## 14. Riwayat

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 2026-10-05 | Website statis; salinan historis dalam archive/ |
| 0.2 | 2026-10-05 | Draft full stack sesuai lingkup pengguna; kebutuhan, penerimaan, siklus data |
| 0.4 | 2026-10-13 | Menambahkan fase paket bulanan/tahunan, pembayaran dan entitlement subdomain LMS/Database; open decisions mempertahankan status Draft |
