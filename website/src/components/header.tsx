"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
const nav = [
  ["/layanan", "Layanan"],
  ["/paket", "Paket & Harga"],
  ["/portofolio", "Portofolio"],
  ["/tentang", "Studio"],
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
            {nav.map(([href, label]) => (
              <Link
                aria-current={path.startsWith(href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                key={href}
                href={href}
              >
                {label}
              </Link>
            ))}
            <Link
              className="header-contact"
              href="/kontak"
              onClick={() => setOpen(false)}
            >
              Konsultasi Sekarang
            </Link>
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
