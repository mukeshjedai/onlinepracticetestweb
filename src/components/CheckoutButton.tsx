"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CheckoutButtonProps = {
  className?: string;
  label?: string;
};

export function CheckoutButton({
  className,
  label = "Buy Premium — AU$10.99",
}: CheckoutButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setError(null);

    if (status === "loading") return;

    if (!session?.user) {
      router.push("/login?callbackUrl=/premium");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (res.status === 401 || data.requiresAuth) {
        router.push(data.loginUrl || "/login?callbackUrl=/premium");
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Unable to start checkout");
      }

      if (!data.url) {
        throw new Error("Stripe checkout URL missing. Check STRIPE_SECRET_KEY.");
      }

      // Always send the user to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  const signedOut = status !== "loading" && !session?.user;

  return (
    <div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading || status === "loading"}
        className={
          className ??
          "inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-bold text-navy transition hover:bg-gold-soft disabled:opacity-60"
        }
      >
        {loading
          ? "Redirecting to Stripe…"
          : signedOut
            ? "Sign in to buy Premium"
            : label}
      </button>
      {error && <p className="mt-2 text-center text-sm text-danger">{error}</p>}
    </div>
  );
}
