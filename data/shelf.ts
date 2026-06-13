/**
 * The Life Shelf on /play: stacked category rows (Books · Music · Games),
 * each with a ★ favorites tab (default) and year tabs with counts.
 * Adding an item is a one-line edit to the right array.
 * - `year` drives the year tabs; `favorite: true` puts it on the ★ tab.
 * - `href` links the cover out (book → Open Library/Goodreads, song → Spotify,
 *   game → the Chess.com game URL).
 * - Covers are local files — don't hotlink CDNs. Books: /public/shelf/books/,
 *   music: /public/shelf/music/. Games without a cover render a board tile.
 */

export type Book = {
  kind: "book";
  title: string;
  author: string;
  year: number;
  favorite?: boolean;
  href?: string;
  note?: string;
  /** Local cover in /public/shelf/books/ (Open Library covers). */
  coverSrc?: string;
};

export type Album = {
  kind: "album";
  title: string;
  artist: string;
  year: number;
  favorite?: boolean;
  href?: string;
  note?: string;
  /** Local album art in /public/shelf/music/ (Spotify oEmbed thumbnails). */
  coverSrc?: string;
};

export type Game = {
  kind: "game";
  title: string;
  /** One-line context shown in the hover tooltip, e.g. the opponent or event. */
  detail: string;
  year: number;
  favorite?: boolean;
  /** Chess.com game URL. */
  href?: string;
  /** Optional thumbnail in /public/shelf/games/ — falls back to a board tile. */
  coverSrc?: string;
};

export type ShelfItem = Book | Album | Game;

/** The platform link shown top-right for each shelf row. */
export const shelfPlatforms: Record<"books" | "music" | "games", { label: string; href: string }> = {
  books: { label: "Goodreads", href: "https://www.goodreads.com/EDIT-ME" }, // EDIT ME: or point at Open Library
  music: { label: "Spotify", href: "https://open.spotify.com/user/EDIT-ME" }, // EDIT ME: your profile
  games: { label: "Chess.com", href: "https://www.chess.com/member/simonschess06" },
};

export const books: Book[] = [
  // Placeholders — swap in what you're actually reading. `year` = when you read it.
  {
    kind: "book",
    title: "Thinking in Bets",
    author: "Annie Duke",
    year: 2026,
    favorite: true,
    note: "decisions vs. outcomes",
    href: "https://openlibrary.org/works/OL19736287W",
    coverSrc: "/shelf/books/thinking-in-bets.jpg",
  },
  {
    kind: "book",
    title: "The Man Who Solved the Market",
    author: "Gregory Zuckerman",
    year: 2026,
    favorite: true,
    href: "https://openlibrary.org/works/OL20787306W",
    coverSrc: "/shelf/books/man-who-solved-the-market.jpg",
  },
  {
    kind: "book",
    title: "Gödel, Escher, Bach",
    author: "Douglas Hofstadter",
    year: 2026,
    favorite: true,
    note: "slowly",
    href: "https://openlibrary.org/works/OL716850W",
    coverSrc: "/shelf/books/godel-escher-bach.jpg",
  },
  {
    kind: "book",
    title: "My 60 Memorable Games",
    author: "Bobby Fischer",
    year: 2025,
    favorite: true,
    href: "https://openlibrary.org/works/OL2714658W",
    coverSrc: "/shelf/books/my-60-memorable-games.jpg",
  },
];

export const albums: Album[] = [
  // Tracks with metadata from Spotify's oEmbed endpoint; covers stored locally.
  {
    kind: "album",
    title: "I Can't Tell You Why - 2013 Remaster",
    artist: "Eagles",
    year: 2026,
    favorite: true,
    href: "https://open.spotify.com/track/02BsTeJE4q5gWOTt58ur5U",
    coverSrc: "/shelf/music/i-cant-tell-you-why.jpg",
  },
  {
    kind: "album",
    title: "I Don't Owe You Anything - 2011 Remaster",
    artist: "The Smiths",
    year: 2026,
    favorite: true,
    href: "https://open.spotify.com/track/4WKdgb3xzbTSU7WT3kK3na",
    coverSrc: "/shelf/music/i-dont-owe-you-anything.jpg",
  },
  {
    kind: "album",
    title: "Lose Control",
    artist: "Omar+, bullet tooth",
    year: 2026,
    favorite: true,
    href: "https://open.spotify.com/track/0vKM6pD1koHLvYzzI5gqNy",
    coverSrc: "/shelf/music/lose-control.jpg",
  },
  {
    kind: "album",
    title: "Thinking Of You",
    artist: "Katy Perry",
    year: 2026,
    favorite: true,
    href: "https://open.spotify.com/track/3c9LVPh3MpeFoaAL5DBDK5",
    coverSrc: "/shelf/music/thinking-of-you.jpg",
  },
  {
    kind: "album",
    title: "Salut d'amour, Op. 12",
    artist: "Edward Elgar (Sueye Park, Love Derwinger)",
    year: 2026,
    favorite: true,
    href: "https://open.spotify.com/track/5yeyZs4KZnvUEGkmVLbRM6",
    coverSrc: "/shelf/music/salut-damour.jpg",
  },
  {
    kind: "album",
    title: "Real Love Baby",
    artist: "Father John Misty",
    year: 2026,
    favorite: true,
    href: "https://open.spotify.com/track/0Z57YWES04xGh3AImDz6Qr",
    coverSrc: "/shelf/music/real-love-baby.jpg",
  },
];

export const games: Game[] = [
  // Real games pulled from the Chess.com archives. Add yours with
  // `npm run fetch-game 2026/05` (lists a month) and paste the URL here.
  {
    kind: "game",
    title: "Peak rating game",
    detail: "win vs akajan1985 · rapid",
    year: 2026,
    favorite: true,
    href: "https://www.chess.com/game/live/169431295844",
  },
  {
    kind: "game",
    title: "Blitz win",
    detail: "vs BoneDryCereal · blitz",
    year: 2023,
    favorite: true,
    href: "https://www.chess.com/game/live/84600753245",
  },
  {
    kind: "game",
    title: "Blitz win, the rematch",
    detail: "vs BoneDryCereal · blitz",
    year: 2023,
    href: "https://www.chess.com/game/live/84600795007",
  },
];
