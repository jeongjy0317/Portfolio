import { notFound } from "next/navigation";
import DetailView from "../../../components/DetailView";
import { getSectionDetail, sectionDetailParams } from "../../../detail";

// Static export: emit one HTML file per (section, item) across all sections.
export function generateStaticParams() {
  return sectionDetailParams();
}

export async function generateMetadata({ params }: { params: Promise<{ section: string; symbol: string }> }) {
  const { section, symbol } = await params;
  const found = getSectionDetail(section, symbol);
  return { title: found ? `${found.data.title} — 정준영` : "정준영 — Portfolio" };
}

export default async function DetailPage({ params }: { params: Promise<{ section: string; symbol: string }> }) {
  const { section, symbol } = await params;
  const found = getSectionDetail(section, symbol);
  if (!found) notFound();

  return <DetailView data={found.data} prev={found.prev} next={found.next} />;
}
