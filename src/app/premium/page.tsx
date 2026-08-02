import Link from "next/link";
import { auth } from "@/auth";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { allTests, pricing } from "@/data/tests";
import { isPremiumUser } from "@/lib/premium";

export default async function PremiumPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const [isPremium, session] = await Promise.all([isPremiumUser(), auth()]);
  const params = await searchParams;
  const cancelled = params.cancelled === "1";
  const premiumMocks = allTests.filter((t) => t.category === "full" && t.tier === "premium").length;
  const signedIn = Boolean(session?.user);

  return (
    <>
      <SiteHeader isPremium={isPremium} />
      <main className="section-band">
        <section className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
          {cancelled && (
            <p className="mb-6 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-navy">
              Checkout was cancelled. You can still practise free tests anytime.
            </p>
          )}

          {isPremium ? (
            <div className="rounded-[1.75rem] border border-success/30 bg-surface p-8 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-success">
                Premium active
              </p>
              <h1 className="mt-3 font-display text-4xl text-ink">You already have full access</h1>
              <p className="mx-auto mt-3 max-w-xl text-muted">
                Jump into section packs and the full mock exam library whenever you like.
              </p>
              <Link
                href="/#practice"
                className="mt-6 inline-flex rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white"
              >
                Browse all tests
              </Link>
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-harbour">
                  Premium Practice Test 2026
                </p>
                <h1 className="mt-3 font-display text-4xl leading-tight text-ink md:text-5xl">
                  Unlock the full mock exam library
                </h1>
                <p className="mt-4 max-w-xl text-muted leading-relaxed">
                  One payment. No subscription. Practise until you feel ready for the
                  official Australian citizenship test.
                </p>
                <ul className="mt-8 space-y-3 text-sm text-ink">
                  {[
                    `${premiumMocks}+ full-length premium mock tests`,
                    "Section-wise packs across all four test areas",
                    "Immediate answer feedback and live scoring",
                    "Progress-friendly practice you can repeat unlimited times",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-gold">★</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[1.75rem] border border-line bg-surface p-7 shadow-sm">
                <p className="text-sm text-muted">One-time purchase</p>
                <p className="mt-2 font-display text-5xl text-navy">{pricing.label}</p>
                <p className="mt-2 text-sm text-muted">{pricing.tagline}</p>
                {!signedIn && (
                  <p className="mt-4 rounded-2xl bg-sand px-3 py-2 text-xs text-muted">
                    Tip:{" "}
                    <Link href="/login?callbackUrl=/premium" className="font-semibold text-harbour">
                      Sign in with Google
                    </Link>{" "}
                    first so Premium is linked to your account email.
                  </p>
                )}
                <div className="mt-6">
                  <CheckoutButton />
                </div>
                <p className="mt-4 text-center text-xs text-muted">
                  Secure checkout powered by Stripe. In local demo mode without Stripe
                  keys, Premium unlocks instantly for testing.
                </p>
                <Link
                  href="/#practice"
                  className="mt-5 block text-center text-sm font-medium text-harbour"
                >
                  Or continue with free tests →
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
