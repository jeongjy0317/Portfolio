import { GalleryArticle } from "../components/ui";
import MorphIntro from "../components/MorphIntro";
import { Stagger, StaggerItem } from "../components/motion";
import { activities, activityPeriod } from "../data";
import { detailHref, activityId } from "../detail";

export const metadata = { title: "Activities — 정준영" };

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-paper">
      <main className="mx-auto max-w-[980px] px-5 pt-16 pb-40 md:px-14">
       <MorphIntro n="08" title="Activities" count={String(activities.length)}>
        <Stagger>
          {activities.map((a, i) => (
            <StaggerItem key={i}>
              {/* Activity → GalleryItem: date becomes the eyebrow, team the subtitle. */}
              <GalleryArticle
                item={{ period: activityPeriod(a), title: a.title, subtitle: a.team, images: a.images, points: a.points }}
                titleClass="text-[26px] md:text-[28px]"
                href={detailHref("activities", activityId(i))}
              />
            </StaggerItem>
          ))}
        </Stagger>
       </MorphIntro>
      </main>
    </div>
  );
}
