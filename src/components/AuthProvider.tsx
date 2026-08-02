"use client";

import { SessionProvider } from "next-auth/react";
import { GoogleOneTap } from "@/components/GoogleOneTap";

export function AuthProvider({
  children,
  googleClientId,
}: {
  children: React.ReactNode;
  googleClientId: string;
}) {
  return (
    <SessionProvider>
      {googleClientId ? (
        <GoogleOneTap clientId={googleClientId} autoPrompt />
      ) : null}
      {children}
    </SessionProvider>
  );
}
