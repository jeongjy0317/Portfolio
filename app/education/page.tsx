import { GalleryArticle, GroupLabel } from "../components/ui";
import MorphIntro from "../components/MorphIntro";
import { Stagger, StaggerItem } from "../components/motion";
import { eduMain, eduCyberTraining, eduKeris } from "../data";
import { detailHref } from "../detail";

export const metadata = { title: "Education — 정준영" };

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-paper">
      <main className="mx-auto max-w-[980px] px-5 pt-16 pb-40 md:px-14">
       <MorphIntro n="04" title="Education" count={String(eduMain.length + eduCyberTraining.length + eduKeris.length)}>

        <Stagger>
          {eduMain.map((e) => (
            <StaggerItem key={e.id}><GalleryArticle item={e} titleClass="text-[28px]" href={detailHref("education", e.id)} /></StaggerItem>
          ))}
        </Stagger>

        <GroupLabel count={`${eduCyberTraining.length}개 과정`}>사이버안전훈련센터</GroupLabel>
        <Stagger>
          {eduCyberTraining.map((e, i) => (
            <StaggerItem key={e.id}>
              <GalleryArticle item={e} headingAs="h3" hideOrg titleClass="text-[26px]" padClass={i === 0 ? "pt-7 pb-11" : "py-11"} href={detailHref("education", e.id)} />
            </StaggerItem>
          ))}
        </Stagger>

        <GroupLabel count={`${eduKeris.length}개 과정`}>공주대학교 정보보호영재교육원</GroupLabel>
        <Stagger>
          {eduKeris.map((e, i) => (
            <StaggerItem key={e.id}>
              <GalleryArticle item={e} headingAs="h3" hideOrg titleClass="text-[26px]" padClass={i === 0 ? "pt-7 pb-11" : "py-11"} href={detailHref("education", e.id)} />
            </StaggerItem>
          ))}
        </Stagger>
       </MorphIntro>
      </main>
    </div>
  );
}
