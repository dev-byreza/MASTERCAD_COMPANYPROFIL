import Link from "next/link";
import { settings } from "@/lib/content";
export function Footer() {
  const s = settings();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <span className="footer-mark">MASTERCAD</span>
            <p>CAD & ENGINEERING DESIGN</p>
          </div>
          <div className="footer-nav">
            <Link href="/layanan">Layanan</Link>
            <Link href="/portofolio">Portofolio</Link>
            <Link href="/kontak">Konsultasi</Link>
          </div>
          <div className="footer-note">
            <p>
              Ide yang jelas.
              <br />
              Desain yang terukur.
            </p>
            {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {s.name}
          </span>
          <div>
            <Link href="/privasi">Privasi</Link>
            <Link href="/admin">Admin</Link>
            <span>INDONESIA · GMT+8</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
