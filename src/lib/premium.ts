import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { defaultFreeAccess, fetchUserAccess, type UserAccess } from "@/lib/access-api";
import { PREMIUM_COOKIE } from "./stripe";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getSecret() {
  const secret = process.env.PREMIUM_TOKEN_SECRET || process.env.STRIPE_SECRET_KEY || "dev-premium-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function createPremiumToken(email?: string) {
  return new SignJWT({
    premium: true,
    email: email ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(getSecret());
}

export async function verifyPremiumToken(token: string | undefined) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.premium === true;
  } catch {
    return false;
  }
}

/**
 * Source of truth: database flags for a signed-in user.
 * Guests are always free — leftover oz_premium cookies do not grant access.
 */
export async function getUserAccessFlags(): Promise<UserAccess> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    return defaultFreeAccess();
  }

  const fromDb = await fetchUserAccess(email);
  if (fromDb) {
    return fromDb;
  }

  // API unavailable: stay on free. Do not trust stale cookies.
  return defaultFreeAccess(email);
}

export async function isPremiumUser() {
  const access = await getUserAccessFlags();
  return access.hasPremiumAccess;
}

export async function grantPremiumCookie(email?: string) {
  if (!email) return null;
  const token = await createPremiumToken(email);
  const jar = await cookies();
  jar.set(PREMIUM_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return token;
}

export function canAccessTest(
  tier: "free" | "premium",
  isPremium: boolean,
  hasFreeAccess = true,
) {
  if (tier === "free") return hasFreeAccess;
  return isPremium;
}
