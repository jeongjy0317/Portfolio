import { GalleryArticle } from "../components/ui";
import MorphIntro from "../components/MorphIntro";
import { Stagger, StaggerItem } from "../components/motion";
import { projects } from "../data";

export const metadata = { title: "Projects — 정준영" };

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <main className="mx-auto max-w-[980px] px-5 pt-16 pb-40 md:px-14">
       <MorphIntro n="01" title="Projects" count="4">
        <Stagger>
          {projects.map((p) => (
            <StaggerItem key={p.id}><GalleryArticle item={p} href={`/project/${p.id}/`} /></StaggerItem>
          ))}
        </Stagger>
       </MorphIntro>
      </main>
    </div>
  );
}
