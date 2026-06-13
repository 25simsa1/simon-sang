/**
 * The esports section on /play. Simon's copy, verbatim. Do not reword.
 */

export type Fandom = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  favorites?: { label: string; items: string[] };
};

export const fandoms: Fandom[] = [
  {
    title: "Rainbow Six Siege",
    subtitle: "The most strategically deep FPS on the circuit",
    paragraphs: [
      "Siege is the closest an FPS gets to chess. Information is the real resource, every gadget is a tempo trade, and most rounds are decided in the planning phase. The maps are destructible, so the position itself changes mid-round. You're reasoning about a board that deforms.",
      "No two rounds play the same, and a well-timed piece of utility flips a round harder than a flick. M80's run and Jume's Lesion and Grim are what got me watching.",
    ],
    favorites: {
      label: "Watching",
      items: ["M80", "Jume", "Interro"],
    },
  },
  {
    title: "Chess Competitions",
    subtitle: "Classical, streamers, and the spectator era",
    paragraphs: [
      "Chess became a spectator sport fast, and the broadcast finally caught up. Eval bars turned calculation into something an audience can feel. The format that grabbed me is classical. Bullet is trash to watch, too fast and too sloppy, all reflexes and no narrative. Classical lets you sit inside a player's thought process for an hour. That's where the beauty is.",
      "I follow Vincent Keymer for the pure competitive standard, and Levy Rozman because titled streamers brought a whole generation into the game without dumbing it down.",
    ],
    favorites: {
      label: "Following",
      items: ["Classical tournaments", "Vincent Keymer", "Levy Rozman"],
    },
  },
];
