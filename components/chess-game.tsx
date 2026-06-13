"use client";

import { useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import type { AnnotatedGame } from "@/data/chess";
import { cn } from "@/lib/utils";

const boardSquares = {
  darkSquareStyle: { backgroundColor: "#5d8a6f" },
  lightSquareStyle: { backgroundColor: "#eceee4" },
};

/**
 * Stepper-based game viewer. The board is decorative reinforcement; the move
 * list and annotations are real text, so the content works without the board.
 */
export function ChessGame({ game }: { game: AnnotatedGame }) {
  // index = number of half-moves played (0 = starting position)
  const [index, setIndex] = useState(0);

  const { fens, coords } = useMemo(() => {
    const chess = new Chess();
    const fenList = [chess.fen()];
    const coordList: { from: string; to: string }[] = [];
    for (const san of game.moves) {
      const move = chess.move(san);
      fenList.push(chess.fen());
      coordList.push({ from: move.from, to: move.to });
    }
    return { fens: fenList, coords: coordList };
  }, [game.moves]);

  // Highlight the squares of the move just played (lichess-style).
  const lastMove = index > 0 ? coords[index - 1] : null;
  const squareStyles = lastMove
    ? {
        [lastMove.from]: { backgroundColor: "rgba(255, 221, 51, 0.35)" },
        [lastMove.to]: { backgroundColor: "rgba(255, 221, 51, 0.45)" },
      }
    : {};

  const total = game.moves.length;
  const annotation = index > 0 ? game.annotations[index - 1] : undefined;
  const moveLabel =
    index === 0
      ? "Starting position"
      : `${Math.ceil(index / 2)}${index % 2 === 1 ? "." : "..."} ${game.moves[index - 1]}`;

  const controls = [
    { label: "Go to start", icon: ChevronFirst, action: () => setIndex(0), disabled: index === 0 },
    { label: "Previous move", icon: ChevronLeft, action: () => setIndex((i) => Math.max(0, i - 1)), disabled: index === 0 },
    { label: "Next move", icon: ChevronRight, action: () => setIndex((i) => Math.min(total, i + 1)), disabled: index === total },
    { label: "Go to end", icon: ChevronLast, action: () => setIndex(total), disabled: index === total },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,340px)_1fr]">
      <div>
        {/* The aspect-square wrapper bounds the board's height to its width.
            Without it, react-chessboard fills 100% of the grid cell's
            stretched height and overflows the card. */}
        <div data-chess-board className="aspect-square w-full max-w-[340px]">
          <Chessboard
            options={{
              id: game.id,
              position: fens[index],
              allowDragging: false,
              showAnimations: true,
              animationDurationInMs: 200,
              boardStyle: { borderRadius: "8px", overflow: "hidden" },
              squareStyles,
              ...boardSquares,
            }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1">
            {controls.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={c.action}
                disabled={c.disabled}
                aria-label={c.label}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border text-muted transition-colors duration-200 hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted"
              >
                <c.icon className="h-4 w-4" aria-hidden="true" />
              </button>
            ))}
          </div>
          <p className="font-mono text-xs text-muted" aria-live="polite">
            {moveLabel} · {index}/{total}
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col">
        <h4 className="font-medium">{game.players}</h4>
        <p className="mb-3 text-sm text-muted">{game.event}</p>
        <p className="mb-4 text-sm leading-relaxed text-muted">{game.intro}</p>
        <ol className="flex max-h-56 flex-wrap content-start gap-x-2 gap-y-1 overflow-y-auto font-mono text-xs">
          {game.moves.map((san, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setIndex(i + 1)}
                aria-label={`Go to move ${Math.ceil((i + 1) / 2)}${i % 2 === 0 ? "" : "…"} ${san}`}
                className={cn(
                  "cursor-pointer rounded px-1 py-0.5 transition-colors duration-150",
                  index === i + 1
                    ? "bg-accent text-accent-fg"
                    : "text-muted hover:text-fg",
                  game.annotations[i] !== undefined && index !== i + 1 && "text-accent"
                )}
              >
                {i % 2 === 0 && <span className="text-faint">{i / 2 + 1}.</span>}
                {san}
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-faint">
          Green moves carry notes. Use the arrows or click any move.
        </p>
        {/* Annotation panel: bottom of the right column, fading between notes.
            Collapses entirely (no empty box) when the current move has no note.
            Note text stays --fg on --bg for the AA contrast floor. */}
        <div aria-live="polite" className="mt-auto">
          <AnimatePresence mode="wait" initial={false}>
            {annotation && (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="mt-4 rounded-xl border border-border p-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-faint">
                  note · {moveLabel}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">{annotation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
