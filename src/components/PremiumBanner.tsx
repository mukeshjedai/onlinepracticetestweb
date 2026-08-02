import Link from "next/link";
import { pricing } from "@/data/tests";

export function PremiumBanner() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="absolute -right-16 top-0 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-sky/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.2fr_1fr] md:items-center md:px-8 md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            Premium Practice Test 2026
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">
            The only course you need to pass your citizenship test
          </h2>
          <p className="mt-4 max-w-xl text-white/75">
            The most up-to-date practice set with full-length mocks, section-wise
            drills, and progress tracking — one payment, lifetime access on this device.
          </p>
          <ul className="mt-6 grid gap-3 text-sm text-white/85 sm:grid-cols-2">
            {[
              "40+ full-length mock tests in exam format",
              "Section-wise questions with targeted practice",
              "Chapter-style packs for focused revision",
              "Track scores so you know where to improve",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-0.5 text-gold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[1.75rem] border border-white/15 bg-white/5 p-7 backdrop-blur">
          <p className="text-sm text-white/70">One-time purchase</p>
          <p className="mt-2 font-display text-5xl text-gold-soft">{pricing.label}</p>
          <p className="mt-2 text-sm text-white/65">{pricing.tagline}</p>
          <Link
            href="/premium"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full gold-sheen px-5 py-3 text-center text-sm font-bold text-navy"
          >
            Explore Premium
          </Link>
          <p className="mt-4 text-center text-xs text-white/50">
            No monthly fee · No subscription · Unlimited practice
          </p>
        </div>
      </div>
    </section>
  );
}
