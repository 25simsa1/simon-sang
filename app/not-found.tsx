import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p aria-hidden="true" className="font-mono text-xs text-faint">??</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Position not found</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        This square is off the board. In chess notation that move would just be illegal.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full border border-accent px-4 py-2 text-sm font-medium text-accent transition-colors duration-200 hover:bg-accent hover:text-accent-fg"
      >
        Back to the starting position
      </Link>
    </div>
  );
}
