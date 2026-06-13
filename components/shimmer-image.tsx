"use client";

import { useCallback, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * next/image with a shimmer placeholder: the frame shows a slow board-green
 * sweep until the bytes arrive, then the image fades in. Parent must be
 * positioned (the shelf photo wrapper already is). The shimmer is decorative
 * and stops under reduced motion (handled in globals.css).
 */
export function ShimmerImage({ className, onLoad, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  // Catch images already in the browser cache, where load fires before
  // hydration attaches the onLoad listener.
  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <span aria-hidden="true" className="shimmer absolute inset-0" />}
      <Image
        {...props}
        alt={alt}
        ref={imgRef}
        className={cn(
          "transition-opacity duration-500 motion-reduce:transition-none",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </>
  );
}
