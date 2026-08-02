import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { Footer } from "@/components/Footer";
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
          <h1 className="mt-2 font-display text-3xl text-ink">Sign in to AussieCitizenshipPrep</h1>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            Use Google to save your practice progress identity and unlock Premium after
            purchase on this account.
          </p>

          <form
            className="mt-8"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: callbackUrl });
            }}
          >
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-navy transition hover:border-harbour/40 hover:shadow-sm"
            >
              <GoogleMark />
              Continue with Google
            </button>
          </form>

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

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-2.9-11.9-7.1l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.5 5.5-6.5 6.9l.1.1 6.3 5.3C39.3 37.3 44 32.5 44 24c0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
