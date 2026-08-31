import { SkillRow } from "../components/ui";
import MorphIntro from "../components/MorphIntro";
import { Stagger, StaggerItem } from "../components/motion";
import { skills } from "../data";
import { detailHref, skillId } from "../detail";

export const metadata = { title: "Skills — 정준영" };

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <main className="mx-auto max-w-[980px] px-5 pt-16 pb-40 md:px-14">
       <MorphIntro n="07" title="Skills" count={String(skills.length)}>
        <Stagger>
          {skills.map((s, i) => (
            <StaggerItem key={s.label}>
              <SkillRow skill={s} last={i === skills.length - 1} href={detailHref("skills", skillId(s.label))} />
            </StaggerItem>
          ))}
        </Stagger>
       </MorphIntro>
      </main>
    </div>
  );
}
