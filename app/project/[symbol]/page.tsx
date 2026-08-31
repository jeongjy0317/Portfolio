import { notFound } from "next/navigation";
import ProjectDetail from "../../components/ProjectDetail";
import { projects } from "../../data";

// Static export: emit one HTML file per project symbol (project.id).
export function generateStaticParams() {
  return projects.map((p) => ({ symbol: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const project = projects.find((p) => p.id === symbol);
  return { title: project ? `${project.title} — 정준영` : "Project — 정준영" };
}

export default async function ProjectPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const idx = projects.findIndex((p) => p.id === symbol);
  if (idx === -1) notFound();

  const project = projects[idx];
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <ProjectDetail
      project={project}
      index={idx + 1}
      total={projects.length}
      prev={prev ? { id: prev.id, title: prev.title } : null}
      next={next ? { id: next.id, title: next.title } : null}
    />
  );
}
