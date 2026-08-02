"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

type AuthButtonsProps = {
  variant?: "hero" | "solid";
};

export function AuthButtons({ variant = "solid" }: AuthButtonsProps) {
  const { data: session, status } = useSession();
  const isHero = variant === "hero";

  if (status === "loading") {
    return (
      <span
        className={
          isHero
            ? "text-sm text-white/60"
            : "text-sm text-white/60"
        }
      >
        …
      </span>
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
          onClick={() => signOut({ callbackUrl: "/" })}
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
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className={
        isHero
          ? "inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          : "inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-navy transition hover:bg-sand"
      }
    >
      <GoogleIcon />
      Sign in
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
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
