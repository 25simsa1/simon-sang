import snapshot from "@/data/generated/chess.json";

/**
 * Chess.com live data (rapid pool only — one number, one labeled pool).
 * Stats re-fetch at most daily via ISR; any failure falls back to the
 * build-time snapshot written by scripts/fetch-chess-snapshot.js, so the
 * page renders real (if slightly stale) numbers rather than breaking.
 * The journey chart reads the snapshot directly: it moves monthly at most,
 * and rebuilding it live would cost one fetch per archive month.
 */

export const chessUsername = snapshot.username;
export const chessProfileUrl = `https://www.chess.com/member/${chessUsername}`;

export type RapidStats = {
  current: number;
  best: number | null;
  bestGameUrl: string | null;
  /** False when serving the build-time snapshot instead of a live response. */
  live: boolean;
};

export type JourneyPoint = { month: string; rating: number };

export async function getRapidStats(): Promise<RapidStats> {
  try {
    const res = await fetch(`https://api.chess.com/pub/player/${chessUsername}/stats`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(`stats ${res.status}`);
    const stats = await res.json();
    const rapid = stats.chess_rapid;
    if (!rapid?.last?.rating) throw new Error("no rapid stats");
    return {
      current: rapid.last.rating,
      best: rapid.best?.rating ?? null,
      bestGameUrl: rapid.best?.game ?? null,
      live: true,
    };
  } catch {
    return { ...snapshot.rapid, live: false };
  }
}

export function getRapidJourney(): JourneyPoint[] {
  return snapshot.journey;
}
