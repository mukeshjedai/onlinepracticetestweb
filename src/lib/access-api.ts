import { AspNetApiError, aspNetFetch } from "@/lib/aspnet-client";
import { useAspNetBackend } from "@/lib/config";

export type UserAccess = {
  email: string;
  hasFreeAccess: boolean;
  hasPremiumAccess: boolean;
};

type AccessApiResponse = {
  email: string;
  hasFreeAccess: boolean;
  hasPremiumAccess: boolean;
};

function mapAccess(data: AccessApiResponse): UserAccess {
  return {
    email: data.email,
    hasFreeAccess: Boolean(data.hasFreeAccess),
    hasPremiumAccess: Boolean(data.hasPremiumAccess),
  };
}

/** Default for guests / when API unavailable: free only. */
export function defaultFreeAccess(email = ""): UserAccess {
  return {
    email,
    hasFreeAccess: true,
    hasPremiumAccess: false,
  };
}

/** Load (and ensure) user access flags from ASP.NET / Postgres. */
export async function fetchUserAccess(email?: string | null): Promise<UserAccess | null> {
  if (!useAspNetBackend()) return null;
  if (!email) return null;

  try {
    const data = await aspNetFetch<AccessApiResponse>("/api/access", {
      userEmail: email,
      searchParams: { email },
    });
    return mapAccess(data);
  } catch (error) {
    console.error("fetchUserAccess failed", error);
    return null;
  }
}

/** Persist Premium after Stripe payment_status === paid. */
export async function grantPremiumAccess(
  email: string,
  stripeSessionId?: string,
): Promise<UserAccess> {
  if (!useAspNetBackend()) {
    throw new AspNetApiError("ASP.NET API is not configured", 503);
  }

  const data = await aspNetFetch<AccessApiResponse>("/api/access/premium", {
    method: "POST",
    userEmail: email,
    body: {
      email,
      stripeSessionId: stripeSessionId ?? null,
    },
  });
  return mapAccess(data);
}
