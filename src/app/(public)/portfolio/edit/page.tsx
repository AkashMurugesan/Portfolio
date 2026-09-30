import type { Metadata } from "next";
import { PortfolioApp } from "@/features/portfolio/components/portfolio-app";
import { getPortfolio } from "@/features/portfolio/data/repository";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function PortfolioAdminPage() {
  const portfolio = await getPortfolio();
  return <PortfolioApp initial={portfolio} mode="admin" />;
}
