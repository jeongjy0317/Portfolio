// Ambient declaration so standalone `tsc` accepts global stylesheet imports
// (Next.js handles this during `next build`, but plain tsc needs the hint).
declare module "*.css";

// `pdfkit/output` ships with pdfkit but isn't covered by @types/pdfkit.
declare module "pdfkit/output" {
  function toBlob(document: PDFKit.PDFDocument): Promise<Blob>;
  function toBytes(document: PDFKit.PDFDocument): Promise<Uint8Array>;
  export { toBlob, toBytes };
}
