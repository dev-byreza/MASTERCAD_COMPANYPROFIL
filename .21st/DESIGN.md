# MasterCAD design context

Keputusan 5 Oktober 2026. Aplikasi company profile + admin konten, portofolio dan inbox konsultasi. Implementasi Next.js App Router, React, TypeScript dan CSS variables. Konteks terstruktur ada di `design.json`.

## Arah visual

Revisi pengguna 5 Oktober 2026: landing page modern dengan amber utama `#FFBF00` dominan pada hero, layanan, proses dan CTA. Studio, portofolio, FAQ dan footer charcoal. Hero dua kolom memadukan headline/CTA dan gambar dengan caption panel; media radius 16 px, kontrol 6 px. Arah ini menggantikan beranda awal yang dominan putih. Halaman sekunder/admin masih memakai surface terang; footer publik kini charcoal. Logo/aset asli dan label Ilustrasi/Studi Konsep dipertahankan.

Referensi 21st: [Portfolio Showcase Grid — uiable](https://21st.dev/@uiable/components/block-portfolio-9), ID 29523. Source diambil lewat CLI; komposisi 7/5 diadaptasi ke `website/src/components/portfolio-grid.tsx`. Bukan instalasi template penuh. Hosted 21st AI tidak dipakai karena usage melaporkan generation tidak tersedia.

Referensi hero revisi: [Split Hero With Image Cards](https://21st.dev/@felipemenezes098/components/hero-08), ID 19078. Hierarki copy/media dan caption image diadaptasi ke halaman yang sudah ada; font, animasi, avatar dan social proof contoh tidak diimpor. Pencarian dilakukan dengan query umum tanpa ekspor konteks proyek.

## Token dan primitive

`website/src/app/globals.css`: brand `#FFBF00`, ink `#17191C`, muted `#5C6168`, surface putih, canvas `#F4F5F6`, line `#D9DDE0`, accent `#765600`, radius 4 px. Container maksimum 1280 px, gutter responsif, body 16 px, system sans. Input memakai border lebih gelap; fokus terlihat. Tidak ada font eksternal.

Reuse `SiteHeader`, `SiteFooter`, `PageIntro`, `ConsultationForm`, `PortfolioGrid`, `RecordEditor`, `MediaPicker` dan admin shell. Layanan berbentuk daftar; FAQ memakai native details/summary. Admin memakai tabel, badge teks, form terstruktur dan state loading/error/empty.

## Batas

Pertahankan semantik, skip link, keyboard/focus, target sentuh, alt text dan reduced motion. Hindari gradien dekoratif, glass, carousel otomatis, animasi berlebihan, kartu berulang dan klaim usaha tanpa data. Data draft/media harus tetap privat; seluruh angka admin berasal dari DB.

Audit build awal: 54 file, 0 error, 0 warning; 63 saran info warna CSS, tersimpan di `website/docs/evidence/21st-review.json`. Audit revisi amber: 4 file, 0 error, 0 warning, 7 saran info pada deklarasi token `landing.css`, tersimpan di `website/docs/evidence/21st-amber-review.json`. Preview desktop/mobile 360 px, navigasi dan FAQ diperiksa; audit aksesibilitas/performa lengkap masih terbuka.
