# simonsang.com

Personal site for Simon Sang. Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion, light mode by default (dark available via toggle), deployable to Vercel. No CMS — all content lives in typed data files and MDX.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploy

Push to GitHub and import the repo in [Vercel](https://vercel.com/new) — zero config needed. Or `npx vercel` from the repo root.

**Before launch:** replace `public/resume.pdf` (the one in the repo is a placeholder), and search the repo for `EDIT ME` — those are spots intentionally left in your voice (esports takes, the mental-health paragraph, one failure story, your own principles).

## Where everything lives

| What | Where |
|---|---|
| Name, tagline, socials, resume link | `data/site.ts` |
| The "Now" block (update monthly) | `data/now.ts` |
| Roles + project cards | `data/work.ts` |
| Annotated games, puzzle | `data/chess.ts` |
| Live chess ratings + journey | Chess.com API via `lib/chesscom.ts`; build-time snapshot in `data/generated/chess.json` (refreshed by `scripts/fetch-chess-snapshot.js` on `predev`/`prebuild`, kept as fallback when the API is down — rapid pool only, never hardcoded) |
| Books / music / games shelf (+ platform links) | `data/shelf.ts` |
| Lore cards on /play | `data/lore.ts` (placeholder images in `public/lore/`) |
| Favorite quotes on /about | `data/quotes.ts` |
| Esports sections | `data/esports.ts` |
| About-page essay, principles, failures | `data/about.ts` |
| Essays/notes | `content/*.mdx` |
| Footer "changelog" date | `data/generated/changelog.json` — auto-written from the last git commit by `scripts/generate-changelog.js` (runs via `predev`/`prebuild`; don't edit by hand) |

## How to add things

**A book, album, or game** — one line in `data/shelf.ts`. `year` drives the year tabs; `favorite: true` puts it on the default ★ tab; `href` links the cover out; `coverSrc` is a local file (books: `public/shelf/books/`, music: `public/shelf/music/`; games fall back to a board tile):

```ts
{ kind: "book", title: "Title", author: "Author", year: 2026, favorite: true, href: "https://...", coverSrc: "/shelf/books/title.jpg", note: "optional" },
```

**A photo** — drop the file in `public/shelf/` (keep it ≤200KB), then add to `photos` in `data/shelf.ts` with honest alt text:

```ts
{ kind: "photo", src: "/shelf/foo.jpg", alt: "What the photo shows", caption: "optional" },
```

**A chess game** — `npm run fetch-game <chess.com game URL>` prints the PGN from your archives (`npm run fetch-game 2026/05` lists a month's games). Add it to `games` in `data/chess.ts` with SAN moves and annotations keyed by half-move index (0-based, shown after that move is played). Moves are validated by chess.js at render — a typo will throw, loudly, which is the point. Verify first:

```bash
node -e "const {Chess}=require('chess.js');const c=new Chess();['e4','e5'].forEach(m=>c.move(m));console.log('ok')"
```

**The weekly puzzle** — replace `puzzleOfTheWeek` in `data/chess.ts` (FEN + solution in SAN).

**A post** — create `content/my-post.mdx`:

```mdx
---
title: "Title"
date: "2026-07-01"
summary: "One-sentence summary for the index card."
status: "draft"   # or "published"; drafts still render, labeled as drafts
---

Body in MDX.
```

Read time is computed automatically. Posts sort by date, newest first.

## Design notes (so future edits stay coherent)

- **Palette**: gallery colors (adopted from michelle-liu.com) — white canvas + gray ink hierarchy (default light), neutral charcoal (dark). Board green survives only as the link/focus accent. Soft diffuse card shadows via `--shadow-soft` / `.card-soft`. All tokens in `app/globals.css`; components use semantic classes (`text-muted`, `border-border`, `text-accent`), never raw hex.
- **shadcn/ui** is initialized (`components.json`, `components/ui/`). Careful: shadcn's `--muted`/`--accent`/`--border` variables collide with ours by name — `globals.css` resolves this by keeping the site palette as the source of truth and mapping shadcn's semantic tokens (`--primary`, `--popover`, `--ring`, …) onto it. If `npx shadcn add <component>` ever rewrites the `:root`/`.dark` blocks, restore them from git before committing.
- **Chess motif**: coordinate markers per section (decorative, `aria-hidden`), board-pattern fallback tiles for shelf items without artwork, and the accent-green selection highlight. Keep it at this dosage. (The old 8-file board grid and knight-move easter egg retired when the shelf became stacked category rows.)
- **Fonts**: Figtree (via `next/font/google`; the typeface behind michelle-liu.com's "Michelle" font) for prose, Geist Mono for data — dates, ratings, tags, labels. The mono is the "analytical voice"; don't use it for sentences. The old General Sans files remain in `app/fonts/` but are unused.
- **Loading shimmer**: shelf photos render through `components/shimmer-image.tsx` — an elevated-surface sweep until bytes arrive, static block under reduced motion. Use it for any future photo grids instead of raw `next/image`.
- **Footer changelog**: the mono date stamp scrambles on hover (same `use-scramble` engine as the hero). It's the only scramble outside the hero — keep it that way.
- **Custom cursor** (`components/cursor-follower.tsx`): replaces the native pointer — an instant-tracking dot for precision plus a spring-trailing accent ring that grows over interactive elements. The component adds `.custom-cursor` to `<html>` while mounted, and globals.css hides the native cursor only under that class (so touch devices, reduced motion, and JS-off all keep the real pointer). Text fields keep their I-beam; the chessboard keeps its grab cursor.

## Accessibility invariants (don't break these)

- Cards are a single `<Link>`/`<a>` with the stretched-link pattern — no nested interactive elements.
- Nav items are real links (`<Link>`), no JS-only navigation, no artificial delays.
- All text meets WCAG AA 4.5:1 in both themes (`--muted` is the floor; `--faint` is for decorative mono labels only).
- Every animation respects `prefers-reduced-motion` (Framer Motion is wrapped in `MotionConfig reducedMotion="user"`; the hero decode and shelf hover check it separately).
- Focus is always visible: global 2px accent outline with offset.
- One `<h1>` per page; `<main>`, `<nav>`, `<footer>` landmarks; skip link.
- Chess boards and the rating chart have text equivalents (move lists, FEN, sr-only data table).
- Fonts self-hosted via `next/font` — no render-blocking font requests.
