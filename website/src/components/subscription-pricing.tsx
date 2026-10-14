"use client";

import Link from "next/link";
import {
  Check,
  ArrowUpRight,
  Sparkles,
  Database,
  FileCode,
  GraduationCap,
  ShieldCheck,
  Zap,
  HelpCircle,
  KeyRound,
} from "lucide-react";

function formatRupiah(val: number): string {
  return "Rp " + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const plans = [
  {
    id: "database-teknik-mesin",
    name: "Database Teknik Mesin",
    badge: "LIFETIME PASS",
    icon: Database,
    desc: "Akses seumur hidup seluruh library standar part mesin, tabel toleransi ISO/JIS/DIN, dan kalkulator mekanikal.",
    originalPrice: 249000,
    price: 149000,
    features: [
      "Akses seluruh katalog baut, bearing, gear, profil baja",
      "Tabel toleransi suaian & fitting ISO/JIS/DIN",
      "Database sifat mekanik & kekerasan material",
      "Modul rumus kalkulasi praktis perancangan mesin",
      "Gratis update penambahan standar part baru",
    ],
    featured: false,
    ctaText: "Beli Akses Database",
  },
  {
    id: "plugin-sketchup-lisp-autocad",
    name: "Plugin SketchUp & LISP AutoCAD",
    badge: "LIFETIME PASS",
    icon: FileCode,
    desc: "Koleksi Plugin SketchUp (arsitektur & mesin) + 450+ script AutoLISP AutoCAD untuk otomasi drafting cerdas.",
    originalPrice: 349000,
    price: 199000,
    features: [
      "Koleksi Plugin SketchUp modeling & rendering siap pakai",
      "Download seluruh 450+ Script AutoLISP AutoCAD",
      "Otomasi penomoran balon part & tabel BOM instan",
      "Quick dimensioning, export koordinat & layer cleaner",
      "Panduan instalasi langkah-demi-langkah & shortcut",
    ],
    featured: false,
    ctaText: "Beli Plugin & LISP",
  },
  {
    id: "lms-pembelajaran-cad",
    name: "LMS Pembelajaran CAD",
    badge: "LIFETIME PASS",
    icon: GraduationCap,
    desc: "Akses selamanya ke video tutorial terstruktur AutoCAD (2D/3D), Autodesk Inventor, & SketchUp dari dasar hingga mahir.",
    originalPrice: 499000,
    price: 249000,
    features: [
      "Kursus AutoCAD 2D & 3D (nol sampai mahir industri)",
      "Kursus Autodesk Inventor 3D Parametric & Assembly",
      "Kursus SketchUp 3D Modeling & presentasi desain",
      "Download file latihan part, assembly & gambar kerja",
      "Sertifikat resmi kelulusan & forum diskusi materi",
    ],
    featured: false,
    ctaText: "Beli Paket LMS Kursus",
  },
  {
    id: "lisensi-software-cad",
    name: "Lisensi Software CAD",
    badge: "OFFICIAL LICENSE",
    icon: KeyRound,
    desc: "Penyediaan lisensi original & aktivasi resmi software CAD (AutoCAD, SketchUp Pro, Inventor) bergaransi penuh.",
    originalPrice: 599000,
    price: 299000,
    features: [
      "Aktivasi resmi software pilihan (AutoCAD/SketchUp/Inventor)",
      "Garansi aktivasi penuh & bantuan setup teknis",
      "Aman dari risiko virus & bebas kendala lisensi bajakan",
      "Panduan aktivasi instan langkah demi langkah",
      "Tersedia opsi akun personal, edukasi & lisensi tim",
    ],
    featured: false,
    ctaText: "Order Lisensi Software",
  },
  {
    id: "bundle-all",
    name: "All-in-One Complete Pass",
    badge: "BEST VALUE · 4 LAYANAN SEKALIGUS",
    icon: Sparkles,
    desc: "Satu kali bayar untuk SEMUA 4 LAYANAN: Database Mesin + Plugin SketchUp & LISP + LMS CAD + Lisensi Software CAD!",
    originalPrice: 899000,
    price: 399000,
    features: [
      "Akses PENUH Database Teknik Mesin seumur hidup",
      "Download Plugin SketchUp & 450+ Script AutoLISP",
      "Akses SELURUH kursus LMS AutoCAD, Inventor & SketchUp",
      "Termasuk Lisensi Resmi Software CAD pilihan",
      "Gratis semua update video & resource di masa depan",
      "Prioritas konsultasi tanya-jawab via WhatsApp",
    ],
    featured: true,
    ctaText: "Ambil Paket Lengkap All-in-One",
  },
];

const faqs = [
  {
    q: "Apakah seluruh paket ini benar-benar sistem 1 kali bayar tanpa tagihan bulanan?",
    a: "Ya, 100% sistem Beli Putus (One-Time Purchase). Anda tidak akan pernah dibebani biaya perpanjangan bulanan atau tahunan. Sekali pembayaran diverifikasi, akun dan akses resource Anda aktif selamanya.",
  },
  {
    q: "Apa saja software yang termasuk dalam paket Lisensi CAD?",
    a: "Kami menyediakan lisensi resmi untuk software populer seperti AutoCAD, SketchUp Pro, dan Autodesk Inventor. Setiap lisensi disertai garansi aktivasi penuh, tautan unduhan resmi, dan bantuan instalasi langsung dari tim MasterCAD.",
  },
  {
    q: "Bagaimana cara instalasi Plugin SketchUp dan LISP AutoCAD?",
    a: "Setiap paket plugin dan script AutoLISP dilengkapi petunjuk instalasi bergambar yang sangat mudah dipahami (langkah APPLOAD di AutoCAD & Extension Manager di SketchUp), serta daftar command shortcut agar langsung dapat Anda gunakan bekerja.",
  },
  {
    q: "Apakah saya mendapatkan pembaruan materi kursus dan library part baru?",
    a: "Tentu! Seluruh pembaruan di masa depan—baik penambahan standar part baru di database teknik mesin, video studi kasus baru di LMS CAD, maupun koleksi script LISP tambahan—dapat Anda nikmati secara GRATIS seumur hidup.",
  },
  {
    q: "Apakah tersedia paket lisensi untuk tim, studio, atau instansi pendidikan?",
    a: "Tersedia! Kami melayani lisensi multi-user dan pengadaan untuk institusi pendidikan, biro arsitektur, konsultan teknik, maupun bengkel fabrikasi dengan invoice resmi. Hubungi WhatsApp official kami untuk penawaran khusus tim.",
  },
];

export function SubscriptionPricing() {
  return (
    <main id="main" className="home-page theme-dark-neon page-content">
      {/* Ambient background glows */}
      <div className="ambient-glow ambient-glow-top" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-left" aria-hidden="true" />

      {/* Hero / Header Section */}
      <section className="home-section worth-investment-section" style={{ paddingTop: "60px" }}>
        <div className="container">
          <div className="investment-header">
            <span className="home-eyebrow">
              ✦ INVESTASI SATU KALI · TANPA LANGGANAN BULANAN
            </span>
            <h2>
              Pilihan Paket Lifetime.
              <br />
              <span className="investment-highlight">Satu Kali Bayar. Akses Selamanya.</span>
            </h2>
            <p>
              Tidak ada biaya langganan bulanan. Tidak ada perpanjangan otomatis.
              Pilih kebutuhan spesifik Anda dari 4 pilar unggulan: Database Teknik Mesin,
              Plugin SketchUp &amp; LISP AutoCAD, LMS Pembelajaran CAD, atau Lisensi Software Resmi.
            </p>

            {/* Lifetime Reassurance Pill */}
            <div className="lifetime-guarantee-pill">
              <span className="guarantee-item">
                <Zap size={15} className="offer-icon-lime" /> Sekali Bayar Beli Putus
              </span>
              <span className="pill-dot">•</span>
              <span className="guarantee-item">
                <ShieldCheck size={15} className="offer-icon-lime" /> Tanpa Tagihan Bulanan
              </span>
              <span className="pill-dot">•</span>
              <span className="guarantee-item">
                <Sparkles size={15} className="offer-icon-lime" /> Gratis Pembaruan Berkala
              </span>
            </div>
          </div>

          {/* 5 Cards Grid */}
          <div className="lifetime-pricing-grid">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`investment-card ${
                  plan.featured
                    ? "enterprise-card featured-lime"
                    : "startup-card"
                }`}
              >
                <div className="card-topline">
                  <span className={`tier-name ${plan.featured ? "dark-text" : ""}`}>
                    {plan.name}
                  </span>
                  <span className={plan.featured ? "featured-badge" : "tier-badge"}>
                    {plan.badge}
                  </span>
                </div>

                <div className={`pricing-number ${plan.featured ? "dark-text" : ""}`}>
                  <div className="price-stack">
                    <span className="original-strike">
                      {formatRupiah(plan.originalPrice)}
                    </span>
                    <div className="main-price-row">
                      <strong className="amount">{formatRupiah(plan.price)}</strong>
                      <span className="frequency">/ sekali bayar</span>
                    </div>
                  </div>
                </div>

                <p className={`tier-desc ${plan.featured ? "dark-text" : ""}`}>
                  {plan.desc}
                </p>

                <ul className={`tier-checklist ${plan.featured ? "dark-text" : ""}`}>
                  {plan.features.map((feat) => (
                    <li key={feat}>
                      <span className={`check-icon ${plan.featured ? "black" : "lime"}`}>
                        <Check size={16} strokeWidth={2.5} />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/kontak?layanan=${plan.id}`}
                  className={`investment-btn ${
                    plan.featured ? "solid-black-btn" : "outline-btn"
                  }`}
                >
                  {plan.ctaText} <ArrowUpRight size={17} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ on Lifetime Purchase & License */}
      <section className="home-section" style={{ borderTop: "1px solid var(--dark-border)" }}>
        <div className="container">
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow">TANYA JAWAB / SISTEM PEMBELIAN &amp; LISENSI</span>
              <h2>
                Seputar Pembelian <span className="neon-lime-word">Satu Kali Bayar</span>
              </h2>
            </div>
            <p>
              Semua informasi transparan mengenai aktivasi resource, lisensi software resmi, dan jaminan lifetime.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
              marginTop: "40px",
            }}
          >
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--dark-card)",
                  border: "1px solid var(--dark-border-strong)",
                  borderRadius: "var(--radius-lg)",
                  padding: "30px",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                  <HelpCircle size={20} className="offer-icon-lime" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <h3 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text-white)", margin: 0, lineHeight: 1.4 }}>
                    {faq.q}
                  </h3>
                </div>
                <p style={{ fontSize: "14px", lineHeight: "1.65", color: "var(--text-muted)", margin: 0, paddingLeft: "32px" }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Group / Custom Consultation CTA Box */}
          <div
            style={{
              marginTop: "60px",
              background: "linear-gradient(135deg, rgba(204, 255, 0, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)",
              border: "1px solid rgba(204, 255, 0, 0.25)",
              borderRadius: "var(--radius-lg)",
              padding: "36px 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-white)", marginBottom: "8px" }}>
                Butuh Lisensi Tim, Sekolah, atau Perusahaan?
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0, maxWidth: "620px" }}>
                Kami menyediakan invoice resmi dan paket lisensi multi-user untuk institusi pendidikan, biro arsitektur, konsultan teknik, maupun manufaktur.
              </p>
            </div>
            <Link
              href="/kontak"
              className="home-button home-button-lime"
              style={{ whiteSpace: "nowrap" }}
            >
              Hubungi Tim MasterCAD <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
