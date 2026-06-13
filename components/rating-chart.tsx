"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { JourneyPoint } from "@/lib/chesscom";

const mono = "var(--font-geist-mono), monospace";

/**
 * Rapid rating journey from real Chess.com archives, drawn in the accent
 * green. Data arrives as a prop from the server page (live + snapshot logic
 * lives in lib/chesscom.ts). The fixed-height wrapper reserves layout before
 * hydration (no CLS), and the visually-hidden caption remains the text
 * equivalent for screen readers.
 */
export function RatingChart({ data, peak }: { data: JourneyPoint[]; peak: number | null }) {
  if (data.length === 0) return null;
  const ratings = data.map((d) => d.rating);
  const lo = Math.floor((Math.min(...ratings, peak ?? Infinity) - 100) / 100) * 100;
  const hi = Math.ceil((Math.max(...ratings, peak ?? 0) + 100) / 100) * 100;

  return (
    <figure>
      <div
        className="h-56 w-full"
        role="img"
        aria-label={`Rapid rating by month, from ${data[0].rating} in ${data[0].month} to ${data[data.length - 1].rating} in ${data[data.length - 1].month}${peak ? `; peak ${peak}` : ""}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[...data]} margin={{ top: 12, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 5" vertical={false} />
            <XAxis
              dataKey="month"
              tickFormatter={(m: string) => m.slice(2).replace("-", "/")}
              tick={{ fill: "var(--faint)", fontSize: 10, fontFamily: mono }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              domain={[lo, hi]}
              tick={{ fill: "var(--faint)", fontSize: 10, fontFamily: mono }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            {peak && (
              <ReferenceLine
                y={peak}
                stroke="var(--accent)"
                strokeOpacity={0.5}
                strokeDasharray="2 6"
              />
            )}
            <Tooltip
              cursor={{ stroke: "var(--border)" }}
              contentStyle={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontFamily: mono,
                fontSize: "12px",
                color: "var(--fg)",
              }}
              labelStyle={{ color: "var(--muted)" }}
              formatter={(value) => [String(value), "rapid"]}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={{ fill: "var(--accent)", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "var(--accent)", strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">
        Rapid rating by month: {data.map((p) => `${p.month}: ${p.rating}`).join("; ")}.
      </figcaption>
    </figure>
  );
}
