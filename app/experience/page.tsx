import { GalleryArticle } from "../components/ui";
import MorphIntro from "../components/MorphIntro";
import { Stagger, StaggerItem } from "../components/motion";
import { experienceWork, experienceExp } from "../data";
import { detailHref } from "../detail";

export const metadata = { title: "Experience — 정준영" };

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-paper">
      <main className="mx-auto max-w-[980px] px-5 pt-16 pb-40 md:px-14">
       <MorphIntro n="02" title="Experience" count={`Employment ${experienceWork.length} · Activities ${experienceExp.length}`}>

        <h2 className="m-0 pt-7 text-[22px] leading-none tracking-[-.02em] text-ink md:text-[24px]">Employment</h2>
        <Stagger>
          {experienceWork.map((e, i) => (
            <StaggerItem key={e.id}>
              <GalleryArticle item={e} titleClass="text-[28px]" padClass={i === 0 ? "pt-7 pb-11" : "py-11"} href={detailHref("experience", e.id)} />
            </StaggerItem>
          ))}
        </Stagger>

        <h2 className="m-0 pt-11 text-[22px] leading-none tracking-[-.02em] text-ink md:text-[24px]">Activities</h2>
        <Stagger>
          {experienceExp.map((e, i) => (
            <StaggerItem key={e.id}>
              <GalleryArticle item={e} titleClass="text-[28px]" padClass={i === 0 ? "pt-7 pb-11" : "py-11"} href={detailHref("experience", e.id)} />
            </StaggerItem>
          ))}
        </Stagger>
       </MorphIntro>
      </main>
    </div>
  );
}
