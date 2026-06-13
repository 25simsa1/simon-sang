/**
 * Chess content for /play.
 * Ratings and the journey chart are NOT here — they come live from the
 * Chess.com API (lib/chesscom.ts + scripts/fetch-chess-snapshot.js).
 * - games: SAN move lists (validated by chess.js at render). Replace with your
 *   own PGNs — `npm run fetch-game <chess.com game URL>` prints one ready to paste.
 * - puzzle: rotate weekly. `solution` is shown after the reveal button.
 */

export type AnnotatedGame = {
  id: string;
  title: string;
  players: string;
  event: string;
  /** SAN moves, in order. */
  moves: string[];
  /** Keyed by move index (0-based, after that move is played). */
  annotations: Record<number, string>;
  intro: string;
};

export const games: AnnotatedGame[] = [
  {
    id: "opera",
    title: "The Opera Game",
    players: "Paul Morphy vs. Duke Karl / Count Isouard",
    event: "Paris Opera, 1858",
    intro:
      "The cleanest lesson in development and initiative ever played. Every white move asks a question; black never gets to ask one back. (Placeholder pick; my own annotated games are coming.)",
    moves: [
      "e4", "e5", "Nf3", "d6", "d4", "Bg4", "dxe5", "Bxf3", "Qxf3", "dxe5",
      "Bc4", "Nf6", "Qb3", "Qe7", "Nc3", "c6", "Bg5", "b5", "Nxb5", "cxb5",
      "Bxb5+", "Nbd7", "O-O-O", "Rd8", "Rxd7", "Rxd7", "Rd1", "Qe6",
      "Bxd7+", "Nxd7", "Qb8+", "Nxb8", "Rd8#",
    ],
    annotations: {
      12: "7.Qb3: hitting f7 and b7 at once. Development with threats attached.",
      18: "10.Nxb5! Morphy gives up a knight to keep every piece active. Material is a currency; tempo is the exchange rate.",
      22: "12.O-O-O: castling as an attacking move. The rook arrives on d1 with tempo.",
      30: "16.Qb8+!! The queen sacrifice. Black's extra material never moved.",
      32: "17.Rd8#: mate with the last two pieces white has left. Total economy.",
    },
  },
  {
    id: "century",
    title: "The Game of the Century",
    players: "Donald Byrne vs. Bobby Fischer",
    event: "New York, 1956",
    intro:
      "Fischer was thirteen. The queen sacrifice on move 17 is a correct positional judgment that two pieces and an initiative beat a queen. Calculation as conviction.",
    moves: [
      "Nf3", "Nf6", "c4", "g6", "Nc3", "Bg7", "d4", "O-O", "Bf4", "d5",
      "Qb3", "dxc4", "Qxc4", "c6", "e4", "Nbd7", "Rd1", "Nb6", "Qc5", "Bg4",
      "Bg5", "Na4", "Qa3", "Nxc3", "bxc3", "Nxe4", "Bxe7", "Qb6", "Bc4",
      "Nxc3", "Bc5", "Rfe8+", "Kf1", "Be6", "Bxb6", "Bxc4+", "Kg1", "Ne2+",
      "Kf1", "Nxd4+", "Kg1", "Ne2+", "Kf1", "Nc3+", "Kg1", "axb6", "Qb4",
      "Ra4", "Qxb6", "Nxd1", "h3", "Rxa2", "Kh2", "Nxf2", "Re1", "Rxe1",
      "Qd8+", "Bf8", "Nxe1", "Bd5", "Nf3", "Ne4", "Qb8", "b5", "h4", "h5",
      "Ne5", "Kg7", "Kg1", "Bc5+", "Kf1", "Ng3+", "Ke1", "Bb4+", "Kd1",
      "Bb3+", "Kc1", "Ne2+", "Kb1", "Nc3+", "Kc1", "Rc2#",
    ],
    annotations: {
      21: "11...Na4!! The move that made the game famous. The knight is en prise to nothing, and attacks everything.",
      33: "17...Be6!! The queen stays en prise. Fischer had calculated that the windmill of checks nets a decisive material haul.",
      37: "19...Ne2+ begins the windmill: every check gains material or position.",
      77: "41...Rc2#: the king has been walked across the board by a teenager.",
    },
  },
];

export type Puzzle = {
  fen: string;
  prompt: string;
  solutionSan: string;
  explanation: string;
};

export const puzzleOfTheWeek: Puzzle = {
  // Rotate this weekly. Keep the prompt honest about difficulty.
  fen: "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
  prompt: "White to move. Mate in one, a warm-up while I wire up harder ones.",
  solutionSan: "Rd8#",
  explanation:
    "The classic back-rank mate: the king's own pawns are the prison bars.",
};
