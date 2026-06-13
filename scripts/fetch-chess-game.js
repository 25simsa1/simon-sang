/**
 * Fetch one of your Chess.com games as PGN, ready to annotate in data/chess.ts.
 *
 *   npm run fetch-game https://www.chess.com/game/live/169431295844
 *   npm run fetch-game 2023/07        (lists that month's games with URLs)
 *
 * Searches your public archives — no auth needed.
 */
const USERNAME = "simonschess06";
const BASE = `https://api.chess.com/pub/player/${USERNAME}`;

async function getJSON(url) {
  const res = await fetch(url, { headers: { "User-Agent": "simonsang.com fetch-game script" } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.json();
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("usage: npm run fetch-game <game URL | YYYY/MM>");
    process.exit(1);
  }

  if (/^\d{4}\/\d{2}$/.test(arg)) {
    const { games } = await getJSON(`${BASE}/games/${arg}`);
    for (const g of games ?? []) {
      const date = new Date(g.end_time * 1000).toISOString().slice(0, 10);
      console.log(`${date}  ${g.time_class.padEnd(6)}  ${g.white.username} vs ${g.black.username}  ${g.url}`);
    }
    return;
  }

  const { archives } = await getJSON(`${BASE}/games/archives`);
  for (const url of archives.reverse()) {
    const { games } = await getJSON(url);
    const game = (games ?? []).find((g) => g.url === arg);
    if (game) {
      console.log(game.pgn);
      return;
    }
  }
  console.error("game not found in your archives — paste the exact URL from chess.com");
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
