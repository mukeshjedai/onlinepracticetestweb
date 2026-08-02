import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Footer } from "@/components/Footer";
import { LoginGooglePanel } from "@/components/LoginGooglePanel";
import { SiteHeader } from "@/components/SiteHeader";
import { isPremiumUser } from "@/lib/premium";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/";

  if (session?.user) {
    redirect(callbackUrl);
  }

  const isPremium = await isPremiumUser();

  return (
    <>
      <SiteHeader isPremium={isPremium} />
      <main className="section-band flex min-h-[70vh] items-center px-5 py-16 md:px-8">
        <div className="mx-auto w-full max-w-md rounded-[1.75rem] border border-line bg-surface p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-harbour">
            Account
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink">
            Sign in to AussieCitizenshipPrep
          </h1>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            Use Google to save your practice progress identity and unlock Premium after
            purchase on this account.
          </p>

          <LoginGooglePanel callbackUrl={callbackUrl} />

          <p className="mt-6 text-center text-xs text-muted">
            By signing in you agree to use this site for personal study only.{" "}
            <Link href="/" className="font-medium text-harbour">
              Back home
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
