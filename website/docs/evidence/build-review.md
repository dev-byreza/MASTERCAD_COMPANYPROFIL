# Bukti build lokal — 5 Oktober 2026

MVP MasterCAD telah dibangun di workspace Windows dan dicoba pada `http://127.0.0.1:3000`. Ini bukti lokal; tidak menyatakan aplikasi sudah di-deploy atau semua gate produksi terpenuhi.

## Implementasi

Next.js 16.3.8, React 19.3.0, TypeScript 7.0.2, Better Auth 1.7.7, Node 26.5.0. Dependensi dipin dan lockfile tersedia. Setup membuat schema auth, schema domain, seed layanan/FAQ/proses dan satu studi konsep. SQLite memakai WAL, query terparameterisasi dan transaksi. Media upload berada di luar public.

Tersedia halaman publik, layanan/detail, portofolio/filter/detail, profil, kontak/privasi, sitemap/robots; admin login/logout, konten/settings, draft/publish/unpublish/archive, preview privat, media upload/seleksi, inbox/filter/status/hapus. Angka dashboard dibaca dari DB. Kontak resmi kosong dan karya contoh diberi label konsep.

## Hasil aktual

| Pemeriksaan | Hasil | Batas |
|---|---|---|
| `npm run check` | Lulus | TypeScript, bukan audit runtime menyeluruh |
| `npm run test` | 10/10 lulus | Database sementara terisolasi; bukan PostgreSQL/staging |
| HTTP smoke | 20/20 lulus; [JSON](http-smoke.json) | Dev server lokal; membuat item QA lalu arsip |
| SEO smoke | 7/7 lulus; [JSON](seo-smoke.json) | Home title/canonical, admin noindex, sitemap Published/excludes admin dan QA Archived |
| `npm run build` | Exit 0; seluruh route dikompilasi | Build lokal; tidak menguji hosting/HTTPS |
| `21st review website/src --json` | 54 file, 0 error, 0 warning, 63 saran info | Semua `design-hardcoded-color`, termasuk deklarasi token; bukan audit aksesibilitas lengkap |
| Browser desktop | Beranda, kontak, login, dashboard, editor dan simpan draft berhasil dicoba | Codex in-app browser; belum matriks dua rilis browser |
| Mobile 360×800 | Beranda/menu/kontak dapat digunakan, tanpa overflow horizontal | Pemeriksaan DOM dan visual, bukan seluruh alur admin mobile |
| Kontak → inbox | Submit data sintetis tersimpan dan muncul di inbox; reference tampil setelah commit | Tidak ada email otomatis; bukan pesan pelanggan |
| Logout browser | Berpindah ke `/admin/login` | Guard/logout juga diuji backend/HTTP |
| Backup → restore-check | AES-GCM bundle DB + 1 media; checksum dan `integrity_check=ok` | Restore ke folder baru, DB aktif tidak diganti; RPO/RTO belum diukur |

Sepuluh tes backend menguji invalid consent/brief, retry idempotent/payload conflict, rate limit, draft snapshot/stale version, izin Project/media setelah unpublish, transisi status pesan/konflik, origin palsu, penghapusan PII dan ledger ID saja, signup/anonim, serta Admin aktif/nonaktif/logout.

HTTP smoke menguji route publik dan health, akses admin anonim, origin mutasi salah, login/inbox, upload valid, draft media privat, publish karya dan media, archive menutup kedua jalur, file palsu dan logout. Hasil [21st](21st-review.json) tersimpan tanpa credential atau source payload.

## Visual

Skill `21st-ui-build` dan `21st-cli-use` dipakai untuk pencarian serta pengambilan [Portfolio Showcase Grid](https://21st.dev/@uiable/components/block-portfolio-9). Komposisi 7/5 diadaptasi menjadi React dalam `portfolio-grid.tsx` dengan token/brand MasterCAD. CLI melaporkan AI generation tidak tersedia, sehingga hosted generation tidak dipanggil. Referensi source ada di `.21st/portfolio-reference.json` pada root workspace.

Screenshot akhir: [Desktop](home-desktop.jpg), [Mobile](home-mobile.jpg), [Admin](admin-desktop.jpg). Hero WebP sekitar 227 KB, logo asli, warna putih/charcoal/amber, layanan berupa baris editorial, proses berlatar gelap dan CTA amber.

## Keterbatasan yang terbuka

Belum ada kontak/proyek resmi, domain, Admin produksi, provider backend, PostgreSQL, scheduler, CI, alarm atau salinan backup off-host. Limiter kontak memakai bucket network lokal bersama; perlu adapter proxy tepercaya sebelum publik. Tabel kategori terpisah, cursor keyset, multi-instance DB/storage, dan original/variant media belum diterapkan.

Axe, Lighthouse/load test, simulasi outage menyeluruh, target RPO/RTO, uptime 30 hari dan UAT pemilik belum dijalankan. Metadata tersedia tetapi social image khusus belum dibuat. Penghapusan retensi pada DB aktif tidak dijalankan; perintah purge default dry-run. Konten seed hanya untuk preview lokal dan perlu peninjauan sebelum publikasi website.

Auto-review awal menolak audit 21st karena dugaan ekspor source. Source CLI diperiksa dan menunjukkan scan lokal dengan telemetry command/count saja; audit kemudian diizinkan. Auto-review juga menolak purge aktif yang tidak diminta pengguna; pekerjaan diteruskan dengan backup/restore terisolasi dan mengubah default purge menjadi dry-run.
