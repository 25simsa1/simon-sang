import { cn } from "@/lib/utils";

/**
 * Full-bleed hero band, adapted from michelle-liu.com's gradient page header:
 * an animated green aurora settling into the page background, with a film-grain
 * overlay. Pages pass their h1 and lede as children so the heading hierarchy
 * stays in the page's own markup.
 */
export function PageHero({
  square,
  children,
  className,
}: {
  square?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="hero-gradient grain relative left-1/2 -mt-12 mb-12 w-screen -translate-x-1/2">
      <div className={cn("mx-auto max-w-4xl px-5 pb-10 pt-16 sm:px-8", className)}>
        {square && (
          <p aria-hidden="true" className="mb-4 font-mono text-xs text-faint select-none">
            {square}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
