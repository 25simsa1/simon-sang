const { mkdirSync, writeFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");

/**
 * Snapshots Chess.com data (rapid only) to data/generated/chess.json:
 * current/best rating + the monthly rating journey built from game archives.
 * Runs via predev/prebuild. Failure-safe by design — on any error it keeps
 * the previously committed snapshot so the chart never breaks offline.
 * The live stat card also re-fetches stats at runtime (lib/chesscom.ts);
 * this snapshot is the build-time base and the fallback.
 */
const USERNAME = "simonschess06";
const BASE = `https://api.chess.com/pub/player/${USERNAME}`;
const TARGET = join(process.cwd(), "data", "generated", "chess.json");

async function getJSON(url) {
  const res = await fetch(url, { headers: { "User-Agent": "simonsang.com build script" } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.json();
}

async function main() {
  try {
    const stats = await getJSON(`${BASE}/stats`);
    const rapid = stats.chess_rapid;
    if (!rapid?.last?.rating) throw new Error("no rapid stats in response");

    const { archives } = await getJSON(`${BASE}/games/archives`);
    const journey = [];
    for (const url of archives) {
      const { games } = await getJSON(url);
      const rapidGames = (games ?? []).filter((g) => g.time_class === "rapid");
      if (rapidGames.length === 0) continue;
      const last = rapidGames[rapidGames.length - 1];
      const side = last.white.username.toLowerCase() === USERNAME ? last.white : last.black;
      // "2023/07" from the archive URL tail
      const month = url.split("/").slice(-2).join("-");
      journey.push({ month, rating: side.rating });
    }

    const snapshot = {
      fetchedAt: new Date().toISOString(),
      username: USERNAME,
      rapid: {
        current: rapid.last.rating,
        best: rapid.best?.rating ?? null,
        bestGameUrl: rapid.best?.game ?? null,
      },
      journey,
    };

    mkdirSync(join(process.cwd(), "data", "generated"), { recursive: true });
    writeFileSync(TARGET, JSON.stringify(snapshot, null, 2) + "\n");
    console.log(`chess: rapid ${snapshot.rapid.current} (peak ${snapshot.rapid.best}), ${journey.length} journey points`);
  } catch (err) {
    if (existsSync(TARGET)) {
      console.log(`chess: fetch failed (${err.message}), keeping existing snapshot`);
    } else {
      console.error(`chess: fetch failed (${err.message}) and no snapshot exists — run once online before building`);
      process.exitCode = 1;
    }
  }
}

main();
