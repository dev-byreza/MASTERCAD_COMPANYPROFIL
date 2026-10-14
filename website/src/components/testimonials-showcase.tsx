import { Star, ShieldCheck } from "lucide-react";

const stories = [
  {
    name: "Ir. Hendra Pratama",
    role: "Senior Mechanical Engineer, PT Rekayasa Industri",
    quote:
      "Database teknik mesin MasterCAD sangat komprehensif. Mulai dari tabel toleransi ISO, standar ulir, hingga katalog bearing sangat presisi dan menghemat waktu kalkulasi desain kami.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    name: "Dimas Anggara",
    role: "Lead CAD Drafter, Studio Fabrikasi Logam",
    quote:
      "Plugin dan script AutoLISP dari MasterCAD luar biasa membantu! Penomoran balon part dan pembuatan tabel BOM yang biasanya makan waktu berjam-jam kini selesai dalam hitungan detik.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    name: "Siti Rahmawati, S.T.",
    role: "Alumni LMS & Junior Design Engineer",
    quote:
      "Materi LMS CAD benar-benar terstruktur dari nol sampai proyek assembly 3D industri nyata. Tutorialnya to the point, file latihannya lengkap, dan ada sertifikatnya.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    name: "Aris Pratama, S.Ars.",
    role: "Principal Architect & 3D Visualizer, Studio Graha",
    quote:
      "Aktivasi lisensi resmi SketchUp Pro dan AutoCAD lewat MasterCAD sangat cepat dan aman. Dukungan timnya ramah saat setup, tanpa kendala lisensi terblokir atau resiko crack lagi.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
];

export function TestimonialsShowcase() {
  return (
    <section className="home-section testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <div>
            <span className="home-eyebrow">TESTIMONIALS / FEEDBACK ANGGOTA</span>
            <h2>Cerita Sukses Komunitas MasterCAD</h2>
          </div>
          <p>
            Dipercaya oleh ribuan drafter, engineer mekanikal, mahasiswa teknik, dan industri manufaktur di seluruh Indonesia.
          </p>
        </div>

        <div className="testimonials-grid">
          {stories.map((story) => (
            <div key={story.name} className="testimonial-card">
              <div className="stars-row">
                {[...Array(story.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="#ccff00"
                    stroke="#ccff00"
                    className="star-icon"
                  />
                ))}
              </div>

              <blockquote className="testimonial-quote">
                &ldquo;{story.quote}&rdquo;
              </blockquote>

              <div className="testimonial-author">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="author-avatar"
                  width="44"
                  height="44"
                  loading="lazy"
                />
                <div className="author-meta">
                  <div className="author-name-row">
                    <strong>{story.name}</strong>
                    <ShieldCheck size={14} className="verified-icon" />
                  </div>
                  <span>{story.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
