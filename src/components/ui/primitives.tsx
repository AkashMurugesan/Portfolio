import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-line bg-card rounded-xl border p-5 transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}

export function Chip({
  children,
  tone = "neutral",
  active,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "accent" | "success" | "muted";
  active?: boolean;
}) {
  const tones = {
    neutral: "border-line text-muted bg-panel",
    accent: "border-accent/40 text-accent bg-accent-soft",
    success: "border-success/40 text-success bg-success-soft",
    muted: "border-line text-faint bg-transparent border-dashed",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs",
        active ? tones.accent : tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-accent text-white border-transparent hover:opacity-90",
    secondary: "bg-panel border-line text-fg hover:bg-card-hover",
    ghost: "border-transparent text-muted hover:text-fg hover:bg-card-hover",
    danger: "bg-danger-soft border-danger/40 text-danger hover:opacity-90",
  };
  const sizes = { sm: "h-8 px-2.5 text-xs", md: "h-9 px-3.5 text-sm" };
  return (
    <button
      type={type}
      className={cn(
        "focus-visible:outline-accent inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function IconButton({
  label,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "text-faint hover:text-fg hover:bg-card-hover focus-visible:outline-accent inline-flex size-8 items-center justify-center rounded-md transition focus-visible:outline-2 disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="border-line text-muted rounded-xl border border-dashed p-8 text-center text-sm">
      <p className="text-fg font-medium">{title}</p>
      {children ? <div className="mt-2">{children}</div> : null}
    </div>
  );
}
