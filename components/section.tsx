import { cn } from "@/lib/utils";

/**
 * Page section with a decorative chess-coordinate marker in the margin.
 * The marker is aria-hidden — it's a wink, not information.
 */
export function Section({
  square,
  title,
  subtitle,
  children,
  className,
  id,
}: {
  square?: string;
  title: React.ReactNode;
  /** Gray one-liner under the heading. */
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  /** Anchor target for in-page nav (gets scroll margin under the sticky header). */
  id?: string;
}) {
  return (
    <section id={id} className={cn("mb-16 scroll-mt-24", className)}>
      <div className={cn("flex items-baseline gap-3", subtitle ? "mb-1" : "mb-6")}>
        {square && (
          <span aria-hidden="true" className="font-mono text-xs text-faint select-none">
            {square}
          </span>
        )}
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      {subtitle && <p className="mb-6 text-sm text-muted">{subtitle}</p>}
      {children}
    </section>
  );
}
