import type { MetadataRoute } from "next";
import { publicContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.APP_URL || "http://127.0.0.1:3000";
  return [
    "",
    "/tentang",
    "/layanan",
    "/portofolio",
    "/kontak",
    "/privasi",
    ...publicContent("service").map((s) => "/layanan/" + s.slug),
    ...publicContent("portfolio").map((p) => "/portofolio/" + p.slug),
  ].map((path) => ({
    url: origin + path,
    changeFrequency: "weekly",
    priority: path ? 0.7 : 1,
  }));
}
