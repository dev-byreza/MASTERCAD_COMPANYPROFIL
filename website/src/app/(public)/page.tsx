import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Box,
  Check,
  Cog,
  Database,
  DraftingCompass,
  FileCode,
  GraduationCap,
  Play,
  Ruler,
  ScanLine,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  KeyRound,
} from "lucide-react";
import { publicContent, settings } from "@/lib/content";
import { DashboardMockup } from "@/components/dashboard-mockup";
import { PricingTable } from "@/components/pricing-table";
import { TestimonialsShowcase } from "@/components/testimonials-showcase";

export function generateMetadata() {
  const site = settings();
  return {
    title: { absolute: site.seoTitle },
    description: site.seoDescription,
    alternates: { canonical: "/" },
  };
}

const serviceIcons = [Database, FileCode, GraduationCap, KeyRound];
const capabilities = [
  {
    title: "Database Part & Standar Mesin",
    icon: Database,
    desc: "Katalog lengkap baut, bearing, gear, profil baja & tabel toleransi ISO/DIN/JIS.",
  },
  {
    title: "Plugin SketchUp & LISP AutoCAD",
    icon: FileCode,
    desc: "Plugin SketchUp arsitektur/3D & 450+ script AutoLISP AutoCAD untuk otomasi drafting.",
  },
  {
    title: "LMS Pembelajaran CAD",
    icon: GraduationCap,
    desc: "Video tutorial terstruktur AutoCAD (2D/3D), Autodesk Inventor & SketchUp dari dasar.",
  },
  {
    title: "Lisensi Software CAD Resmi",
    icon: KeyRound,
    desc: "Aktivasi lisensi original software CAD (AutoCAD, SketchUp Pro, Inventor) bergaransi penuh.",
  },
];

