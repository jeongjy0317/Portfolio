/**
 * The one definition of what the résumé PDF can print.
 *
 * Both the subsetter (subset-fonts.mjs) and the guard (check-font-coverage.mjs)
 * read the character set from here, so the font that ships and the font the
 * guard checks can never drift apart.
 */
import { readFileSync } from "node:fs";

export const SRC_DIR = "Pretendard-1.3.9/public/static/alternative";
export const OUT_DIR = "public/fonts";

// Weights the résumé layout actually asks for — see FONTS in app/lib/resume-pdf.ts.
export const WEIGHTS = ["Regular", "SemiBold", "Bold", "ExtraBold"];

// Files whose literal contents define the printable glyph set.
export const CONTENT_FILES = ["app/data.ts", "app/lib/resume-pdf.ts"];

export const subsetPath = (weight) => `${OUT_DIR}/Pretendard-${weight}.subset.ttf`;

/** Every character the résumé may print, as a Set of single-character strings. */
export function resumeCharset() {
  const chars = new Set();

  // Base: printable ASCII + Latin-1 accents, so any Latin edit stays renderable.
  for (let c = 0x20; c <= 0x7e; c++) chars.add(String.fromCodePoint(c));
  for (let c = 0xa0; c <= 0xff; c++) chars.add(String.fromCodePoint(c));
  // Punctuation the layout and copy lean on (bullets, dashes, quotes, brackets).
  // Every character here must exist in Pretendard itself — U+2219/U+22C5 used to
  // sit in this list and Pretendard has no glyph for either, so the subsetter
  // silently dropped them and the coverage guard could never go green.
  for (const c of "·—–…‘’“”「」『』〈〉《》【】※→←↔•‧℃％±×÷≤≥≠€₩") chars.add(c);

  for (const file of CONTENT_FILES) {
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch (e) {
      if (e.code === "ENOENT") {
        console.warn(`  ! ${file} not found — skipping`);
        continue;
      }
      throw e;
    }
    for (const c of text) chars.add(c);
  }

  for (const c of "\n\r\t") chars.delete(c);
  return chars;
}
