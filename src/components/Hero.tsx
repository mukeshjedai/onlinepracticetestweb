import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden text-white">
      <Image
        src="/images/hero-passport.png"
        alt="Australian passport held in front of Sydney Harbour Bridge"
        fill
        priority
        className="object-cover object-[center_30%]"
        sizes="100vw"
      />
      <div className="hero-scrim absolute inset-0" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
        <p className="animate-rise font-display text-4xl leading-[0.95] tracking-tight text-white drop-shadow sm:text-5xl md:text-6xl lg:text-7xl">
          AussieCitizenship<span className="text-gold-soft">Prep</span>
        </p>
        <h1 className="animate-rise-delay mt-5 max-w-2xl text-2xl font-medium leading-snug text-white/95 md:text-3xl">
          Pass your Australian citizenship test with confidence.
        </h1>
        <p className="animate-rise-late mt-4 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
          Free unlimited starter practice, plus a one-time Premium unlock packed
          with mock exams built around Our Common Bond.
        </p>
        <div className="animate-rise-late mt-8 flex flex-wrap gap-3">
          <Link
            href="/#practice"
            className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-gold-soft"
          >
            Free practice test
          </Link>
          <Link
            href="/premium"
            className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Explore Premium — AU$10.99
          </Link>
        </div>
      </div>
    </section>
  );
}
