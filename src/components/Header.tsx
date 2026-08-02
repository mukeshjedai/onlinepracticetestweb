"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AuthButtons } from "@/components/AuthButtons";

type HeaderProps = {
  isPremium?: boolean;
};

export function Header({ isPremium = false }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  // Never show Premium for signed-out users (ignores stale oz_premium cookies).
  const showPremium =
    status === "authenticated" && Boolean(session?.user) && isPremium;

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold text-navy shadow-[0_0_0_3px_rgba(255,255,255,0.15)] transition group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M12 2l1.8 5.5H20l-4.5 3.3 1.7 5.4L12 13.8 6.8 16.2l1.7-5.4L4 7.5h6.2L12 2z" />
            </svg>
          </span>
          <span className="font-display text-base tracking-tight text-white md:text-lg">
            AussieCitizenship<span className="text-gold-soft">Prep</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white/90 md:flex">
          <Link href="/#practice" className="transition hover:text-gold-soft">
            Practice
          </Link>
          <Link href="/dashboard" className="transition hover:text-gold-soft">
            Dashboard
          </Link>
          <Link href="/premium" className="transition hover:text-gold-soft">
            Premium
          </Link>
          <Link href="/#reviews" className="transition hover:text-gold-soft">
            Reviews
          </Link>
          {showPremium ? (
            <span className="rounded-full border border-gold/50 bg-gold/15 px-3 py-1 text-gold-soft">
              Premium active
            </span>
          ) : (
            <Link
              href="/premium"
              className="rounded-full bg-gold px-4 py-2 font-semibold text-navy transition hover:bg-gold-soft"
            >
              Unlock Premium
            </Link>
          )}
          <AuthButtons variant="hero" />
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-lg">{open ? "×" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="mx-5 rounded-2xl border border-white/15 bg-navy-deep/95 p-4 text-white shadow-xl backdrop-blur md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/#practice" onClick={() => setOpen(false)}>
              Practice
            </Link>
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
            <Link href="/premium" onClick={() => setOpen(false)}>
              Premium
            </Link>
            <Link href="/#reviews" onClick={() => setOpen(false)}>
              Reviews
            </Link>
            <Link
              href="/premium"
              onClick={() => setOpen(false)}
              className="rounded-full bg-gold px-4 py-2 text-center font-semibold text-navy"
            >
              Unlock Premium
            </Link>
            <div className="border-t border-white/15 pt-3">
              <AuthButtons variant="hero" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
