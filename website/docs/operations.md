# Operasi MasterCAD lokal

Implementasi ini berjalan sebagai satu proses Next.js dengan SQLite WAL dan filesystem privat. Belum ada scheduler, CI, alarm, server staging atau deployment produksi.

## Environment dan akses

`.env.example` menjelaskan konfigurasi minimum. `APP_URL` wajib cocok dengan origin aplikasi; gunakan HTTPS pada produksi. `DATABASE_PATH` menunjuk database lokal. `BETTER_AUTH_SECRET` diperlukan untuk sesi dan HMAC limiter/idempotency; jangan dipublikasikan. `BACKUP_SECRET`, bila diatur, digunakan untuk backup; tanpa itu backup lokal memakai secret auth.

Akun produksi dibuat operator melalui `npm run admin:create` dengan `ADMIN_EMAIL` dan `ADMIN_PASSWORD` di environment proses. Tidak ada signup publik, password default atau reset lewat UI. Hapus environment password setelah bootstrap. Akun `--local` tidak boleh digunakan produksi.

Untuk akun terkunci/hilang: operator terpercaya membuat akun pengganti dengan skrip bootstrap; nonaktifkan `admin_profiles.active` akun lama dan cabut session terkait melalui operasi DB yang ditinjau. Jangan mengubah password langsung di tabel. Guard memeriksa AdminProfile aktif setiap akses privat; logout mencabut sesi melalui Better Auth.

## Backup dan pemeriksaan restore

```powershell
npm run backup
```

Backup menggunakan snapshot SQLite, mengambil media yang ada pada snapshot, menambahkan checksum SHA-256 dan mengenkripsi bundle AES-256-GCM. Output `.data/backups/*.mcbackup` memiliki retensi lokal 30 hari. Simpan kunci yang dipakai saat backup di lokasi aman terpisah; rotasi auth secret tanpa menyimpan kunci lama dapat membuat backup lama tidak bisa dibuka. Untuk produksi gunakan kunci backup terpisah, salinan off-host dan jadwal harian.

```powershell
$backupFile = Get-ChildItem -LiteralPath '.data/backups' -Filter '*.mcbackup' |
  Sort-Object LastWriteTime -Descending | Select-Object -First 1
& '.\node_modules\.bin\tsx.cmd' scripts/maintenance.ts restore-check $backupFile.FullName
```

`restore-check` selalu membuat folder baru di `.data/restore-check/`, memverifikasi dekripsi/checksum, memulihkan DB dan media, menerapkan ledger penghapusan aktif, lalu menjalankan `PRAGMA integrity_check`. Perintah tidak mengganti database aktif. Restore operasional ke server belum diotomasi atau diuji; target RPO/RTO PRD belum terbukti.

Ledger `.data/deletion-ledger.json` hanya berisi ID pesan dan waktu penghapusan selama 31 hari. Cadangkan terpisah dari snapshot lama dan replay sebelum membuka trafik restore agar pesan yang dihapus tidak muncul kembali. Perlindungan off-host ledger belum dikonfigurasi.

## Retensi

```powershell
npm run purge
```

Default adalah **dry-run**: hanya menghitung pesan lewat 180 hari, tanpa menghapus data. `--apply` adalah operasi operator yang perlu persetujuan retensi dan backup terverifikasi sebelum dijalankan. Implementasi apply juga membersihkan idempotency/rate limit kedaluwarsa, audit lebih dari 90 hari, ledger DB lebih dari 31 hari serta media orphan lebih dari tujuh hari. Apply tidak dijalankan pada database aktif dalam sesi ini; jadwal otomatis belum ada.

## Health dan kegagalan

`/health/live` mengecek proses; `/health/ready` mengecek akses DB dengan respons sederhana tanpa detail koneksi. Readiness lokal belum memakai token operator. Kontak/admin mengembalikan error 503 generik untuk kegagalan tak terduga; simpan request ID untuk diagnosis. Logger aplikasi tidak menulis isi pesan, password atau token. Log akses Next.js tetap perlu dikelola retensinya oleh runtime produksi.

Jika gambar tidak tampil, periksa referensi Published dan keberadaan media privat; Draft/Archived sengaja menghasilkan 404 bagi anonim. Jika publish ditolak, periksa judul/slug, kelengkapan portofolio, izin Project, gambar dan alt text. Konflik versi 409 membutuhkan reload, bukan overwrite otomatis.

## Persiapan produksi yang tersisa

- Pilih runtime Node persisten satu instance atau migrasikan repository/auth ke PostgreSQL dan storage media privat. Jalur maintenance saat ini mengasumsikan `.data/media` dan `.data/backups` lokal.
- Ganti bucket `local-network` pada handler kontak dengan identitas network dari proxy tepercaya; jangan langsung percaya header klien. Preview lokal saat ini menggunakan limit bersama yang konservatif.
- Lengkapi CI, scheduler retensi/backup, off-host backup/ledger, health token dan alarm. Uji outage DB/storage, rollback dan restore operasional.
- Jalankan axe/keyboard/browser matrix, Lighthouse dan load test terhadap environment staging.
- Isi kontak, domain dan proyek resmi; tinjau notice privasi/retensi dan akun Admin produksi. `.openai/hosting.json` statis tidak boleh digunakan untuk mempublikasikan `.data` atau env.
