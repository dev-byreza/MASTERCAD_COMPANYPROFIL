"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
const nav = [
  { id: "layanan", label: "Layanan" },
  { id: "investasi", label: "Paket & Harga" },
  { id: "karya", label: "Portofolio" },
  { id: "studio", label: "Studio" },
];
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <>
      <a className="skip-link" href="#main">
        Lewati ke konten
      </a>
      <header className={`site-header${path === "/" ? " landing-header" : ""}`}>
        <div className="container header-inner">
          <Link href="/" className="wordmark" aria-label="MasterCAD beranda">
            <img
              src="/assets/logo-horizontal-white.png"
              alt="MasterCAD"
              width="184"
              height="61"
            />
          </Link>
          <nav
            className={open ? "main-nav open" : "main-nav"}
            aria-label="Navigasi utama"
          >
            {nav.map(({ id, label }) => (
              <a
                href={path === "/" ? `#${id}` : `/#${id}`}
                onClick={() => setOpen(false)}
                key={id}
              >
                {label}
              </a>
            ))}
            <a
              className="header-contact"
              href={path === "/" ? "#kontak" : "/#kontak"}
              onClick={() => setOpen(false)}
            >
              Konsultasi Sekarang
            </a>
          </nav>
          <button
            className="menu-toggle"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>
    </>
  );
}
