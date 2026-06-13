"use client";

import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";

/**
 * Route-backed case-study overlay. Radix Dialog supplies the accessibility
 * load-bearing parts: focus trap, Escape close, backdrop click, body scroll
 * lock, aria wiring. Closing navigates back, so the URL and the modal stay
 * in lockstep (back button closes it too — that's the route interception).
 */
export function CaseStudyModal({ title, children }: { title: string; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <Dialog.Root defaultOpen onOpenChange={(open) => !open && router.back()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-fg/30 backdrop-blur-[2px]" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[var(--z-modal)] max-h-[85vh] w-[min(44rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-bg p-6 shadow-[var(--shadow-soft)] sm:p-8"
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Description className="sr-only">Project case study</Dialog.Description>
          <Dialog.Close
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-bg-elevated hover:text-fg"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
