"use client";

import { signIn } from "next-auth/react";
import { promptGoogleOneTap } from "@/components/GoogleOneTap";

export function LoginGooglePanel({ callbackUrl = "/" }: { callbackUrl?: string }) {
  return (
    <div className="mt-8 space-y-3">
      <button
        type="button"
        onClick={() => {
          const ready = promptGoogleOneTap();
          if (!ready) {
            void signIn("google", { callbackUrl }, { prompt: "select_account" });
          }
        }}
        className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-navy transition hover:border-harbour/40 hover:shadow-sm"
      >
        <GoogleMark />
        Continue with Google
      </button>
      <p className="text-center text-xs text-muted">
        If you&apos;re already signed into Google, use the One Tap prompt (top-right) to
        continue as that account in one click.
      </p>
    </div>
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
