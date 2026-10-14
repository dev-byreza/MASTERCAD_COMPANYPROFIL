# Revisi landing page amber — 5 Oktober 2026

Permintaan: landing page modern dengan warna utama MasterCAD lebih dominan karena beranda awal mayoritas putih.

Implementasi: hero/header amber `#FFBF00`, copy/media dua kolom, CTA charcoal, caption gambar dalam panel; layanan/proses/CTA amber; studio/portfolio/FAQ/footer charcoal. Tema landing terisolasi melalui `.landing-page` dan `landing.css`; header beranda memakai class berdasarkan route, footer publik charcoal. Konten Published tetap dibaca dari repository yang sama.

Referensi [21st Split Hero With Image Cards, ID 19078](https://21st.dev/@felipemenezes098/components/hero-08) dicari dan diambil melalui CLI. Hierarki diadaptasi, tanpa mengambil font/animasi/social proof atau memasang dependensi baru. Grid portofolio adaptasi 29523 tetap digunakan.

Typecheck lulus. Build produksi setelah perbaikan struktur FAQ lulus. Audit 21st empat file UI: 0 error, 0 warning, 7 saran info deklarasi token warna; [hasil JSON](21st-amber-review.json).

Browser desktop 1280 px dan mobile 360×800 diperiksa: overflow horizontal kosong, beranda amber, menu mobile terbuka/tertutup saat menuju kontak, anchor Jelajahi layanan menuju bagian layanan, dan FAQ dapat dibuka. Teks memakai charcoal/brown pada amber dan light/gray pada charcoal. Tidak ada pengiriman pesan baru atau perubahan data usaha dalam revisi ini.

Screenshot: [desktop](amber-desktop.jpg), [mobile](amber-mobile.jpg), [halaman lengkap](amber-fullpage.jpg). Pemeriksaan visual bukan audit axe/Lighthouse atau matriks browser penuh. Tes backend sebelumnya tidak diulang karena perubahan ini hanya markup/CSS/header.

Auto-review menolak pencarian awal dengan `--context auto` karena ekspor metadata proyek. Alternatif diizinkan setelah memverifikasi `loadDesignContext` tidak membaca konteks jika flag dihilangkan; pencarian final hanya mengirim query umum. Tidak ada ekspor konteks yang dilakukan.
