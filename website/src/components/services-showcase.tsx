"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Database,
  FileCode,
  GraduationCap,
  KeyRound,
  Check,
  ArrowUpRight,
  Search,
  Play,
  Terminal,
  ShieldCheck,
  Sparkles,
  Layers,
  Code,
  Award,
  Clock,
  Download,
} from "lucide-react";

const servicesData = [
  {
    id: "database",
    number: "01",
    tabLabel: "Database Teknik Mesin",
    shortBadge: "DATABASE STANDAR",
    icon: Database,
    title: "Database Teknik Mesin & Standar Manufaktur",
    slug: "database-teknik-mesin",
    headline: "Pusat referensi mekanikal terlengkap tanpa perlu mencari manual buku tebal.",
    description:
      "Akses seumur hidup ke ribuan data komponen terstandarisasi industri internasional (ISO, JIS, DIN). Lengkap dengan tabel toleransi suaian presisi, sifat mekanik material baja/logam, dan formula kalkulasi praktis perancangan mesin.",
    highlights: [
      "Katalog Baut, Mur, Bearing SKF/FAG, Roda Gigi, Pasak & Profil Baja",
      "Tabel Toleransi Geometris & Suaian Poros-Lubang ISO/DIN/JIS",
      "Database Sifat Mekanik Material (Kekerasan, Yield, Tensile Strength)",
      "Modul Rumus Praktis Torsi, Daya Motor, Rantai & Tegangan Izin",
    ],
    ctaText: "Eksplorasi Katalog Database",
    // Preview Mockup Content
    previewType: "database",
  },
  {
    id: "plugins",
    number: "02",
    tabLabel: "Plugin SketchUp & LISP AutoCAD",
    shortBadge: "PLUGINS & OTOMASI",
    icon: FileCode,
    title: "Plugin SketchUp & 450+ Script AutoLISP AutoCAD",
    slug: "plugin-sketchup-lisp-autocad",
    headline: "Pangkas pekerjaan gambar berulang hingga 10x lebih cepat dengan otomasi cerdas.",
    description:
      "Koleksi plugin modeling SketchUp untuk arsitektur, interior, dan mekanikal digabungkan dengan 450+ script AutoLISP AutoCAD siap pakai. Penomoran balon part, pembuatan tabel BOM, penarikan dimensi cepat, hingga export koordinat ke Excel selesai dalam hitungan detik.",
    highlights: [
      "Bundle Plugin Modeling & Rendering SketchUp Siap Pakai",
      "450+ Script AutoLISP AutoCAD (.lsp) Teruji Standar Kerja Industri",
      "Otomasi Pembuatan Tabel BOM & Penomoran Balon Part Seketika",
      "Panduan Instalasi Mudah (APPLOAD) + Shortcut Command Keyboard",
    ],
    ctaText: "Lihat Koleksi Plugin & LISP",
    previewType: "terminal",
  },
  {
    id: "lms",
    number: "03",
    tabLabel: "LMS Pembelajaran CAD",
    shortBadge: "KURSUS & SERTIFIKAT",
    icon: GraduationCap,
    title: "LMS Pembelajaran CAD Terstruktur (AutoCAD, Inventor & SketchUp)",
    slug: "lms-pembelajaran-cad",
    headline: "Kurikulum bertingkat dari dasar nol hingga mahir proyek industri nyata.",
    description:
      "Platform e-learning mandiri dengan video materi HD terstruktur. Memandu Anda menguasai AutoCAD 2D drafting & 3D layout, Autodesk Inventor 3D Parametric part modeling & mechanical assembly, serta 3D Modeling SketchUp untuk presentasi desain presisi.",
    highlights: [
      "180+ Jam Video Tutorial HD Step-by-Step Tanpa Batas Waktu",
      "Download File Latihan Proyek Manufaktur & Gambar Kerja Lengkap",
      "Sertifikat Resmi Penyelesaian Kursus untuk Portfolio Profesional",
      "Grup Diskusi & Konsultasi Bimbingan Tanya-Jawab Materi",
    ],
    ctaText: "Mulai Belajar di LMS",
    previewType: "lms",
  },
  {
    id: "license",
    number: "04",
    tabLabel: "Lisensi Software CAD",
    shortBadge: "LISENSI RESMI",
    icon: KeyRound,
    title: "Lisensi Resmi & Aktivasi Software CAD Bergaransi",
    slug: "lisensi-software-cad",
    headline: "Bekerja tenang dan profesional tanpa resiko virus, malware, atau kendala lisensi bajakan.",
    description:
      "Penyediaan aktivasi lisensi original dan resmi software CAD (AutoCAD, SketchUp Pro, Autodesk Inventor). Nikmati instalasi mulus dengan dukungan teknis langsung dari tim MasterCAD, garansi aktivasi penuh, serta opsi lisensi perseorangan, mahasiswa, maupun studio/perusahaan.",
    highlights: [
      "Aktivasi Resmi Software Pilihan (AutoCAD / SketchUp / Inventor)",
      "Garansi Aktivasi Penuh & Bantuan Teknis Remote Setup",
      "Aman dari Resiko Crash, Malware, dan Kendala Lisensi Crack",
      "Invoice Resmi untuk Kebutuhan Perusahaan, Kampus & Studio",
    ],
    ctaText: "Order Lisensi Software",
    previewType: "license",
  },
];

