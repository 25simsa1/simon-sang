"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", href: "/" },
  { label: "Play", href: "/play" },
  { label: "Writing", href: "/writing" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[var(--z-nav)] border-b border-border bg-bg/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3 sm:px-8">
        <nav aria-label="Primary">
          {/* Negative margin so the first pill's TEXT (not its padding box)
              sits on the container grid line, aligned with the hero name. */}
          <ul className="-mx-3 flex items-center gap-1 sm:-mx-4">
            {tabs.map((tab) => {
              const active = isActive(pathname, tab.href);
              return (
                <li key={tab.href} className="relative">
                  {/* Real links: navigation fires immediately; the pill just follows. */}
                  <Link
                    href={tab.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative z-10 block rounded-full px-3 py-1.5 text-sm transition-colors duration-200 sm:px-4",
                      active
                        ? "text-fg font-medium"
                        : "text-muted transition-[background-color,color] hover:bg-bg-elevated/70 hover:text-fg"
                    )}
                  >
                    {tab.label}
                  </Link>
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-white/50 bg-bg-elevated/60 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.02)] backdrop-blur-md dark:border-white/10 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.08)]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
