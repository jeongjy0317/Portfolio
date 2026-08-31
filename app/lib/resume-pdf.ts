import {
  profile,
  eduMain,
  experienceWork,
  experienceExp,
  projects,
  certsQual,
  certsEtc,
  awards,
  activities,
  activityPeriod,
  publications,
  skills,
} from "../data";

/**
 * Builds 정준영_이력서.pdf with PDFKit, in the browser.
 *
 * The résumé is drawn straight into the PDF as vector text — no DOM node, no
 * canvas, no print dialog — so every line stays selectable, searchable and
 * ATS-parsable, links are real annotations, and the file lands around a tenth
 * of the size of a rasterised capture.
 *
 * Geometry is authored in CSS pixels and converted with `px()`, because the
 * layout this reproduces was originally an off-screen 210mm HTML sheet: at
 * 96dpi that sheet's content column is exactly 4/3 of the A4 content column in
 * points, so every px measurement carries over by a flat ×0.75. Keeping the px
 * numbers makes the two directly comparable.
 *
 * Korean needs an embedded face — PDFKit's built-in fonts are Latin-only. The
 * subsets under public/fonts are produced by scripts/subset-fonts.mjs and cover
 * exactly the characters appearing in data.ts and in this file, so RE-RUN
 * `npm run fonts:subset` after editing résumé copy or a new glyph will drop out:
 * PDFKit prints nothing at all for a codepoint the embedded face lacks, so a
 * stale subset costs whole words silently. `npm run fonts:check` (also run as
 * prebuild) fails loudly on exactly that.
 */

// ---------------------------------------------------------------- geometry
const PT_PER_PX = 72 / 96;
const px = (n: number) => n * PT_PER_PX;
const mm = (n: number) => (n * 72) / 25.4;

const PAGE_W = mm(210);
const PAGE_H = mm(297);
const MARGIN_X = mm(16); // matches the sheet's horizontal padding
const MARGIN_Y = mm(15);

const CONTENT_X = MARGIN_X;
const CONTENT_W = PAGE_W - MARGIN_X * 2;
const BOTTOM = PAGE_H - MARGIN_Y;

const LABEL_W = px(84); // section label gutter
const BODY_X = CONTENT_X + px(106);
const BODY_W = CONTENT_W - px(106);
const META_W = px(120); // right-hand date column inside an item

const C = {
  ink: "#201e1d",
  sub: "#524e48",
  mute: "#8c8880",
  line: "#e2ded8",
};

// ------------------------------------------------------------------ fonts
type Weight = "regular" | "semibold" | "bold" | "extrabold";

const FONT_FILES: Record<Weight, string> = {
  regular: "/fonts/Pretendard-Regular.subset.ttf",
  semibold: "/fonts/Pretendard-SemiBold.subset.ttf",
  bold: "/fonts/Pretendard-Bold.subset.ttf",
  extrabold: "/fonts/Pretendard-ExtraBold.subset.ttf",
};

let fontCache: Promise<Record<Weight, Uint8Array>> | null = null;

function loadFonts() {
  // Cached across clicks: the four subsets are ~70 KB each and never change
  // within a session.
  fontCache ??= (async () => {
    const entries = await Promise.all(
      (Object.keys(FONT_FILES) as Weight[]).map(async (weight) => {
        const res = await fetch(FONT_FILES[weight]);
        if (!res.ok) throw new Error(`폰트를 불러오지 못했습니다: ${FONT_FILES[weight]}`);
        return [weight, new Uint8Array(await res.arrayBuffer())] as const;
      }),
    );
    return Object.fromEntries(entries) as Record<Weight, Uint8Array>;
  })().catch((err) => {
    fontCache = null; // let a later attempt retry rather than latch the failure
    throw err;
  });
  return fontCache;
}

// ------------------------------------------------------------------ styles
interface Style {
  size: number; // CSS px, converted on apply
  weight: Weight;
  line: number; // CSS line-height ratio
  color: string;
  spacing?: number; // letter-spacing as an em ratio
}

const T = {
  h1: { size: 20, weight: "regular", line: 1.45, color: C.sub },
  h1Strong: { size: 20, weight: "extrabold", line: 1.45, color: C.ink },
  label: { size: 12, weight: "bold", line: 1.35, color: C.ink, spacing: -0.01 },
  title: { size: 12.5, weight: "bold", line: 1.4, color: C.ink },
  org: { size: 11, weight: "regular", line: 1.45, color: C.sub },
  detail: { size: 10.5, weight: "regular", line: 1.5, color: C.mute },
  meta: { size: 10.5, weight: "regular", line: 1.5, color: C.mute },
  name: { size: 15, weight: "extrabold", line: 1.3, color: C.ink },
  nameEn: { size: 11, weight: "regular", line: 1.3, color: C.mute, spacing: 0.05 },
  nick: { size: 11, weight: "regular", line: 1.3, color: C.sub },
  contact: { size: 11, weight: "regular", line: 1.5, color: C.sub },
  handle: { size: 11, weight: "semibold", line: 1.5, color: C.ink },
} satisfies Record<string, Style>;

