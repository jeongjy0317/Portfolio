#!/usr/bin/env node
/**
 * Fails the build when a résumé character has no glyph in the shipped subsets.
 *
 * PDFKit draws *nothing* for a codepoint the embedded face lacks — no notdef
 * box, no warning — so a stale subset shows up as words silently missing from
 * the downloaded PDF. This turns that into a loud build error.
 *
 * Deliberately dependency-free (its own cmap reader, no fontkit): the guard has
 * to keep working even when node_modules is a fresh, differently-hoisted tree.
 */
import { readFileSync } from "node:fs";
import { SRC_DIR, WEIGHTS, resumeCharset, subsetPath } from "./resume-charset.mjs";

/** Codepoints a TrueType file maps to a glyph, read straight out of its cmap. */
function characterSet(path) {
  const buf = readFileSync(path);
  const numTables = buf.readUInt16BE(4);
  let cmapOff = 0;
  for (let i = 0; i < numTables; i++) {
    const rec = 12 + i * 16;
    if (buf.toString("latin1", rec, rec + 4) === "cmap") cmapOff = buf.readUInt32BE(rec + 8);
  }
  if (!cmapOff) throw new Error(`${path}: no cmap table`);

  const codes = new Set();
  const numSub = buf.readUInt16BE(cmapOff + 2);
  for (let i = 0; i < numSub; i++) {
    const sub = cmapOff + buf.readUInt32BE(cmapOff + 4 + i * 8 + 4);
    const format = buf.readUInt16BE(sub);
    if (format === 4) {
      const segX2 = buf.readUInt16BE(sub + 6);
      const ends = sub + 14;
      const starts = ends + segX2 + 2;
      const deltas = starts + segX2;
      const ranges = deltas + segX2;
      for (let s = 0; s < segX2 / 2; s++) {
        const end = buf.readUInt16BE(ends + s * 2);
        const start = buf.readUInt16BE(starts + s * 2);
        if (start > end || start === 0xffff) continue;
        const delta = buf.readInt16BE(deltas + s * 2);
        const rangeOff = buf.readUInt16BE(ranges + s * 2);
        for (let c = start; c <= end; c++) {
          let gid;
          if (rangeOff === 0) {
            gid = (c + delta) & 0xffff;
          } else {
            const gi = ranges + s * 2 + rangeOff + (c - start) * 2;
            if (gi + 1 >= buf.length) continue;
            gid = buf.readUInt16BE(gi);
            if (gid !== 0) gid = (gid + delta) & 0xffff;
          }
          if (gid !== 0) codes.add(c);
        }
      }
    } else if (format === 6) {
      const first = buf.readUInt16BE(sub + 6);
      const count = buf.readUInt16BE(sub + 8);
      for (let c = 0; c < count; c++) {
        if (buf.readUInt16BE(sub + 10 + c * 2) !== 0) codes.add(first + c);
      }
    } else if (format === 12) {
      const nGroups = buf.readUInt32BE(sub + 12);
      for (let g = 0; g < nGroups; g++) {
        const rec = sub + 16 + g * 12;
        const start = buf.readUInt32BE(rec);
        const end = buf.readUInt32BE(rec + 4);
        const gid = buf.readUInt32BE(rec + 8);
        for (let c = start; c <= end; c++) if (gid + (c - start) !== 0) codes.add(c);
      }
    }
  }
  return codes;
}

const want = resumeCharset();
const missingByWeight = new Map();
let failed = false;

for (const weight of WEIGHTS) {
  const path = subsetPath(weight);
  let covered;
  try {
    covered = characterSet(path);
  } catch (e) {
    console.error(`✗ ${path}: ${e.message}`);
    failed = true;
    continue;
  }
  const missing = [...want].filter((c) => !covered.has(c.codePointAt(0)));
  if (missing.length) {
    failed = true;
    missingByWeight.set(weight, missing);
    console.error(`✗ ${path} is missing ${missing.length} character(s): ${missing.join(" ")}`);
  } else {
    console.log(`✓ ${weight.padEnd(10)} covers all ${want.size} characters`);
  }
}

if (failed) {
  // A character the *full* face lacks can never be subsetted in — re-running the
  // subsetter would not help, so call that case out separately.
  const unsupported = new Set();
  for (const [weight, missing] of missingByWeight) {
    let full;
    try {
      full = characterSet(`${SRC_DIR}/Pretendard-${weight}.ttf`);
    } catch {
      continue; // source face not checked out; treat every miss as staleness
    }
    for (const c of missing) if (!full.has(c.codePointAt(0))) unsupported.add(c);
  }

  if (unsupported.size) {
    console.error(
      `\nPretendard 자체에 글리프가 없는 글자입니다: ${[...unsupported].join(" ")}\n` +
        "서브셋을 다시 만들어도 복구되지 않으니, 다른 문자로 바꿔주세요.",
    );
  }
  console.error(
    "\n이력서 PDF에서 위 글자들이 통째로 사라집니다 (PDFKit은 없는 글리프를 조용히 건너뜁니다).\n" +
      "résumé 문구를 고친 뒤 서브셋을 다시 만드세요:\n\n    npm run fonts:subset\n",
  );
  process.exit(1);
}
