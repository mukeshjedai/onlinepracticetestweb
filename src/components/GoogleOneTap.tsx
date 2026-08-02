"use client";

import Script from "next/script";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useRef } from "react";
import { rememberGoogleAccount } from "@/lib/recent-accounts";

const GSI_SRC = "https://accounts.google.com/gsi/client";

type GoogleOneTapProps = {
  /** Auto-show the One Tap prompt for signed-out visitors */
  autoPrompt?: boolean;
  clientId: string;
};

/**
 * Google Identity Services One Tap — shows the browser's current Google
 * account (email + "Continue as …") when the user is already signed into Google.
 */
export function GoogleOneTap({ autoPrompt = true, clientId }: GoogleOneTapProps) {
  const { data: session, status } = useSession();
  const initialized = useRef(false);
  const prompted = useRef(false);

  const handleCredential = useCallback(async (response: CredentialResponse) => {
    if (!response.credential) return;

    const result = await signIn("google-one-tap", {
      credential: response.credential,
      redirect: false,
    });

    if (result?.ok) {
      // Decode email/name lightly for local UX cache (token already verified server-side)
      try {
        const [, payloadB64] = response.credential.split(".");
        const json = JSON.parse(
          atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")),
        ) as { email?: string; name?: string; picture?: string };
        rememberGoogleAccount({
          email: json.email,
          name: json.name,
          image: json.picture,
        });
      } catch {
        // ignore
      }
      window.location.reload();
      return;
    }

    // Fallback to full Google OAuth if One Tap session creation fails
    await signIn("google", { callbackUrl: window.location.pathname || "/" });
  }, []);

  const initAndPrompt = useCallback(
    (shouldPrompt: boolean) => {
      if (!clientId || !window.google?.accounts?.id) return;
      if (status === "authenticated") return;

      if (!initialized.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredential,
          auto_select: true,
          cancel_on_tap_outside: true,
          context: "signin",
          itp_support: true,
          use_fedcm_for_prompt: true,
        });
        initialized.current = true;
      }

      if (shouldPrompt && !prompted.current) {
        prompted.current = true;
        window.google.accounts.id.prompt();
      }
    },
    [clientId, handleCredential, status],
  );

  useEffect(() => {
    if (status !== "unauthenticated" || !autoPrompt) return;
    if (window.google?.accounts?.id) {
      initAndPrompt(true);
    }
  }, [status, autoPrompt, initAndPrompt]);

  useEffect(() => {
    function onRequestPrompt() {
      prompted.current = false;
      initAndPrompt(true);
    }
    window.addEventListener("acp-google-one-tap", onRequestPrompt);
    return () => window.removeEventListener("acp-google-one-tap", onRequestPrompt);
  }, [initAndPrompt]);

  if (!clientId || status === "authenticated") {
    return null;
  }

  return (
    <Script
      src={GSI_SRC}
      strategy="afterInteractive"
      onLoad={() => {
        if (autoPrompt && status === "unauthenticated") {
          initAndPrompt(true);
        } else {
          initAndPrompt(false);
        }
      }}
    />
  );
}

/** Trigger the One Tap prompt from a Sign in button. */
export function promptGoogleOneTap() {
  if (typeof window === "undefined") return false;
  if (window.google?.accounts?.id) {
    window.dispatchEvent(new Event("acp-google-one-tap"));
    window.google.accounts.id.prompt();
    return true;
  }
  window.dispatchEvent(new Event("acp-google-one-tap"));
  return false;
}