type Doc = PDFKit.PDFDocument;

/** Select a style and translate its CSS line-height into PDFKit's line gap. */
function apply(doc: Doc, s: Style) {
  doc.font(s.weight).fontSize(px(s.size)).fillColor(s.color);
  doc.lineGap(Math.max(0, px(s.size) * s.line - doc.currentLineHeight(false)));
}

const spacingOf = (s: Style) => (s.spacing ? px(s.size) * s.spacing : 0);

function measure(doc: Doc, s: Style, str: string, width: number) {
  apply(doc, s);
  return doc.heightOfString(str, { width, characterSpacing: spacingOf(s) });
}

interface DrawOpts {
  width?: number;
  align?: "left" | "right" | "center";
  link?: string;
  lineBreak?: boolean;
}

/** Draw at an absolute position and report the height consumed. */
function draw(doc: Doc, s: Style, str: string, x: number, y: number, o: DrawOpts = {}) {
  apply(doc, s);
  // A link's clickable rect is sized by the line wrapper, which only runs when
  // a width is given — without one PDFKit writes a NaN rect and refuses to
  // serialise. Fall back to the run's own measured width.
  const width = o.width ?? (o.link ? doc.widthOfString(str) : undefined);
  const opts = {
    width,
    align: o.align,
    characterSpacing: spacingOf(s),
    link: o.link,
    lineBreak: o.lineBreak,
    underline: false,
  };
  doc.text(str, x, y, opts);
  return width === undefined ? doc.currentLineHeight(true) : doc.heightOfString(str, opts);
}

// ------------------------------------------------------------ page cursor
/**
 * Vertical flow with explicit, item-granular page breaks. Nothing is ever cut
 * mid-block: a caller measures a block, asks for room, and only then draws.
 */
class Flow {
  y = MARGIN_Y;
  constructor(readonly doc: Doc) {}

  /** Break to a new page unless `h` still fits — or unless nothing ever would. */
  need(h: number) {
    if (this.y + h <= BOTTOM) return;
    if (h > BOTTOM - MARGIN_Y) return; // taller than a whole page: let it flow
    this.doc.addPage();
    this.y = MARGIN_Y;
  }
}

// -------------------------------------------------------------- primitives
function rule(doc: Doc, y: number) {
  doc
    .save()
    .moveTo(CONTENT_X, y)
    .lineTo(CONTENT_X + CONTENT_W, y)
    .lineWidth(px(1))
    .strokeColor(C.line)
    .stroke()
    .restore();
}

/** Render one 24×24 SVG path (the contact icons) at `size`. */
function icon(doc: Doc, d: string, x: number, y: number, size: number) {
  const k = size / 24;
  doc.save().translate(x, y).scale(k).path(d).fillColor(C.ink).fill().restore();
}

const GITHUB_PATH =
  "M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.24-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.24a11.5 11.5 0 0 1 6 0c2.29-1.56 3.3-1.24 3.3-1.24.66 1.65.24 2.88.12 3.18.77.85 1.24 1.92 1.24 3.24 0 4.63-2.81 5.65-5.49 5.95.43.37.82 1.1.82 2.22 0 1.6-.02 2.9-.02 3.29 0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z";
const LINKEDIN_PATH =
  "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z";

// ------------------------------------------------------------------ blocks
interface ItemData {
  title: string;
  org?: string | null;
  detail?: string | null;
  meta?: string | null;
}

const GAP = px(3); // vertical gap between an item's stacked lines
const ITEM_GAP = px(13); // margin below each item
const SECTION_PAD = px(15); // padding above and below a section body

function itemHeight(doc: Doc, it: ItemData) {
  const w = BODY_W - (it.meta ? META_W : 0);
  let h = measure(doc, T.title, it.title, w);
  if (it.org) h += GAP + measure(doc, T.org, it.org, w);
  if (it.detail) h += GAP + measure(doc, T.detail, it.detail, w);
  return h;
}

