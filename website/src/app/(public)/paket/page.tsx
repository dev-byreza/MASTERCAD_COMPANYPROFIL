import type { Metadata } from "next";
import { SubscriptionPricing } from "@/components/subscription-pricing";

export const metadata: Metadata = {
  title: "Paket Akses Lifetime · Sekali Bayar Selamanya | MasterCAD",
  description:
    "Pilihan paket akses seumur hidup tanpa biaya langganan bulanan untuk Database Teknik Mesin, Plugin & AutoLISP CAD, dan LMS Kursus AutoCAD & Inventor.",
  alternates: { canonical: "/paket" },
};

export default function PackagesPage() {
  return <SubscriptionPricing />;
}
