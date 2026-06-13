"use client";

import dynamic from "next/dynamic";
import type { AnnotatedGame } from "@/data/chess";

/** Chess UI is the heaviest JS on the site — load it only on /play, client-side. */

function BoardSkeleton() {
  return (
    <div
      className="aspect-square w-full max-w-[340px] animate-pulse rounded-lg bg-bg-elevated"
      aria-hidden="true"
    />
  );
}

const LazyGame = dynamic(() => import("@/components/chess-game").then((m) => m.ChessGame), {
  ssr: false,
  loading: () => <BoardSkeleton />,
});

const LazyPuzzle = dynamic(() => import("@/components/puzzle").then((m) => m.Puzzle), {
  ssr: false,
  loading: () => <BoardSkeleton />,
});

export function ChessGameLazy({ game }: { game: AnnotatedGame }) {
  return <LazyGame game={game} />;
}

export function PuzzleLazy() {
  return <LazyPuzzle />;
}
