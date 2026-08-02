import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
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

export async function isPremiumUser() {
  const jar = await cookies();
  const token = jar.get(PREMIUM_COOKIE)?.value;
  return verifyPremiumToken(token);
}

export async function grantPremiumCookie(email?: string) {
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

export function canAccessTest(tier: "free" | "premium", isPremium: boolean) {
  return tier === "free" || isPremium;
}
