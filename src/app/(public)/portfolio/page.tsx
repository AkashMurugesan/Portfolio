import type { Metadata } from "next";
import { PortfolioApp } from "@/features/portfolio/components/portfolio-app";
import { getPortfolio } from "@/features/portfolio/data/repository";

export const metadata: Metadata = { title: "Portfolio" };

export default async function PortfolioViewerPage() {
  const portfolio = await getPortfolio();
  return <PortfolioApp initial={portfolio} mode="viewer" />;
}