export default function Home() {
  const site = settings();
  const services = publicContent("service");
  const projects = publicContent("portfolio");
  const steps = publicContent("page");
  const questions = publicContent("faq");
  const featured = projects[0];

  const whatsappUrl = (message: string) =>
    site.whatsapp
      ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
      : undefined;

  const consultationWhatsApp = whatsappUrl(
    "Halo MasterCAD, saya ingin bertanya tentang paket Database Teknik Mesin, Plugin SketchUp & LISP, LMS CAD, dan Lisensi Software CAD: ",
  );

  return (
    <main id="main" className="home-page theme-dark-neon">
      {/* Decorative ambient background glows */}
      <div className="ambient-glow ambient-glow-top" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-left" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-right" aria-hidden="true" />

      {/* ===================== HERO SECTION ===================== */}
      <section className="home-hero">
        <div className="container hero-container-relative">
          {/* Top pill badge */}
          <div className="hero-top-badge-wrapper">
            <span className="hero-top-badge">
              <span className="badge-sparkle">✦</span>
              DATABASE MESIN · PLUGIN SKETCHUP &amp; LISP · LMS CAD · LISENSI
            </span>
          </div>

          {/* Floating Pill Badges around the Hero (replicates user screenshot) */}
          <div className="floating-badge-cluster left-cluster" aria-hidden="true">
            <div className="floating-badge badge-user-1">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt=""
                className="floating-avatar"
              />
              <div className="badge-text">
                <span className="badge-name">Ir. Hendra P.</span>
                <span className="badge-date">Akses Database Mesin</span>
              </div>
              <span className="badge-metric">Lifetime Rp 149k</span>
            </div>

            <div className="floating-badge badge-user-2">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                alt=""
                className="floating-avatar"
              />
              <div className="badge-text">
                <span className="badge-name">Dimas Anggara</span>
                <span className="badge-date">Plugin SketchUp &amp; LISP</span>
              </div>
              <span className="badge-metric">450+ Tools</span>
            </div>

            <div className="floating-badge badge-user-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt=""
                className="floating-avatar"
              />
              <div className="badge-text">
                <span className="badge-name">Siti Rahmawati</span>
                <span className="badge-date">Sertifikat LMS CAD</span>
              </div>
              <span className="badge-metric">AutoCAD &amp; Inv</span>
            </div>
          </div>

          <div className="floating-badge-cluster right-cluster" aria-hidden="true">
            <div className="floating-badge badge-revenue">
              <div className="badge-icon-crown">
                <Database size={16} />
              </div>
              <div className="badge-text">
                <span className="badge-metric-big">299K+ Parts</span>
                <span className="badge-sub">Database Komponen</span>
              </div>
            </div>

            <div className="floating-badge badge-metric-box">
              <div className="badge-icon-box purple">
                <FileCode size={16} />
              </div>
              <div className="badge-text">
                <span className="badge-metric-big">89,773+</span>
                <span className="badge-sub">Plugin &amp; AutoLISP</span>
              </div>
            </div>

            <div className="floating-badge badge-metric-box-2">
              <div className="badge-icon-box pink">
                <KeyRound size={16} />
              </div>
              <div className="badge-text">
                <span className="badge-metric-big">100% Resmi</span>
                <span className="badge-sub">Lisensi CAD Garansi</span>
              </div>
            </div>
          </div>

          {/* Center Headline & Copy */}
          <div className="hero-center-content">
            <h1 className="hero-giant-title">
              Your Big Engineering
              <br />
              <span className="neon-lime-word">Starts</span> With Us
            </h1>

            <p className="hero-description">
              Satu platform terintegrasi untuk 4 kebutuhan utama engineering &amp; drafting:{" "}
              <strong>Akses Database Teknik Mesin</strong> terlengkap, koleksi{" "}
              <strong>Plugin SketchUp &amp; LISP AutoCAD</strong> untuk otomasi perancangan,
              platform <strong>LMS Pembelajaran CAD</strong> (AutoCAD, Inventor &amp; SketchUp),
              serta penyediaan <strong>Lisensi Software CAD</strong> original bergaransi.
            </p>

            {/* Action Buttons */}
            <div className="hero-actions-group">
              <a href="#investasi" className="home-button home-button-lime">
                Pilih Paket Akses <ArrowUpRight size={18} />
              </a>
              <a href="#demo" className="home-button home-button-glass">
                <Play size={16} fill="currentColor" /> Tonton Demo &amp; LMS
              </a>
            </div>

            {/* Social Proof */}
            <div className="hero-social-proof">
              <div className="avatar-pile">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                  alt=""
                  width="36"
                  height="36"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80"
                  alt=""
                  width="36"
                  height="36"
                />
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt=""
                  width="36"
                  height="36"
                />
              </div>
              <span className="social-proof-text">
                Join <strong>289,109</strong> drafter, engineer, dan pembelajar CAD sukses
              </span>
            </div>
          </div>

          {/* ===================== CENTERPIECE HERO DASHBOARD MOCKUP ===================== */}
          <div id="demo" className="hero-dashboard-anchor">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ===================== LOGOIPSUM PARTNER BAND ===================== */}
      <section className="partner-logo-band" aria-label="Partner dan Pengguna">
        <div className="container">
          <div className="logoipsum-track">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="logoipsum-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>logoipsum</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CORE CAPABILITIES ===================== */}
      <section className="home-capabilities" aria-label="Keahlian Utama MasterCAD">
        <div className="container">
          <div className="capabilities-header">
            <span className="home-eyebrow">CAPABILITIES / 4 KEUNGGULAN UTAMA</span>
            <h2>Ekosistem Lengkap Praktisi Teknik Mesin &amp; CAD</h2>
          </div>
          <div className="home-capabilities-grid">
            {capabilities.map(({ title, icon: Icon, desc }, index) => (
              <div className="home-capability-card" key={title}>
                <div className="capability-top">
                  <span className="capability-num">0{index + 1}</span>
                  <div className="capability-icon-wrap">
                    <Icon size={22} strokeWidth={2} />
                  </div>
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 3 LAYANAN UTAMA SECTION ===================== */}
      <section id="layanan" className="home-section home-services">
        <div className="container">
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow">01 / TIGA LAYANAN UTAMA</span>
              <h2>
                Akses Database, Otomasi LISP,
                <br />
                <span className="neon-lime-word">&amp; LMS Pembelajaran Terarah.</span>
              </h2>
            </div>
            <div className="home-section-aside">
              <p>
                Solusi terlengkap untuk mahasiswa, drafter pemula, hingga senior
                engineering lead yang ingin meningkatkan produktivitas harian.
              </p>
              <Link href="/layanan" className="home-text-link">
                Detail semua layanan <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="home-service-list">
            {services.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              return (
                <Link
                  href={`/layanan/${service.slug}`}
                  className="home-service-row"
                  key={service.slug}
                >
                  <span className="home-service-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="home-service-icon">
                    <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="home-service-content">
                    <span className="home-service-title">{service.title}</span>
                    <span className="home-service-description">
                      {service.description}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="home-service-arrow"
                    size={22}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== WORTH INVESTMENT (PRICING TABLE) ===================== */}
      <PricingTable />

      {/* ===================== REAL SUCCESS STORIES (TESTIMONIALS) ===================== */}
      <TestimonialsShowcase />

      {/* ===================== TENTANG STUDIO & VISI ===================== */}
      <section id="studio" className="home-studio">
        <div className="container home-studio-grid">
          <div className="home-studio-intro">
            <span className="home-eyebrow">03 / TENTANG PLATFORM</span>
            <h2>
              Efisiensi Desain.
              <br />
              <span className="neon-lime-word">Penguasaan Teknik Nyata.</span>
            </h2>
            <Link href="/tentang" className="home-text-link">
              Mengenal MasterCAD <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="home-studio-detail">
            <p>{site.about}</p>
            <div className="home-principles">
              <div>
                <span className="principle-number">01</span>
                <strong>Database Terstandarisasi</strong> — Memangkas waktu pencarian ukuran &amp; standar part mesin.
              </div>
              <div>
                <span className="principle-number">02</span>
                <strong>Otomasi Drafting CAD</strong> — Mempercepat tugas gambar berulang via AutoLISP cerdas.
              </div>
              <div>
                <span className="principle-number">03</span>
                <strong>Pembelajaran Berbasis Proyek</strong> — Kurikulum LMS praktis siap pakai di dunia industri.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PILIHAN KARYA / STUDI KASUS ===================== */}
      <section id="karya" className="home-section home-portfolio">
        <div className="container">
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow">04 / CONTOH PROYEK &amp; STUDI KASUS LMS</span>
              <h2>Eksplorasi Bentuk, Assembly &amp; Toleransi.</h2>
            </div>
            <Link href="/portofolio" className="home-text-link">
              Seluruh Portofolio &amp; Modul <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>

          {featured ? (
            <article className="home-featured-work">
              <Link
                href={`/portofolio/${featured.slug}`}
                className="home-work-image"
                aria-label={`Lihat ${featured.title}`}
              >
                <img
                  src={featured.images?.[0]}
                  alt={featured.alts?.[0] || featured.title}
                  width="1200"
                  height="800"
                  loading="lazy"
                />
              </Link>
              <div className="home-work-details">
                <div className="home-work-tags">
                  <span className="tag-pill highlight-pill">STUDI KASUS LMS</span>
                  <span className="tag-pill">{featured.category}</span>
                </div>
                <h3>{featured.title}</h3>
                <p>{featured.description}</p>
                <Link
                  href={`/portofolio/${featured.slug}`}
                  className="home-text-link"
                >
                  Lihat Detail Studi Kasus <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ) : (
            <p className="home-empty">Portofolio studi kasus sedang disiapkan.</p>
          )}
        </div>
      </section>

      {/* ===================== ALUR KERJA ===================== */}
      <section className="home-process">
        <div className="container">
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow">05 / ALUR BELAJAR &amp; PENGGUNAAN</span>
              <h2>
                Langkah yang Jelas.
                <br />
                <span className="neon-lime-word">Hasil yang Terukur.</span>
              </h2>
            </div>
            <p>
              Mulai dari memilih paket akses, mengunduh resource, hingga penguasaan materi di LMS.
            </p>
          </div>
          <div className="home-process-grid">
            {steps.map((step, index) => (
              <article className="home-process-step" key={step.slug}>
                <span className="process-idx">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="home-section home-faq">
        <div className="container home-faq-grid">
          <div className="home-faq-intro">
            <span className="home-eyebrow">06 / PERTANYAAN UMUM</span>
            <h2>
              Pertanyaan Seputar
              <br />
              Platform MasterCAD.
            </h2>
            <p>Informasi seputar Database Teknik Mesin, Plugin AutoLISP, dan materi LMS.</p>
            <Link href="/kontak" className="home-text-link">
              Ajukan Pertanyaan <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="home-faq-list">
            {questions.map((question) => (
              <details key={question.slug}>
                <summary>
                  {question.title}
                  <span aria-hidden="true" className="faq-toggle-icon">
                    +
                  </span>
                </summary>
                <p>{question.body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FINAL HIGH-IMPACT CTA ===================== */}
      <section id="kontak" className="home-contact-cta">
        <div className="container home-contact-inner">
          <div className="cta-left">
            <span className="home-eyebrow">LANGKAH BERIKUTNYA</span>
            <h2>
              Tingkatkan Produktivitas Anda.
              <br />
              <span className="neon-lime-word">Gabung MasterCAD Sekarang.</span>
            </h2>
            <p className="cta-sub">
              Dapatkan akses langsung ke ribuan data teknik mesin, library AutoLISP CAD siap pakai,
              dan kurikulum pembelajaran AutoCAD &amp; Autodesk Inventor terstruktur.
            </p>
          </div>
          <div className="home-contact-action">
            <a href="#investasi" className="home-button home-button-lime">
              Pilih Paket Akses <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a
              href={consultationWhatsApp || "https://wa.me"}
              target="_blank"
              rel="noopener noreferrer"
              className="home-button home-button-glass"
            >
              Konsultasi WhatsApp <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
