const { execSync } = require("node:child_process");
const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

/**
 * Writes the date of the latest git commit to data/generated/changelog.json,
 * shown in the footer. Runs via predev/prebuild; falls back to the committed
 * JSON when git isn't available (e.g. a build from a tarball).
 */
function getLatestCommitDate() {
  try {
    const iso = execSync("git log -1 --format=%cI", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    // Format in the site owner's timezone so the date matches Simon's local day.
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return null;
  }
}

function main() {
  const lastUpdated = getLatestCommitDate();
  if (!lastUpdated) {
    console.log("changelog: no git history found, keeping existing data/generated/changelog.json");
    return;
  }
  const dir = join(process.cwd(), "data", "generated");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "changelog.json"), JSON.stringify({ lastUpdated }, null, 2) + "\n");
  console.log(`changelog: ${lastUpdated}`);
}

main();
