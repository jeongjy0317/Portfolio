import { about } from "../data";
import { Divider, SectionHead } from "./ui";

// About is one static statement — no pinned scroll, no sliding panels. The
// headline and body start right under the section header.
export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="pt-[5.5rem] md:pt-[6.5rem]">
        <Divider />
        <SectionHead n="00" title="About" />
      </div>

      <div className="flex flex-1 flex-col justify-start pt-6 pb-16 pr-6 md:pt-10 md:pr-16">
        <h3 className="m-0 whitespace-pre-line text-[32px] font-extrabold leading-[1.06] tracking-[-.02em] text-ink md:text-[52px]">
          {about.title}
        </h3>
        <div className="mt-8 flex max-w-[62ch] flex-col gap-5 md:mt-11">
          {about.description.map((d, i) => (
            <p key={i} className="m-0 text-[15px] leading-[1.85] text-mute-800">
              {d}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
