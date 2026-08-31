import { DetailHeader, GroupLabel, CertArticle } from "../components/ui";
import SwapIn from "../components/SwapIn";
import { Stagger, StaggerItem } from "../components/motion";
import { certsQual, certsEtc } from "../data";
import { detailHref } from "../detail";

export const metadata = { title: "Certifications — 정준영" };

export default function CertificationsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <main className="mx-auto max-w-[900px] px-5 pt-16 pb-40 md:px-14">
       <SwapIn>
        <DetailHeader n="03" title="Certifications" count="Certifications 5 · Courses 2" />

        <GroupLabel className="pt-7 pb-3">Certifications</GroupLabel>
        <Stagger>
          {certsQual.map((c, i) => (
            <StaggerItem key={c.id}><CertArticle cert={c} last={i === certsQual.length - 1} href={detailHref("certifications", c.id)} /></StaggerItem>
          ))}
        </Stagger>

        <GroupLabel className="pt-11 pb-3">Other Coursework</GroupLabel>
        <Stagger>
          {certsEtc.map((c, i) => (
            <StaggerItem key={c.id}><CertArticle cert={c} last={i === certsEtc.length - 1} href={detailHref("certifications", c.id)} /></StaggerItem>
          ))}
        </Stagger>
       </SwapIn>
      </main>
    </div>
  );
}
