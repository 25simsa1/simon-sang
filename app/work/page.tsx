import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { roles } from "@/data/work";
import { pageSquares } from "@/data/site";

export const metadata: Metadata = {
  title: "Work",
  description: "Roles and projects, kept deliberately brief.",
};

/** Circular logo chip; gray monogram fallback when no real mark exists. */
function OrgChip({ org, logo }: { org: string; logo?: string }) {
  if (logo) {
    return (
      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border">
        <Image src={logo} alt={`${org} logo`} fill sizes="36px" className="object-cover" />
      </span>
    );
  }
  const words = org.split(/\s+/);
  // An acronym first word (KU, MIT) is already the monogram.
  const initials = /^[A-Z]{2,3}$/.test(words[0])
    ? words[0]
    : words
        .filter((w) => /^[A-Z]/.test(w))
        .slice(0, 2)
        .map((w) => w[0])
        .join("");
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-bg-elevated font-mono text-xs text-muted"
    >
      {initials || org[0]}
    </span>
  );
}

export default function WorkPage() {
  return (
    <div>
      <PageHero square={pageSquares.work}>
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Work</h1>
        <p className="max-w-xl text-muted">
          Deliberately the least flashy page here. The roles, kept brief. The projects live on the home page.
        </p>
      </PageHero>

      <Reveal>
        <Section square="O-O" title="Roles" className="mb-0">
          <ul className="divide-y divide-border rounded-2xl border border-border">
            {roles.map((role) => (
              <li key={role.org} className="flex gap-4 p-4">
                <OrgChip org={role.org} logo={role.logo} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-sm font-medium">
                      {role.org} · <span className="font-normal text-muted">{role.title}</span>
                    </h3>
                    <p className="font-mono text-xs text-faint">{role.dates}</p>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{role.line}</p>
                  {role.links && (
                    <ul className="mt-2 flex flex-wrap gap-4">
                      {role.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-accent transition-colors duration-200 hover:text-fg"
                          >
                            {link.label}
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </Reveal>

    </div>
  );
}