export function ServicesShowcase() {
  const [activeTab, setActiveTab] = useState("database");
  const current = servicesData.find((s) => s.id === activeTab) || servicesData[0];

  return (
    <section id="solusi-engineering" className="home-section services-studio-section">
      <div className="container">
        {/* Section Heading */}
        <div className="services-studio-header">
          <div className="header-left">
            <span className="home-eyebrow">02 / BEDAH 4 FITUR &amp; KAPABILITAS</span>
            <h2>
              Ekosistem Lengkap.
              <br />
              <span className="neon-lime-word">Dari Database Part Hingga Lisensi CAD.</span>
            </h2>
          </div>
          <p className="header-desc">
            Bukan sekadar teori. Eksplorasi bagaimana setiap pilar MasterCAD membantu drafter,
            engineer mesin, arsitek, dan mahasiswa mempercepat alur kerja teknik harian.
          </p>
        </div>

        {/* Mobile & Desktop Segmented Navigation Tabs */}
        <div className="services-tab-nav-wrapper">
          <div className="services-tab-nav" role="tablist" aria-label="Pilihan Fitur Layanan">
            {servicesData.map((service) => {
              const Icon = service.icon;
              const isActive = activeTab === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`studio-tab-btn ${isActive ? "active" : ""}`}
                  onClick={() => setActiveTab(service.id)}
                >
                  <span className="tab-num">{service.number}</span>
                  <Icon size={16} className="tab-icon" />
                  <span className="tab-text">{service.tabLabel}</span>
                  {isActive && <span className="tab-active-indicator" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Feature Stage (Split-View Studio Layout) */}
        <div className="studio-stage-card">
          {/* Left Column: Capability Details */}
          <div className="stage-info-col">
            <div className="stage-badge-row">
              <span className="stage-badge-pill">
                <current.icon size={13} />
                {current.shortBadge}
              </span>
              <span className="stage-status-live">
                <span className="live-ping" /> Fitur Unggulan
              </span>
            </div>

            <h3 className="stage-title">{current.title}</h3>
            <p className="stage-headline">{current.headline}</p>
            <p className="stage-description">{current.description}</p>

            <div className="stage-highlights-box">
              <h4 className="highlights-caption">Cakupan Resource &amp; Deliverables:</h4>
              <ul className="stage-checklist">
                {current.highlights.map((item, idx) => (
                  <li key={idx}>
                    <span className="check-bullet">
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="stage-action-row">
              <Link
                href={`/layanan/${current.slug}`}
                className="home-button home-button-lime"
              >
                {current.ctaText} <ArrowUpRight size={17} />
              </Link>
              <a href="#investasi" className="home-button home-button-glass">
                Lihat Biaya Sekali Bayar
              </a>
            </div>
          </div>

          {/* Right Column: Live Interactive Visual Mockup / Inspector Window */}
          <div className="stage-visual-col">
            {/* Visual 1: Database Part Inspector */}
            {current.previewType === "database" && (
              <div className="preview-window preview-database">
                <div className="window-topbar">
                  <div className="window-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <span className="window-title">MasterCAD Part Database Inspector v2.4</span>
                  <span className="window-status">ONLINE · 299K+ PARTS</span>
                </div>

                <div className="window-search-box">
                  <Search size={14} className="search-icon" />
                  <span className="search-text">Cari part: Bearing SKF 6205, Baut M12 DIN 933...</span>
                </div>

                <div className="part-spec-table">
                  <div className="table-row header">
                    <span>Part Name</span>
                    <span>Standard</span>
                    <span>Dimensi / Spek</span>
                    <span>Status</span>
                  </div>
                  <div className="table-row active">
                    <span className="part-name">Deep Groove Bearing 6205</span>
                    <span className="spec-badge">SKF / ISO 15</span>
                    <span className="dim">d: 25mm · D: 52mm · B: 15mm</span>
                    <span className="status-ready">✓ 3D STEP &amp; DWG</span>
                  </div>
                  <div className="table-row">
                    <span className="part-name">Hexagon Bolt M12 x 50</span>
                    <span className="spec-badge">DIN 933 / ISO 4017</span>
                    <span className="dim">Pitch: 1.75mm · Grade 8.8</span>
                    <span className="status-ready">✓ Toleransi 6g</span>
                  </div>
                  <div className="table-row">
                    <span className="part-name">Spur Gear Modul 2.5 - 32T</span>
                    <span className="spec-badge">JIS B 1702</span>
                    <span className="dim">PCD: 80mm · PA: 20°</span>
                    <span className="status-ready">✓ Kalkulator Torsi</span>
                  </div>
                  <div className="table-row">
                    <span className="part-name">Tabel Suaian Poros-Lubang</span>
                    <span className="spec-badge">ISO 286</span>
                    <span className="dim">H7/g6, H7/k6, H7/p6</span>
                    <span className="status-ready">✓ Lengkap</span>
                  </div>
                </div>

                <div className="window-footer-chip">
                  <Sparkles size={14} className="offer-icon-lime" />
                  <span>Termasuk kalkulator instan momen puntir, defleksi poros, dan berat material</span>
                </div>
              </div>
            )}

            {/* Visual 2: AutoLISP & SketchUp Terminal */}
            {current.previewType === "terminal" && (
              <div className="preview-window preview-terminal">
                <div className="window-topbar">
                  <div className="window-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <span className="window-title">CAD Automation Console — AutoCAD &amp; SketchUp</span>
                  <span className="window-status">450+ SCRIPTS READY</span>
                </div>

                <div className="terminal-body">
                  <div className="term-line">
                    <span className="term-prompt">Command:</span>
                    <span className="term-cmd">APPLOAD</span>
                    <span className="term-output">Loading &quot;mastercad_autobom_v4.lsp&quot;... Success.</span>
                  </div>
                  <div className="term-line">
                    <span className="term-prompt">Command:</span>
                    <span className="term-cmd">AUTOBOM</span>
                    <span className="term-output green">
                      &gt; Scan 42 entitas part mekanikal...
                      <br />
                      &gt; Balon penomoran otomatis terpasang (Bubble 1 s/d 42).
                      <br />
                      &gt; Tabel Bill of Materials ter-generate pada layer [M-BOM].
                    </span>
                  </div>
                  <div className="term-line">
                    <span className="term-prompt">Command:</span>
                    <span className="term-cmd">EXPORT_BOM_EXCEL</span>
                    <span className="term-output yellow">
                      &gt; Data part berhasil diekspor ke Excel: [Drawing_Assy_Rev02.xlsx] (0.42s)
                    </span>
                  </div>
                  <div className="term-box-stat">
                    <div className="stat-item">
                      <small>Waktu Manual</small>
                      <strong>~45 Menit</strong>
                    </div>
                    <div className="stat-arrow">➜</div>
                    <div className="stat-item highlight">
                      <small>Dengan AutoLISP</small>
                      <strong>3 Detik</strong>
                    </div>
                  </div>
                </div>

                <div className="window-footer-chip">
                  <FileCode size={14} className="offer-icon-lime" />
                  <span>Kompatibel: AutoCAD 2016 s/d 2026 &amp; Extension SketchUp Pro</span>
                </div>
              </div>
            )}

            {/* Visual 3: LMS Video Course Player */}
            {current.previewType === "lms" && (
              <div className="preview-window preview-lms">
                <div className="window-topbar">
                  <div className="window-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <span className="window-title">MasterCAD LMS Player — Proyek Assembly 3D</span>
                  <span className="window-status">HD 1080P · CERTIFIED</span>
                </div>

                <div className="player-screen-mockup">
                  <div className="player-video-stage">
                    <div className="player-play-circle">
                      <Play size={24} fill="#090a0d" stroke="#090a0d" />
                    </div>
                    <span className="video-duration">24:18 / Modul 06</span>
                  </div>
                  <div className="player-meta-bar">
                    <div className="player-lesson-info">
                      <strong>Modul 06: Assembly Gearbox &amp; Constraint Presisi</strong>
                      <small>Autodesk Inventor 3D • Latihan Proyek Industri Nyata</small>
                    </div>
                    <span className="cert-pill">
                      <Award size={13} /> Sertifikat Resmi
                    </span>
                  </div>
                  <div className="player-progress-wrap">
                    <div className="progress-bar-fill" style={{ width: "72%" }} />
                  </div>
                </div>

                <div className="lms-chapter-pills">
                  <span className="chapter-pill active">01. Dasar Drafting ISO</span>
                  <span className="chapter-pill">02. 3D Parametric Part</span>
                  <span className="chapter-pill">03. Sheet Metal</span>
                  <span className="chapter-pill">04. SketchUp Modeling</span>
                </div>

                <div className="window-footer-chip">
                  <GraduationCap size={14} className="offer-icon-lime" />
                  <span>180+ Jam materi video step-by-step + File latihan part &amp; assembly</span>
                </div>
              </div>
            )}

            {/* Visual 4: Official Software License Security Shield */}
            {current.previewType === "license" && (
              <div className="preview-window preview-license">
                <div className="window-topbar">
                  <div className="window-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <span className="window-title">Official License Activation Guard</span>
                  <span className="window-status">100% ORIGINAL &amp; VERIFIED</span>
                </div>

                <div className="license-certificate-card">
                  <div className="cert-seal-badge">
                    <ShieldCheck size={36} className="seal-icon" />
                    <span className="seal-text">VERIFIED GENUINE</span>
                  </div>

                  <div className="license-info-rows">
                    <div className="lic-row">
                      <span className="lic-label">Pilihan Software:</span>
                      <strong className="lic-val">AutoCAD / SketchUp Pro / Inventor</strong>
                    </div>
                    <div className="lic-row">
                      <span className="lic-label">Status Aktivasi:</span>
                      <span className="lic-status-badge">✓ AKTIF &amp; RESMI TERVERIFIKASI</span>
                    </div>
                    <div className="lic-row">
                      <span className="lic-label">Garansi:</span>
                      <strong className="lic-val">Garansi Aktivasi Penuh &amp; Bantuan Remote</strong>
                    </div>
                    <div className="lic-row">
                      <span className="lic-label">Keamanan:</span>
                      <span className="lic-val">100% Bebas Malware, Virus &amp; Kendala Crack</span>
                    </div>
                  </div>
                </div>

                <div className="window-footer-chip">
                  <KeyRound size={14} className="offer-icon-lime" />
                  <span>Panduan aktivasi instan + Bantuan teknis instalasi langsung dari tim MasterCAD</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
