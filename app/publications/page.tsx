import { PublicationItem } from "../components/ui";
import MorphIntro from "../components/MorphIntro";
import { Stagger, StaggerItem } from "../components/motion";
import { publications } from "../data";
import { detailHref, pubId } from "../detail";

export const metadata = { title: "Publications — 정준영" };

export default function PublicationsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <main className="mx-auto max-w-[980px] px-5 pt-16 pb-40 md:px-14">
       <MorphIntro n="06" title="Publications" count={String(publications.length)}>
        <Stagger>
          {publications.map((p, i) => (
            <StaggerItem key={i}>
              <PublicationItem pub={p} last={i === publications.length - 1} href={detailHref("publications", pubId(i))} />
            </StaggerItem>
          ))}
        </Stagger>
       </MorphIntro>
      </main>
    </div>
  );
}
