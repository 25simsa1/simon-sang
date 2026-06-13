import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { getAllPosts } from "@/lib/posts";
import { pageSquares } from "@/data/site";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes and essays on research, markets, chess, and honest results.",
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <div>
      <PageHero square={pageSquares.writing}>
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Writing</h1>
        <p className="max-w-xl text-muted">
          Notes on research, markets, and decisions, biased toward results that
          didn&rsquo;t flatter me.
        </p>
      </PageHero>

      <ul className="grid gap-4">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.07}>
            <li className="card-soft group relative rounded-2xl border border-border bg-bg p-5 transition-all duration-300 hover:scale-[0.99] hover:border-accent/60 motion-reduce:hover:scale-100">
              <h2 className="font-medium">
                <Link
                  href={`/writing/${post.slug}`}
                  className="after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-1 font-mono text-xs text-faint">
                {post.date} · {post.readingMinutes} min read
                {post.status === "draft" && " · draft"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{post.summary}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
