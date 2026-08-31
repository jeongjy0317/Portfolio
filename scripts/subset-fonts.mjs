#!/usr/bin/env node
/**
 * Builds the Pretendard subsets that the résumé PDF embeds.
 *
 * PDFKit has no Korean face of its own, so `resume-pdf.ts` fetches a real TTF
 * at generation time. Shipping full Pretendard would mean ~2.7 MB per weight;
 * subsetting to the glyphs the résumé can actually contain brings that down by
 * two orders of magnitude.
 *
 * The coverage set lives in resume-charset.mjs: every character appearing
 * literally in the résumé's source files, plus a Latin/punctuation base. Any
 * Korean glyph the PDF can print must appear in one of those files, so this is
 * exact by construction — but it means RE-RUNNING THIS SCRIPT after editing
 * résumé copy:
 *
 *     npm run fonts:subset
 *
 * Forgetting to is silent at runtime: PDFKit draws nothing for a codepoint the
 * embedded face lacks, so the line simply loses those characters. `npm run
 * fonts:check` (wired into prebuild) catches that before it ships.
 *
 * Requires fonttools (`pip install fonttools`, provides pyftsubset). Output is
 * committed under public/fonts/, so a plain `npm run build` needs no Python.
 */
import { writeFileSync, statSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { OUT_DIR, SRC_DIR, WEIGHTS, resumeCharset, subsetPath } from "./resume-charset.mjs";

const chars = resumeCharset();

// pyftsubset reads the glyph list from a file so we never hit ARG_MAX. Kept
// out of public/ so it is not published alongside the fonts.
const textFile = join(tmpdir(), "resume-subset-chars.txt");
writeFileSync(textFile, [...chars].join(""), "utf8");
console.log(`coverage: ${chars.size} unique characters`);

for (const weight of WEIGHTS) {
  const src = `${SRC_DIR}/Pretendard-${weight}.ttf`;
  const out = subsetPath(weight);
  execFileSync(
    "pyftsubset",
    [
      src,
      `--text-file=${textFile}`,
      `--output-file=${out}`,
      "--layout-features=", // PDFKit applies no OpenType layout here
      "--drop-tables+=DSIG",
      "--no-hinting",
      "--desubroutinize",
      "--name-IDs=*",
      "--recalc-bounds",
    ],
    { stdio: "inherit" },
  );
  const kb = (statSync(out).size / 1024).toFixed(0);
  const before = (statSync(src).size / 1024).toFixed(0);
  console.log(`  ${weight.padEnd(10)} ${before} KB → ${kb} KB`);
}

// Pretendard is SIL OFL 1.1: the licence must travel with any copy we publish.
copyFileSync("Pretendard-1.3.9/LICENSE.txt", `${OUT_DIR}/LICENSE.txt`);
console.log("  LICENSE.txt copied alongside the subsets");
