import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { settings } from "@/lib/content";
export const dynamic = "force-dynamic";
export function generateMetadata() {
  const s = settings();
  return {
    metadataBase: new URL(process.env.APP_URL || "http://127.0.0.1:3000"),
    title: { default: s.seoTitle, template: `%s | ${s.name}` },
    description: s.seoDescription,
    openGraph: {
      siteName: s.name,
      title: s.seoTitle,
      description: s.seoDescription,
      type: "website",
      locale: "id_ID",
    },
  };
}
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
