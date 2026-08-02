import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PREMIUM_COOKIE } from "@/lib/stripe";

/** Clears legacy oz_premium cookie (premium is DB-backed + requires sign-in). */
export async function POST() {
  const jar = await cookies();
  jar.delete(PREMIUM_COOKIE);
  return NextResponse.json({ ok: true });
}
