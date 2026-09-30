"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn, IconButton } from "./primitives";

/** Accessible modal built on the native <dialog> element. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // backdrop click
      }}
      className={cn(
        "border-line bg-panel text-fg m-auto w-[calc(100%-2rem)] rounded-2xl border p-0 shadow-2xl",
        wide ? "max-w-3xl" : "max-w-xl",
      )}
    >
      {open ? (
        <div className="flex max-h-[85vh] flex-col">
          <header className="border-line flex items-start justify-between gap-4 border-b px-5 py-4">
            <div>
              <h2 className="text-base font-semibold">{title}</h2>
              {description ? (
                <p className="text-muted mt-0.5 text-sm">{description}</p>
              ) : null}
            </div>
            <IconButton label="Close" onClick={onClose}>
              <X className="size-4" />
            </IconButton>
          </header>
          <div className="overflow-y-auto px-5 py-4">{children}</div>
        </div>
      ) : null}
    </dialog>
  );
}