function drawItem(f: Flow, it: ItemData) {
  const { doc } = f;
  const w = BODY_W - (it.meta ? META_W : 0);
  let y = f.y;

  y += draw(doc, T.title, it.title, BODY_X, y, { width: w });
  if (it.org) y += GAP + draw(doc, T.org, it.org, BODY_X, y + GAP, { width: w });
  if (it.detail) y += GAP + draw(doc, T.detail, it.detail, BODY_X, y + GAP, { width: w });

  if (it.meta) {
    // The sheet pinned this to the item's top-right; `top: 2px` optically
    // centres it against the title's cap height.
    draw(doc, T.meta, it.meta, BODY_X + BODY_W - META_W, f.y + px(2), {
      width: META_W,
      align: "right",
      lineBreak: false,
    });
  }

  f.y = y + ITEM_GAP;
}

/**
 * A labelled section. `firstH` is the height of whatever the body draws first,
 * so the rule and label can never be stranded at the foot of a page without it.
 */
function section(f: Flow, label: string, firstH: number, body: () => void) {
  const labelH = measure(f.doc, T.label, label, LABEL_W);
  f.need(SECTION_PAD + Math.max(labelH, firstH));

  rule(f.doc, f.y);
  f.y += SECTION_PAD;
  draw(f.doc, T.label, label, CONTENT_X, f.y, { width: LABEL_W });

  body();
  f.y += SECTION_PAD - ITEM_GAP; // the last item already contributed its margin
}

function itemSection(f: Flow, label: string, items: ItemData[]) {
  if (!items.length) return;
  section(f, label, itemHeight(f.doc, items[0]), () => {
    for (const it of items) {
      f.need(itemHeight(f.doc, it));
      drawItem(f, it);
    }
  });
}

// ------------------------------------------------------------------ header
async function drawHeader(f: Flow, photo: ArrayBuffer | null) {
  const { doc } = f;
  const PHOTO = px(132);
  const textW = Math.min(mm(118), CONTENT_W - PHOTO - px(24));
  const top = f.y;

  const lines = ["시스템을 깊이 이해하기 위해", "무너뜨려 보고 더 견고하게 다시 세우는"];
  let y = top;
  for (const line of lines) y += draw(doc, T.h1, line, CONTENT_X, y, { width: textW });

  // Final line mixes weights inline: the role in ExtraBold ink, the copula back
  // in the lighter body colour.
  apply(doc, T.h1Strong);
  doc.text("취약점 분석가 정준영", CONTENT_X, y, { width: textW, continued: true });
  apply(doc, T.h1);
  doc.text("입니다", { width: textW });
  y += doc.currentLineHeight(true);

  y += px(16);
  doc.save().roundedRect(CONTENT_X, y, px(46), px(3), px(1.5)).fillColor(C.ink).fill().restore();
  y += px(3);

  if (photo) {
    const x = CONTENT_X + CONTENT_W - PHOTO;
    const r = PHOTO / 2;
    doc.save().circle(x + r, top + r, r).clip();
    doc.image(photo, x, top, { cover: [PHOTO, PHOTO] });
    doc.restore();
    doc
      .save()
      .circle(x + r, top + r, r)
      .lineWidth(px(1))
      .strokeColor(C.line)
      .stroke()
      .restore();
  }

  f.y = Math.max(y, top + PHOTO) + px(10);
}

// -------------------------------------------------------------- 인적사항
// The sheet laid this out as a 1fr / 1.35fr grid with a 24px gutter.
const PROFILE_GUTTER = px(24);
const PROFILE_COL1 = (BODY_W - PROFILE_GUTTER) / 2.35;
const PROFILE_COL2 = BODY_W - PROFILE_GUTTER - PROFILE_COL1;
const STACK_GAP = px(3); // between the stacked name lines
const CONTACT_GAP = px(5); // between the contact rows

const contactRows = () => [
  `생일 : ${profile.birth}`,
  `메일 : ${profile.email}`,
];

const handleOf = (url: string) => `@${url.split("/").pop()}`;

/** Height of the 인적사항 block, so the section can reserve room before drawing. */
function profileHeight(doc: Doc) {
  const left =
    measure(doc, T.name, profile.nameKo, PROFILE_COL1) +
    STACK_GAP +
    measure(doc, T.nameEn, profile.nameEn.toUpperCase(), PROFILE_COL1) +
    STACK_GAP +
    measure(doc, T.nick, `“${profile.nickname}”`, PROFILE_COL1);

  apply(doc, T.handle);
  const right =
    contactRows().reduce((h, row) => h + measure(doc, T.contact, row, PROFILE_COL2) + CONTACT_GAP, 0) +
    doc.currentLineHeight(false);

  return Math.max(left, right);
}

