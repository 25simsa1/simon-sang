"use client";

import { useState } from "react";
import { Chess, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { puzzleOfTheWeek } from "@/data/chess";

const boardSquares = {
  darkSquareStyle: { backgroundColor: "#5d8a6f" },
  lightSquareStyle: { backgroundColor: "#eceee4" },
};

const SELECTED_STYLE = { backgroundColor: "rgba(255, 221, 51, 0.4)" };

/**
 * Interactive puzzle: click OR drag to solve (click-to-move pattern from the
 * react-chessboard docs, so it works on trackpads and touch), or reveal the
 * answer as text. The FEN, prompt, and solution are all real text — no
 * information is board-only.
 */
export function Puzzle() {
  const [fen, setFen] = useState(puzzleOfTheWeek.fen);
  const [state, setState] = useState<"unsolved" | "solved" | "wrong">("unsolved");
  const [revealed, setRevealed] = useState(false);
  const [moveFrom, setMoveFrom] = useState<string>("");
  const [optionSquares, setOptionSquares] = useState<Record<string, React.CSSProperties>>({});

  function tryMove(from: string, to: string): boolean {
    if (state === "solved") return false;
    const chess = new Chess(puzzleOfTheWeek.fen);
    try {
      const move = chess.move({ from, to, promotion: "q" });
      setFen(chess.fen());
      setMoveFrom("");
      setOptionSquares({});
      if (move.san === puzzleOfTheWeek.solutionSan) {
        setState("solved");
      } else {
        setState("wrong");
        // Reset after a beat so they can retry.
        setTimeout(() => {
          setFen(puzzleOfTheWeek.fen);
          setState("unsolved");
        }, 900);
      }
      return true;
    } catch {
      return false;
    }
  }

  /** Show legal-move dots for the clicked piece (accent-tinted, lib-docs pattern). */
  function getMoveOptions(square: Square): boolean {
    const chess = new Chess(puzzleOfTheWeek.fen);
    const moves = chess.moves({ square, verbose: true });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }
    const styles: Record<string, React.CSSProperties> = {};
    for (const move of moves) {
      styles[move.to] = {
        background: chess.get(move.to as Square)
          ? "radial-gradient(circle, rgba(16,19,17,.18) 85%, transparent 85%)"
          : "radial-gradient(circle, rgba(16,19,17,.18) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    }
    styles[square] = SELECTED_STYLE;
    setOptionSquares(styles);
    return true;
  }

  function onSquareClick({ square, piece }: { square: string; piece: { pieceType: string } | null }) {
    if (state === "solved") return;
    if (!moveFrom && piece) {
      if (getMoveOptions(square as Square)) setMoveFrom(square);
      return;
    }
    if (moveFrom && !tryMove(moveFrom, square)) {
      // Clicked an invalid target: reselect if it's another piece, else clear.
      setMoveFrom(getMoveOptions(square as Square) ? square : "");
      if (!piece) setOptionSquares({});
    }
  }

  function onPieceDrop({
    sourceSquare,
    targetSquare,
  }: {
    piece: unknown;
    sourceSquare: string;
    targetSquare: string | null;
  }): boolean {
    if (!targetSquare) return false;
    return tryMove(sourceSquare, targetSquare);
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,300px)_1fr]">
      <div data-chess-board className="aspect-square w-full max-w-[300px]">
      <Chessboard
        options={{
          id: "puzzle",
          position: fen,
          allowDragging: state !== "solved",
          onPieceDrop,
          onSquareClick,
          squareStyles: optionSquares,
          boardStyle: { borderRadius: "8px", overflow: "hidden" },
          ...boardSquares,
        }}
      />
      </div>
      <div>
        <p className="mb-2 text-sm leading-relaxed text-muted">{puzzleOfTheWeek.prompt}</p>
        <p className="mb-4 font-mono text-xs text-faint">FEN: {puzzleOfTheWeek.fen}</p>
        <p className="mb-4 min-h-6 text-sm font-medium" aria-live="polite">
          {state === "solved" && <span className="text-accent">Solved: {puzzleOfTheWeek.solutionSan}. {puzzleOfTheWeek.explanation}</span>}
          {state === "wrong" && <span>Not that one. Position reset; try again.</span>}
        </p>
        {!revealed && state !== "solved" ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-sm text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            Reveal solution
          </button>
        ) : state !== "solved" ? (
          <p className="text-sm text-muted">
            <span className="font-mono text-accent">{puzzleOfTheWeek.solutionSan}</span>: {puzzleOfTheWeek.explanation}
          </p>
        ) : null}
      </div>
    </div>
  );
}
