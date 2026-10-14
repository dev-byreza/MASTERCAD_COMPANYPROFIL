import { publicContent } from "@/lib/content";
import { PageHeading } from "@/components/page-heading";
import { PortfolioFilter } from "@/components/portfolio-filter";
export const metadata = {
  title: "Portofolio",
  alternates: { canonical: "/portofolio" },
};
export default function Portfolio() {
  return (
    <main id="main" className="container page-content">
      <PageHeading
        label="PORTOFOLIO / FORM & FUNCTION"
        title="Bentuk. Fungsi. Detail."
        description="Eksplorasi desain dan pemodelan. Karya studi konsep diberi label untuk membedakannya dari proyek pelanggan."
      />
      <PortfolioFilter items={publicContent("portfolio")} />
    </main>
  );
}
