"use client";

import { useState } from "react";
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
  KeyRound,
  CheckCircle2,
  ChevronRight,
  Layers,
} from "lucide-react";

function formatRupiah(val: number): string {
  return "Rp " + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const individualPlans = [
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
    ctaText: "Order Lisensi Software",
  },
];

const bundlePlan = {
  id: "bundle-all",
  name: "All-in-One Complete Pass",
  badge: "BEST VALUE · 4 LAYANAN SEKALIGUS",
  icon: Sparkles,
  desc: "Satu kali bayar untuk SEMUA 4 LAYANAN: Database Mesin + Plugin SketchUp & LISP + LMS CAD + Lisensi Software CAD!",
  originalPrice: 899000,
  price: 399000,
  savings: 500000,
  inclusions: [
    {
      title: "Database Teknik Mesin",
      desc: "Akses penuh katalog part standar ISO/DIN, toleransi & rumus.",
      icon: Database,
    },
    {
      title: "Plugin SketchUp & LISP AutoCAD",
      desc: "450+ tools otomasi drafting & bundle plugin modeling 3D.",
      icon: FileCode,
    },
    {
      title: "LMS Pembelajaran CAD",
      desc: "180+ jam kursus AutoCAD, Inventor & SketchUp + Sertifikat.",
      icon: GraduationCap,
    },
    {
      title: "Lisensi Software CAD Pilihan",
      desc: "1 Lisensi resmi bergaransi penuh & panduan aktivasi instan.",
      icon: KeyRound,
    },
  ],
  bonuses: [
    "Akun Lifetime aktif seumur hidup tanpa biaya bulanan / tahunan",
    "Gratis semua update materi video, script baru & standar part di masa depan",
    "Prioritas bimbingan & konsultasi kendala drafting via WhatsApp VIP",
    "Garansi aktivasi 100% berjalan lancar",
  ],
  ctaText: "Ambil Paket Lengkap All-in-One (Rp 399.000)",
};