function drawProfile(f: Flow) {
  const { doc } = f;
  const x2 = BODY_X + PROFILE_COL1 + PROFILE_GUTTER;

  // Left column: name, romanisation, handle.
  let ly = f.y;
  ly += draw(doc, T.name, profile.nameKo, BODY_X, ly, { width: PROFILE_COL1 }) + STACK_GAP;
  ly += draw(doc, T.nameEn, profile.nameEn.toUpperCase(), BODY_X, ly, { width: PROFILE_COL1 }) + STACK_GAP;
  ly += draw(doc, T.nick, `“${profile.nickname}”`, BODY_X, ly, { width: PROFILE_COL1 });

  // Right column: contact rows, then the linked social handles.
  let ry = f.y;
  for (const row of contactRows()) {
    ry += draw(doc, T.contact, row, x2, ry, { width: PROFILE_COL2 }) + CONTACT_GAP;
  }

  const ICON = px(13);
  apply(doc, T.handle);
  const lineH = doc.currentLineHeight(false);
  const iconY = ry + (lineH - ICON) / 2; // centre the icon against the handle
  let x = x2;

  for (const [path, url] of [
    [GITHUB_PATH, profile.githubHref],
    [LINKEDIN_PATH, profile.linkedinHref],
  ] as const) {
    const text = handleOf(url);
    icon(doc, path, x, iconY, ICON);
    x += ICON + px(6);
    apply(doc, T.handle);
    const w = doc.widthOfString(text);
    draw(doc, T.handle, text, x, ry, { link: url, lineBreak: false });
    x += w + px(16);
  }
  ry += lineH;

  f.y = Math.max(ly, ry) + ITEM_GAP;
}

// -------------------------------------------------------------------- main
const join = (parts: (string | null | undefined)[]) => parts.filter(Boolean).join(" · ") || undefined;

async function fetchPhoto() {
  try {
    const res = await fetch("/profile.jpeg");
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null; // the résumé is complete without it; don't fail the download
  }
}

export async function buildResumePdf(): Promise<Blob> {
  const [{ default: PDFDocument }, { toBlob }, fonts, photo] = await Promise.all([
    import("pdfkit"),
    import("pdfkit/output"),
    loadFonts(),
    fetchPhoto(),
  ]);

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: MARGIN_Y, bottom: MARGIN_Y, left: MARGIN_X, right: MARGIN_X },
    // The browser build ships without the standard 14 faces, so PDFKit throws
    // if it tries to install its Helvetica default. Everything here is drawn in
    // Pretendard anyway — start with no font and register ours below.
    font: null as unknown as string,
    info: {
      Title: `${profile.nameKo} (${profile.nameEn}) — 이력서`,
      Author: `${profile.nameKo} (${profile.nameEn})`,
      Subject: profile.eyebrow,
      Keywords: "Vulnerability Analysis, Security, Penetration Testing, 취약점 분석, 정보보호",
      Creator: "portfolio",
    },
    displayTitle: true,
  });

  for (const weight of Object.keys(fonts) as Weight[]) doc.registerFont(weight, fonts[weight]);
  doc.font("regular"); // stand in for the default PDFKit no longer has

  const pending = toBlob(doc);
  const f = new Flow(doc);

  await drawHeader(f, photo);

  section(f, "인적사항", profileHeight(doc), () => drawProfile(f));

  itemSection(
    f,
    "학력사항",
    eduMain.map((e) => ({ title: e.title, org: join([e.place, e.org]), detail: e.points[0], meta: e.period })),
  );
  itemSection(
    f,
    "경력사항",
    [...experienceWork, ...experienceExp].map((e) => ({
      title: e.title,
      org: join([e.org, e.place]),
      detail: e.points[0],
      meta: e.period,
    })),
  );
  itemSection(
    f,
    "프로젝트",
    projects.map((p) => ({ title: p.title, org: p.subtitle, detail: p.points[0], meta: p.period })),
  );
  itemSection(
    f,
    "자격 · 인증",
    [...certsQual, ...certsEtc].map((c) => ({ title: c.title, org: c.issuer, meta: c.date })),
  );
  itemSection(
    f,
    "수상",
    awards.map((a) => ({ title: a.title, org: a.detail, meta: a.date })),
  );
  itemSection(
    f,
    "대외활동",
    activities.map((a) => ({ title: a.title, org: a.team, meta: activityPeriod(a) })),
  );
  itemSection(
    f,
    "논문",
    publications.map((p) => ({ title: p.title, org: p.venue, detail: p.authors })),
  );
  itemSection(
    f,
    "보유기술",
    skills.map((s) => ({ title: s.label, org: s.type === "text" ? s.text : s.tags.join(", ") })),
  );

  doc.end();
  return pending;
}

/** Build the résumé and hand it to the browser as a download. */
export async function downloadResumePdf(filename = `${profile.nameKo}_이력서.pdf`) {
  const blob = await buildResumePdf();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
