"use client";

import {
  Download,
  ExternalLink,
  FileText,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Chip, cn } from "@/components/ui/primitives";
import { usePortfolio } from "@/features/portfolio/state/portfolio-context";
import { keywordTailor } from "../engine/tailor";
import type { TailoredResume } from "../engine/types";
import { renderResumePdf, resumeFileName } from "../pdf/render";
import { ResumePreview } from "./resume-preview";

const STEPS = ["Job description", "Match report", "Resume PDF"];

export function ResumeGenerator() {
  const { portfolio } = usePortfolio();
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<TailoredResume | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  const step = result ? 2 : 0;

  async function generate(text: string) {
    setError(null);
    setResult(await keywordTailor.tailor(portfolio, text));
  }

  async function withPdf(action: (url: string) => void) {
    if (!result) return;
    setPdfBusy(true);
    setError(null);
    try {
      const blob = await renderResumePdf(result.document);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = URL.createObjectURL(blob);
      action(urlRef.current);
    } catch (err) {
      console.error(err);
      setError("Could not generate the PDF. Please try again.");
    } finally {
      setPdfBusy(false);
    }
  }

  const download = () =>
    withPdf((url) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = resumeFileName(portfolio.profile.name);
      a.click();
    });

  const open = () => withPdf((url) => window.open(url, "_blank", "noopener"));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Resume generator</h2>
        <p className="text-muted mt-1 text-sm">
          Paste a job description. The resume is tailored from portfolio data only —
          skills the JD asks for that aren’t in the portfolio are reported, never added.
        </p>
      </div>

      <ol className="mb-6 flex flex-wrap gap-2" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li
            key={label}
            aria-current={i === step ? "step" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm",
              i <= step
                ? "border-accent/40 bg-accent-soft text-accent"
                : "border-line text-faint",
            )}
          >
            <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
            {label}
          </li>
        ))}
      </ol>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_1fr]">
        <div className="space-y-4">
          <Card>
            <label htmlFor="jd" className="eyebrow">
              Job description
            </label>
            <textarea
              id="jd"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={12}
              placeholder="Paste the full job description here…"
              className="border-line bg-bg placeholder:text-faint focus:border-accent mt-3 w-full rounded-lg border px-3 py-2 text-sm outline-none"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="primary"
                disabled={jd.trim().length < 20}
                onClick={() => generate(jd)}
              >
                <Sparkles className="size-4" /> Tailor resume
              </Button>
              <Button onClick={() => generate("")}>
                <FileText className="size-4" /> General resume
              </Button>
              {result ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setResult(null);
                    setJd("");
                  }}
                >
                  <RotateCcw className="size-4" /> Start over
                </Button>
              ) : null}
            </div>
          </Card>

          {result ? (
            <Card>
              <p className="eyebrow">Match report</p>
              {result.report.matched.length + result.report.missing.length === 0 ? (
                <p className="text-muted mt-3 text-sm">
                  General resume — no JD keywords to match. Featured projects are used.
                </p>
              ) : (
                <>
                  <div className="mt-3 flex items-end gap-3">
                    <p className="font-mono text-3xl font-semibold">
                      {result.report.score}%
                    </p>
                    <p className="text-muted pb-1 text-sm">
                      of the JD’s skills are backed by your portfolio
                    </p>
                  </div>
                  <div className="bg-line mt-3 h-1.5 overflow-hidden rounded-full">
                    <div
                      className="bg-success h-full rounded-full"
                      style={{ width: `${result.report.score}%` }}
                    />
                  </div>
                  <p className="eyebrow mt-5 mb-2">Matched — emphasized in the resume</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.report.matched.map((m) => (
                      <Chip key={m} tone="success">
                        {m}
                      </Chip>
                    ))}
                  </div>
                  {result.report.missing.length > 0 ? (
                    <>
                      <p className="eyebrow mt-5 mb-2">
                        Asked for, not in portfolio — not added
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.report.missing.map((m) => (
                          <Chip key={m} tone="muted">
                            {m}
                          </Chip>
                        ))}
                      </div>
                    </>
                  ) : null}
                </>
              )}
            </Card>
          ) : null}
        </div>

        <div>
          {result ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="eyebrow">Preview</p>
                <div className="flex gap-2">
                  <Button onClick={open} disabled={pdfBusy}>
                    <ExternalLink className="size-4" /> Open PDF
                  </Button>
                  <Button variant="primary" onClick={download} disabled={pdfBusy}>
                    {pdfBusy ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Download className="size-4" />
                    )}
                    Download PDF
                  </Button>
                </div>
              </div>
              {error ? (
                <p role="alert" className="text-danger text-sm">
                  {error}
                </p>
              ) : null}
              <ResumePreview doc={result.document} />
            </div>
          ) : (
            <div className="border-line text-muted flex h-full min-h-64 items-center justify-center rounded-xl border border-dashed p-8 text-center text-sm">
              Your tailored resume preview will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
