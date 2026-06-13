"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ShimmerImage } from "@/components/shimmer-image";
import { books, albums, games, shelfPlatforms, type ShelfItem } from "@/data/shelf";
import { cn } from "@/lib/utils";

/**
 * The Life Shelf: stacked category rows (Books · Music · Games), each with a
 * ★ favorites tab (default) and year tabs with counts, the platform link
 * top-right, and a row of covers. Covers carry no labels — title and
 * author/artist live in the hover tooltip and the image alt text, and each
 * cover is a single link out. Tabs follow the WAI-ARIA pattern: arrow keys
 * move and select, focus ring stays visible.
 */

type Filter = "favorites" | number;

type RowConfig = {
  key: "books" | "music" | "games";
  title: string;
  items: ShelfItem[];
};

const ROWS: RowConfig[] = [
  { key: "books", title: "Books", items: books },
  { key: "music", title: "Music", items: albums },
  { key: "games", title: "Games", items: games },
];

function itemTooltip(item: ShelfItem): string {
  if (item.kind === "book") return `${item.title} · ${item.author}${item.note ? ` (${item.note})` : ""}`;
  if (item.kind === "album") return `${item.title} · ${item.artist}`;
  return `${item.title} · ${item.detail}`;
}

function coverAlt(item: ShelfItem): string {
  if (item.kind === "book") return `Book cover of ${item.title}`;
  if (item.kind === "album") return `Album cover for ${item.title}`;
  return `Chess game: ${item.title}, ${item.detail}`;
}

function Cover({ item }: { item: ShelfItem }) {
  const aspect = item.kind === "book" ? "aspect-[2/3]" : "aspect-square";
  const body = item.coverSrc ? (
    <ShimmerImage
      src={item.coverSrc}
      alt={coverAlt(item)}
      fill
      sizes="(max-width: 640px) 33vw, 170px"
      className="object-cover"
    />
  ) : (
    // Board-pattern fallback tile for items without artwork (mostly games).
    <span
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center text-2xl"
      style={{
        backgroundImage:
          "repeating-conic-gradient(var(--bg-elevated) 0% 25%, var(--bg) 0% 50%)",
        backgroundSize: "50% 50%",
      }}
    >
      {item.kind === "game" ? "♞" : "♪"}
    </span>
  );

  const frame = cn(
    "relative block overflow-hidden rounded-xl border border-border bg-bg-elevated transition-transform duration-300 hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:transform-none",
    aspect
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        title={itemTooltip(item)}
        aria-label={itemTooltip(item)}
        className={frame}
      >
        {body}
        {!item.coverSrc && <span className="sr-only">{coverAlt(item)}</span>}
      </a>
    );
  }
  return (
    <span title={itemTooltip(item)} className={frame}>
      {body}
      <span className="sr-only">{coverAlt(item)}</span>
    </span>
  );
}

function ShelfRow({ row }: { row: RowConfig }) {
  const [filter, setFilter] = useState<Filter>("favorites");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const years = [...new Set(row.items.map((i) => i.year))].sort((a, b) => b - a);
  const favorites = row.items.filter((i) => i.favorite);
  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "favorites", label: `★ ${row.title}`, count: favorites.length },
    ...years.map((y) => ({
      key: y as Filter,
      label: String(y),
      count: row.items.filter((i) => i.year === y).length,
    })),
  ];
  const items = filter === "favorites" ? favorites : row.items.filter((i) => i.year === filter);
  const platform = shelfPlatforms[row.key];
  const selectedIdx = tabs.findIndex((t) => t.key === filter);

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (idx + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    setFilter(tabs[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label={`${row.title} filter`} className="flex flex-wrap items-center gap-1">
          {tabs.map((tab, idx) => {
            const active = filter === tab.key;
            return (
              <span key={String(tab.key)} className="relative">
                <button
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`${row.key}-panel`}
                  tabIndex={idx === selectedIdx ? 0 : -1}
                  onClick={() => setFilter(tab.key)}
                  onKeyDown={(e) => onKeyDown(e, idx)}
                  className={cn(
                    "relative z-10 cursor-pointer rounded-full px-3 py-1.5 text-sm transition-colors duration-200",
                    active ? "font-medium text-fg" : "text-muted hover:text-fg"
                  )}
                >
                  {tab.label} <span className="text-xs text-muted">({tab.count})</span>
                </button>
                {active && (
                  <motion.span
                    layoutId={`shelf-pill-${row.key}`}
                    className="absolute inset-0 rounded-full border border-white/50 bg-bg-elevated/60 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.02)] backdrop-blur-md dark:border-white/10 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.08)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    aria-hidden="true"
                  />
                )}
              </span>
            );
          })}
        </div>
        <a
          href={platform.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-mono text-xs text-muted transition-colors duration-200 hover:text-accent"
        >
          {platform.label}
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>

      <div id={`${row.key}-panel`} role="tabpanel" className="mt-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={String(filter)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="grid grid-cols-3 gap-3 sm:grid-cols-5"
          >
            {items.map((item, i) => (
              <li key={`${item.title}-${i}`}>
                <Cover item={item} />
              </li>
            ))}
            {items.length === 0 && (
              <li className="col-span-full rounded-lg border border-dashed border-border p-4 text-sm text-muted">
                Nothing here yet.
              </li>
            )}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ShelfRows() {
  return (
    <div className="space-y-10">
      {ROWS.map((row) => (
        <ShelfRow key={row.key} row={row} />
      ))}
    </div>
  );
}
