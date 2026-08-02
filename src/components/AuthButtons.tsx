"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import { GoogleSignInChooser } from "@/components/GoogleSignInChooser";
import { rememberGoogleAccount } from "@/lib/recent-accounts";

type AuthButtonsProps = {
  variant?: "hero" | "solid";
  callbackUrl?: string;
};

export function AuthButtons({
  variant = "solid",
  callbackUrl = "/",
}: AuthButtonsProps) {
  const { data: session, status } = useSession();
  const isHero = variant === "hero";

  useEffect(() => {
    if (session?.user?.email) {
      rememberGoogleAccount({
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      });
    }
  }, [session?.user?.email, session?.user?.name, session?.user?.image]);

  if (status === "loading") {
    return (
      <span className="text-sm text-white/60">…</span>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt=""
            width={28}
            height={28}
            className="rounded-full"
          />
        ) : (
          <span
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              isHero ? "bg-white/20 text-white" : "bg-gold text-navy"
            }`}
          >
            {(session.user.name || session.user.email || "?").charAt(0).toUpperCase()}
          </span>
        )}
        <span
          className={`hidden max-w-[140px] truncate text-sm sm:inline ${
            isHero ? "text-white/85" : "text-white/85"
          }`}
          title={session.user.email ?? undefined}
        >
          {session.user.name?.split(" ")[0] || session.user.email}
        </span>
        <button
          type="button"
          onClick={async () => {
            try {
              await fetch("/api/access/clear-premium-cookie", { method: "POST" });
            } catch {
              // ignore — sign-out should still proceed
            }
            await signOut({ callbackUrl: "/" });
          }}
          className={
            isHero
              ? "rounded-full border border-white/35 px-3 py-1.5 text-sm text-white/90 transition hover:bg-white/10"
              : "rounded-full border border-white/30 px-3 py-1.5 text-sm text-white/90 transition hover:bg-white/10"
          }
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <GoogleSignInChooser variant={variant} callbackUrl={callbackUrl} />
  );
}
