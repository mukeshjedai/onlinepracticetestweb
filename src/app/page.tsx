import { CultureBand } from "@/components/CultureBand";
import { Footer } from "@/components/Footer";
import { FreeVsPremium } from "@/components/FreeVsPremium";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PremiumBanner } from "@/components/PremiumBanner";
import { Reviews } from "@/components/Reviews";
import { TestAreas } from "@/components/TestAreas";
import { isPremiumUser } from "@/lib/premium";

export default async function HomePage() {
  const isPremium = await isPremiumUser();

  return (
    <>
      <Header isPremium={isPremium} />
      <main>
        <Hero />

        <section className="border-b border-line bg-surface px-5 py-14 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Welcome to the Australian citizenship practice test 2026
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              AussieCitizenshipPrep helps thousands of future citizens prepare with free,
              reliable practice tests. Read{" "}
              <a
                className="font-semibold text-harbour underline decoration-gold/60 underline-offset-2"
                href="https://immi.homeaffairs.gov.au/citizenship/test-and-interview/our-common-bond"
                target="_blank"
                rel="noreferrer"
              >
                Australian Citizenship: Our Common Bond
              </a>{" "}
              at least once, then practise until the real exam feels familiar.
            </p>
          </div>
        </section>

        <PremiumBanner />
        <CultureBand />
        <TestAreas isPremium={isPremium} />
        <FreeVsPremium />
        <Reviews />

        <section className="px-5 py-16 md:px-8">
          <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-line bg-surface px-6 py-10 text-center shadow-sm md:px-10">
            <h2 className="font-display text-3xl text-ink">Be 100% prepared for test day</h2>
            <p className="mt-3 text-muted">
              Free tests get you started. Premium gives you the full mock library
              so you can walk in confident.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="/#practice"
                className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white"
              >
                Start free practice
              </a>
              <a
                href="/premium"
                className="rounded-full bg-gold px-5 py-3 text-sm font-bold text-navy"
              >
                Get Premium
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
