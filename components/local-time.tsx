"use client";

import { useEffect, useState } from "react";

/**
 * Footer local time for the site owner's timezone (her "it's HH:MM for
 * michelle" touch). Renders nothing until mounted so server and client
 * markup never disagree, then ticks once a minute.
 */
export function LocalTime({ city, timeZone }: { city: string; timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone,
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date())
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);

  if (!time) return null;

  return (
    <p className="font-mono text-xs text-faint">
      {time} in {city}
    </p>
  );
}
