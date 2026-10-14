import type { Metadata } from "next";
import "./globals.css";
import "./landing.css";
import "./home-redesign.css";
export const metadata: Metadata = {
  title: "MasterCAD — CAD & Engineering Design",
  description:
    "Pemodelan CAD, gambar teknik, dan desain mekanikal. Diskusikan kebutuhan desain Anda bersama MasterCAD.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
