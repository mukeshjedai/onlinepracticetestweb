"use client";

import { useState } from "react";

type CheckoutButtonProps = {
  className?: string;
  label?: string;
};

export function CheckoutButton({
  className,
  label = "Buy Premium — AU$10.99",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to start checkout");
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.devUnlock) {
        window.location.href = "/success?dev=1";
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className={
          className ??
          "inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-bold text-navy transition hover:bg-gold-soft disabled:opacity-60"
        }
      >
        {loading ? "Redirecting to secure checkout…" : label}
      </button>
      {error && <p className="mt-2 text-center text-sm text-danger">{error}</p>}
    </div>
  );
}
