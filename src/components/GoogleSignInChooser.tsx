"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import {
  getRecentGoogleAccounts,
  type RecentGoogleAccount,
} from "@/lib/recent-accounts";

type GoogleSignInChooserProps = {
  variant?: "hero" | "solid";
  callbackUrl?: string;
  siteLabel?: string;
};

export function GoogleSignInChooser({
  variant = "solid",
  callbackUrl = "/",
  siteLabel = "aussiecitizenshipprep.com.au",
}: GoogleSignInChooserProps) {
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<RecentGoogleAccount[]>([]);
  const [busyEmail, setBusyEmail] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const isHero = variant === "hero";

  useEffect(() => {
    setAccounts(getRecentGoogleAccounts());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function continueWithGoogle(loginHint?: string) {
    setBusyEmail(loginHint ?? "__other__");
    try {
      await signIn(
        "google",
        { callbackUrl },
        loginHint ? { login_hint: loginHint, prompt: "select_account" } : { prompt: "select_account" },
      );
    } finally {
      setBusyEmail(null);
    }
  }

  const visibleAccounts = accounts.slice(0, 2);
  const moreCount = Math.max(0, accounts.length - visibleAccounts.length);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={
          isHero
            ? "inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            : "inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-navy transition hover:bg-sand"
        }
      >
        <GoogleMark size={16} />
        Sign in
        <Chevron open={open} className={isHero ? "text-white/80" : "text-navy/70"} />
      </button>

      {open && (
        <div
          id={listId}
          role="dialog"
          aria-label={`Sign in to ${siteLabel} with Google`}
          className="absolute right-0 z-50 mt-2 w-[min(22.5rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-[#3c4043] bg-[#1f1f1f] text-white shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-[#3c4043] px-4 py-3">
            <GoogleMark size={18} />
            <p className="min-w-0 flex-1 text-[13px] leading-snug text-[#e8eaed]">
              Sign in to{" "}
              <span className="font-medium text-white">{siteLabel}</span> with
              Google
            </p>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-[#9aa0a6] transition hover:bg-white/10 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="max-h-[22rem] overflow-y-auto">
            {visibleAccounts.length === 0 ? (
              <button
                type="button"
                disabled={busyEmail !== null}
                onClick={() => void continueWithGoogle()}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-white/5 disabled:opacity-60"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#3c4043]">
                  <GoogleMark size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-white">
                    Continue with Google
                  </span>
                  <span className="block text-xs text-[#9aa0a6]">
                    Choose your Google Account
                  </span>
                </span>
              </button>
            ) : (
              visibleAccounts.map((account) => (
                <AccountRow
                  key={account.email}
                  account={account}
                  busy={busyEmail === account.email}
                  disabled={busyEmail !== null}
                  onClick={() => void continueWithGoogle(account.email)}
                />
              ))
            )}

            {moreCount > 0 && (
              <button
                type="button"
                disabled={busyEmail !== null}
                onClick={() => void continueWithGoogle()}
                className="w-full border-t border-[#3c4043] px-4 py-3 text-center text-sm text-[#9aa0a6] transition hover:bg-white/5 hover:text-white disabled:opacity-60"
              >
                {moreCount} more account{moreCount === 1 ? "" : "s"}
              </button>
            )}

            {visibleAccounts.length > 0 && (
              <button
                type="button"
                disabled={busyEmail !== null}
                onClick={() => void continueWithGoogle()}
                className="flex w-full items-center gap-3 border-t border-[#3c4043] px-4 py-3.5 text-left transition hover:bg-white/5 disabled:opacity-60"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#5f6368] text-[#e8eaed]">
                  <PlusIcon />
                </span>
                <span className="text-sm font-medium text-[#e8eaed]">
                  Use another account
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AccountRow({
  account,
  busy,
  disabled,
  onClick,
}: {
  account: RecentGoogleAccount;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const initial = (account.name || account.email).charAt(0).toUpperCase();
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-[#3c4043] px-4 py-3 text-left transition hover:bg-white/5 disabled:opacity-60 last:border-b-0"
    >
      {account.image ? (
        <Image
          src={account.image}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 rounded-full"
        />
      ) : (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f29900] text-sm font-semibold text-white">
          {initial}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-white">
          {account.name || account.email.split("@")[0]}
        </span>
        <span className="block truncate text-xs text-[#9aa0a6]">
          {account.email}
        </span>
      </span>
      {busy && (
        <span className="text-xs text-[#9aa0a6]">…</span>
      )}
    </button>
  );
}

function GoogleMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
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

function Chevron({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={`${className ?? ""} transition ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M2.2 4.2a.75.75 0 0 1 1.06 0L6 6.94l2.74-2.74a.75.75 0 1 1 1.06 1.06L6.53 8.53a.75.75 0 0 1-1.06 0L2.2 5.26a.75.75 0 0 1 0-1.06z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M19 11h-6V5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2z"
      />
    </svg>
  );
}
