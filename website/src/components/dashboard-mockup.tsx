"use client";

import { useState } from "react";
import {
  Play,
  TrendingUp,
  Award,
  Layers,
  Box,
  BarChart3,
  CheckCircle,
  Eye,
  Share2,
  Users,
  DollarSign,
  Sparkles,
  X,
  Database,
  FileCode,
  GraduationCap,
} from "lucide-react";

export function DashboardMockup() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("database");

  return (
    <div className="dashboard-mockup-wrapper">
      {/* Decorative neon squiggly doodle accent on the right */}
      <div className="neon-doodle-accent" aria-hidden="true">
        <svg
          width="84"
          height="120"
          viewBox="0 0 84 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 8C28 20 68 15 52 42C38 65 14 55 24 82C32 104 62 102 76 112"
            stroke="#ccff00"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M62 100L76 112L78 94"
            stroke="#ccff00"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="dashboard-mockup-card">
        {/* Top bar */}
        <div className="mockup-top-bar">
          <div className="mockup-brand">
            <span className="mockup-logo-symbol">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" fill="#090a0d" />
                <path
                  d="M12 2V6M12 18V22M2 12H6M18 12H22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
                  stroke="#ccff00"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="mockup-brand-name">MasterCAD Studio</span>
          </div>

          <div className="mockup-title-center">
            <strong>Overview Platform</strong>
            <span className="mockup-subtitle">Database Teknik Mesin · Plugin SketchUp &amp; LISP · LMS CAD · Lisensi</span>
          </div>

          <div className="mockup-user-chip">
            <div className="mockup-avatar-mini">
              <span>MC</span>
            </div>
            <div className="mockup-user-info">
              <small>Lifetime Member</small>
              <span className="status-dot">Akses Aktif</span>
            </div>
          </div>
        </div>

        {/* Inner Nav tabs representing the 4 core offerings */}
        <div className="mockup-tabs">
          {[
            { id: "database", label: "01. Database Teknik Mesin" },
            { id: "plugins", label: "02. Plugin SketchUp & LISP" },
            { id: "lms", label: "03. LMS Pembelajaran CAD" },
            { id: "license", label: "04. Lisensi Software CAD" },
            { id: "bundle", label: "05. Bundle All-in-One" },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              className={`mockup-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Metric Cards Row */}
        <div className="mockup-metrics-grid">
          <div className="mockup-metric-card">
            <div className="metric-header">
              <div className="metric-icon reach">
                <Database size={16} />
              </div>
              <span>Database Part</span>
            </div>
            <div className="metric-value">299,039+</div>
            <div className="metric-delta positive">Standar baut, gear, bearing &amp; rumus</div>
          </div>

          <div className="mockup-metric-card">
            <div className="metric-header">
              <div className="metric-icon share">
                <FileCode size={16} />
              </div>
              <span>Plugin &amp; LISP</span>
            </div>
            <div className="metric-value">89,773+</div>
            <div className="metric-delta positive">Plugin SketchUp &amp; LISP AutoCAD</div>
          </div>

          <div className="mockup-metric-card">
            <div className="metric-header">
              <div className="metric-icon views">
                <GraduationCap size={16} />
              </div>
              <span>Siswa LMS CAD</span>
            </div>
            <div className="metric-value">18,221+</div>
            <div className="metric-delta positive">AutoCAD, Inventor &amp; SketchUp</div>
          </div>

          <div className="mockup-metric-card highlight-lime">
            <div className="highlight-tag">Bundle All-In-One</div>
            <div className="highlight-val">Rp 399.000</div>
            <div className="highlight-client">Sekali Bayar · 4 Layanan Sekaligus</div>
          </div>
        </div>

        {/* Central interactive preview area with play button */}
        <div className="mockup-center-interactive">
          <div className="mockup-chart-side">
            <div className="chart-header">
              <strong>Aktivitas Belajar &amp; Penggunaan Resource</strong>
              <div className="chart-legend">
                <span className="dot-lime" /> Database
                <span className="dot-cyan" /> Plugin LISP
                <span className="dot-purple" /> Modul LMS
              </div>
            </div>
            <div className="mockup-bars">
              {[
                { month: "Jan", h1: 45, h2: 30, h3: 25 },
                { month: "Feb", h1: 60, h2: 45, h3: 40 },
                { month: "Mar", h1: 75, h2: 60, h3: 55 },
                { month: "Apr", h1: 70, h2: 55, h3: 50 },
                { month: "Mei", h1: 88, h2: 78, h3: 70 },
                { month: "Jun", h1: 95, h2: 85, h3: 82 },
                { month: "Jul", h1: 86, h2: 76, h3: 74 },
                { month: "Agu", h1: 100, h2: 92, h3: 90 },
              ].map((bar) => (
                <div key={bar.month} className="bar-group">
                  <div className="bars-wrap">
                    <span
                      className="bar-col purple"
                      style={{ height: `${bar.h3}%` }}
                    />
                    <span
                      className="bar-col cyan"
                      style={{ height: `${bar.h2}%` }}
                    />
                    <span
                      className="bar-col lime"
                      style={{ height: `${bar.h1}%` }}
                    />
                  </div>
                  <span className="bar-month">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Glowing Center Play Button overlay */}
          <div className="mockup-play-hub">
            <button
              type="button"
              className="pulse-play-button"
              aria-label="Tonton demo video materi LMS dan otomasi LISP"
              onClick={() => setIsPlaying(true)}
            >
              <Play size={28} fill="#090a0d" stroke="#090a0d" />
            </button>
            <span className="play-label">Preview Video LMS &amp; LISP</span>
          </div>

          {/* Right sidebar inside mockup */}
          <div className="mockup-side-stats">
            <div className="side-stat-pill">
              <span className="side-label">Modul LMS</span>
              <strong>120+ Jam</strong>
              <small className="badge-chip">Video HD</small>
            </div>
            <div className="side-stat-pill">
              <span className="side-label">Script LISP</span>
              <strong>450+ Tools</strong>
              <small className="badge-chip">Siap Pakai</small>
            </div>
            <div className="side-stat-pill">
              <span className="side-label">Lisensi CAD</span>
              <strong>100% Resmi</strong>
              <small className="badge-chip">Garansi Penuh</small>
            </div>

            <div className="mockup-ai-card">
              <div className="ai-icon">
                <Sparkles size={16} />
              </div>
              <div className="ai-text">
                <strong>MasterCAD All-in-One</strong>
                <p>4 Layanan dalam satu ekosistem.</p>
              </div>
              <a href="#investasi" className="ai-upgrade-btn">
                Pilih Paket Akses
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Video Demo Modal */}
      {isPlaying && (
        <div className="video-modal-backdrop" onClick={() => setIsPlaying(false)}>
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Preview Materi LMS AutoCAD, Inventor &amp; Script AutoLISP</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsPlaying(false)}
                aria-label="Tutup modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="cad-preview-frame">
                <img
                  src="/assets/engineering-hero.webp"
                  alt="CAD 3D Assembly Simulation"
                  width="1200"
                  height="800"
                />
                <div className="simulation-overlay">
                  <div className="sim-badge">
                    <span className="live-dot" /> 3 LAYANAN UNGGULAN MASTERCAD
                  </div>
                  <div className="sim-stats">
                    <span>1. Database Part &amp; Standar Mesin</span>
                    <span>2. Script Otomasi AutoLISP</span>
                    <span>3. Video LMS AutoCAD &amp; Inventor</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <p>
                  Tingkatkan efisiensi kerja drafting dan kuasai standar teknik mesin industri
                  secara terstruktur bersama MasterCAD.
                </p>
                <a
                  href="/kontak"
                  className="home-button home-button-lime"
                  onClick={() => setIsPlaying(false)}
                >
                  Mulai Akses Sekarang
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
