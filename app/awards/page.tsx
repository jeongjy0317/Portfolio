import { AwardArticle } from "../components/ui";
import MorphIntro from "../components/MorphIntro";
import { Stagger, StaggerItem } from "../components/motion";
import { awards } from "../data";
import { detailHref, awardId } from "../detail";

export const metadata = { title: "Awards — 정준영" };

export default function AwardsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <main className="mx-auto max-w-[980px] px-5 pt-16 pb-40 md:px-14">
       <MorphIntro n="05" title="Awards" count={String(awards.length)}>
        <Stagger>
          {awards.map((a, i) => (
            <StaggerItem key={i}>
              <AwardArticle award={a} last={i === awards.length - 1} href={detailHref("awards", awardId(i))} />
            </StaggerItem>
          ))}
        </Stagger>
       </MorphIntro>
      </main>
    </div>
  );
}
