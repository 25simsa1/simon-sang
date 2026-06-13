import { site } from "@/data/site";
import { ChangelogLink } from "@/components/changelog-link";
import { LocalTime } from "@/components/local-time";
import changelog from "@/data/generated/changelog.json";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-4xl px-5 py-8 text-sm text-muted sm:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.location}
          </p>
          <ul className="flex gap-4">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="transition-colors duration-200 hover:text-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-sm">
          Got an edge worth discussing?{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-accent underline underline-offset-4 transition-colors duration-200 hover:text-fg"
          >
            Let&rsquo;s work together
          </a>
          .
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-xs text-faint">
            Built with Next.js &amp;{" "}
            <a
              href="https://en.wikipedia.org/wiki/Lapsang_souchong"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-muted underline underline-offset-2 transition-colors duration-200 hover:text-accent"
            >
              lapsang souchong
            </a>
            . <span aria-hidden="true">☕︎</span>
          </p>
          <div className="flex items-baseline gap-4">
            <LocalTime city="Waterville" timeZone="America/New_York" />
            <ChangelogLink date={changelog.lastUpdated} />
          </div>
        </div>
      </div>
    </footer>
  );
}