export function PricingTable() {
  // Mode: "bundle" (featured All-in-One) or "individual" (4 modular packages)
  const [pricingMode, setPricingMode] = useState<"bundle" | "individual">("bundle");

  return (
    <section id="investasi" className="home-section worth-investment-section">
      <div className="container">
        {/* Investment Header */}
        <div className="investment-header">
          <span className="home-eyebrow">SEKALI BAYAR / AKSES SEUMUR HIDUP</span>
          <h2>
            Investasi Satu Kali.
            <span className="investment-highlight"> Akses Selamanya.</span>
          </h2>
          <p>
            Tidak ada biaya langganan bulanan. Tidak ada perpanjangan otomatis.
            Pilih paket lengkap All-in-One untuk hemat maksimal, atau pilih paket satuan sesuai kebutuhan Anda.
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

          {/* Mobile & Desktop Pricing Mode Switcher */}
          <div className="pricing-mode-switcher-wrap">
            <div className="pricing-mode-switcher" role="tablist" aria-label="Pilihan Model Paket">
              <button
                type="button"
                role="tab"
                aria-selected={pricingMode === "bundle"}
                className={`mode-btn ${pricingMode === "bundle" ? "active" : ""}`}
                onClick={() => setPricingMode("bundle")}
              >
                <Sparkles size={16} className="mode-btn-icon" />
                <span>★ Rekomendasi Utama: All-in-One (Hemat Rp 500rb)</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={pricingMode === "individual"}
                className={`mode-btn ${pricingMode === "individual" ? "active" : ""}`}
                onClick={() => setPricingMode("individual")}
              >
                <Layers size={16} className="mode-btn-icon" />
                <span>Pilih Paket Satuan (4 Pilihan)</span>
              </button>
            </div>
          </div>
        </div>

        {/* VIEW 1: FEATURED ALL-IN-ONE SPOTLIGHT CARD */}
        {pricingMode === "bundle" && (
          <div className="bundle-spotlight-card">
            {/* Left side: Value proposition & pricing */}
            <div className="bundle-main-col">
              <div className="bundle-top-tag">
                <span className="bundle-tag-pill">
                  <Sparkles size={14} /> REKOMENDASI TERBAIK · HEMAT 55%
                </span>
                <span className="bundle-guarantee-badge">
                  <ShieldCheck size={14} /> LIFETIME ACCESS
                </span>
              </div>

              <h3 className="bundle-title">All-in-One Complete Pass</h3>
              <p className="bundle-subtext">
                Satu akun untuk memiliki <strong>SEMUA 4 LAYANAN SEKALIGUS</strong>: Akses Database
                Teknik Mesin + Seluruh Plugin SketchUp &amp; AutoLISP + LMS Pembelajaran CAD + Lisensi Resmi Software CAD.
              </p>

              <div className="bundle-price-box">
                <div className="strike-row">
                  <span className="orig-price">{formatRupiah(bundlePlan.originalPrice)}</span>
                  <span className="save-badge">HEMAT {formatRupiah(bundlePlan.savings)}</span>
                </div>
                <div className="price-big-row">
                  <strong className="bundle-num">{formatRupiah(bundlePlan.price)}</strong>
                  <span className="bundle-period">/ sekali bayar seumur hidup</span>
                </div>
                <small className="bundle-note">
                  ✓ Tanpa biaya bulanan • Tanpa perpanjangan • Langsung aktif seketika
                </small>
              </div>

              <div className="bundle-cta-group">
                <Link
                  href={`/kontak?layanan=${bundlePlan.id}`}
                  className="home-button home-button-lime bundle-cta-large"
                >
                  {bundlePlan.ctaText} <ArrowUpRight size={20} />
                </Link>
                <button
                  type="button"
                  className="home-button home-button-glass"
                  onClick={() => setPricingMode("individual")}
                >
                  Atau lihat paket satuan saja <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Right side: 4 Inclusions Grid + Bonuses */}
            <div className="bundle-perks-col">
              <h4 className="perks-heading">Yang Anda Dapatkan di Paket Ini:</h4>

              <div className="perks-grid">
                {bundlePlan.inclusions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="perk-item-card">
                      <div className="perk-icon-wrap">
                        <Icon size={18} />
                      </div>
                      <div className="perk-info">
                        <strong>{item.title}</strong>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bundle-bonus-list">
                <h5 className="bonus-title">Jaminan &amp; Keuntungan Ekstra:</h5>
                <ul>
                  {bundlePlan.bonuses.map((bonus, i) => (
                    <li key={i}>
                      <CheckCircle2 size={15} className="offer-icon-lime" />
                      <span>{bonus}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: 4 MODULAR PACKAGES (SWIPEABLE ON MOBILE) */}
        {pricingMode === "individual" && (
          <div className="individual-plans-container">
            <div className="mobile-swipe-hint">
              <span>← Geser kartu untuk melihat pilihan paket lainnya →</span>
            </div>

            <div className="individual-plans-grid">
              {individualPlans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <div key={plan.id} className="investment-card startup-card">
                    <div className="card-topline">
                      <span className="tier-name">{plan.name}</span>
                      <span className="tier-badge">{plan.badge}</span>
                    </div>

                    <div className="pricing-number">
                      <div className="price-stack">
                        <span className="original-strike">{formatRupiah(plan.originalPrice)}</span>
                        <div className="main-price-row">
                          <strong className="amount">{formatRupiah(plan.price)}</strong>
                          <span className="frequency">/ sekali bayar</span>
                        </div>
                      </div>
                    </div>

                    <p className="tier-desc">{plan.desc}</p>

                    <ul className="tier-checklist">
                      {plan.features.map((feat) => (
                        <li key={feat}>
                          <span className="check-icon lime">
                            <Check size={16} strokeWidth={2.5} />
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/kontak?layanan=${plan.id}`}
                      className="investment-btn outline-btn"
                    >
                      {plan.ctaText} <ArrowUpRight size={17} />
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="switch-to-bundle-banner">
              <div className="banner-text">
                <strong>Ingin Semua Layanan Sekaligus?</strong>
                <p>Ambil All-in-One Complete Pass hanya Rp 399.000 (Hemat Rp 500.000 dibanding beli satuan).</p>
              </div>
              <button
                type="button"
                className="home-button home-button-lime"
                onClick={() => setPricingMode("bundle")}
              >
                Lihat Paket Bundle All-in-One <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Footnote */}
        <div className="investment-footnote">
          <p>
            * Membutuhkan lisensi software khusus, instalasi tim, atau invoice resmi untuk kampus/perusahaan?{" "}
            <Link href="/kontak" className="home-text-link">
              Konsultasikan via WhatsApp MasterCAD
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
