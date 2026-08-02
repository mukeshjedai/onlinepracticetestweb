"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { AuthButtons } from "@/components/AuthButtons";

type SiteHeaderProps = {
  isPremium?: boolean;
};

export function SiteHeader({ isPremium = false }: SiteHeaderProps) {
  const { data: session, status } = useSession();
  const showPremium =
    status === "authenticated" && Boolean(session?.user) && isPremium;

  return (
    <header className="border-b border-line bg-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 md:px-8">
        <Link href="/" className="font-display text-base tracking-tight md:text-lg">
          AussieCitizenship<span className="text-gold">Prep</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-4">
          <Link href="/#practice" className="hidden text-white/80 hover:text-white sm:inline">
            Practice
          </Link>
          <Link href="/dashboard" className="hidden text-white/80 hover:text-white sm:inline">
            Dashboard
          </Link>
          <Link href="/premium" className="hidden text-white/80 hover:text-white sm:inline">
            Premium
          </Link>
          {showPremium ? (
            <span className="hidden rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-gold-soft sm:inline">
              Premium
            </span>
          ) : (
            <Link
              href="/premium"
              className="hidden rounded-full bg-gold px-3 py-1.5 font-semibold text-navy sm:inline"
            >
              Upgrade
            </Link>
          )}
          <AuthButtons variant="solid" />
        </nav>
      </div>
    </header>
  );
}
