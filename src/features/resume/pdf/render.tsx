import type { ResumeDocument } from "../engine/types";

/** Renders the resume to a PDF blob. The PDF library is loaded only on demand. */
export async function renderResumePdf(doc: ResumeDocument): Promise<Blob> {
  const [{ pdf }, { ResumePdf }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./resume-pdf"),
  ]);
  return pdf(<ResumePdf doc={doc} />).toBlob();
}

export function resumeFileName(name: string): string {
  return `${name.trim().replace(/\s+/g, "_")}_Resume.pdf`;
}
