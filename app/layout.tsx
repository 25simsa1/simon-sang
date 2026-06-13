import type { Metadata } from "next";
import { Figtree, Geist_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { CursorFollower } from "@/components/cursor-follower";
import { KnightTour } from "@/components/knight-tour";
import { GridPulse } from "@/components/grid-pulse";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { site } from "@/data/site";
import "./globals.css";
import { cn } from "@/lib/utils";

// Figtree is the typeface behind michelle-liu.com's self-hosted "Michelle" font.
const figtree = Figtree({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-figtree",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name}: math, markets, and honest results`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased font-sans", figtree.variable, geistMono.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          {/* reducedMotion="user" makes every Framer Motion animation respect the OS setting. */}
          <MotionConfig reducedMotion="user">
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
            >
              Skip to content
            </a>
            <CursorFollower />
            <KnightTour />
            <GridPulse />
            {/* Static film grain — flat areas read printed, not rendered. */}
            <div aria-hidden="true" className="page-grain" />
            <Nav />
            <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-5 py-12 sm:px-8">
              {children}
            </main>
            <Footer />
            {modal}
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
