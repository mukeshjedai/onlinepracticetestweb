"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";

function SuccessInner() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const dev = params.get("dev") === "1";
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Confirming your Premium access…");

  useEffect(() => {
    async function unlock() {
      try {
        const res = await fetch("/api/unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, dev }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unlock failed");
        setStatus("ok");
        setMessage("Premium is unlocked. You now have access to the full mock library.");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Something went wrong.");
      }
    }
    void unlock();
  }, [sessionId, dev]);

  return (
    <div className="mx-auto max-w-xl rounded-[1.75rem] border border-line bg-surface p-8 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-harbour">
        {status === "ok" ? "Payment complete" : status === "error" ? "Needs attention" : "Almost there"}
      </p>
      <h1 className="mt-3 font-display text-3xl text-ink">
        {status === "ok" ? "Welcome to Premium" : "Activating Premium"}
      </h1>
      <p className="mt-4 text-muted">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/#practice"
          className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white"
        >
          Start premium tests
        </Link>
        <Link
          href="/premium"
          className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-navy"
        >
          View Premium details
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <>
      <SiteHeader isPremium />
      <main className="section-band px-5 py-16 md:px-8">
        <Suspense fallback={<p className="text-center text-muted">Loading…</p>}>
          <SuccessInner />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
