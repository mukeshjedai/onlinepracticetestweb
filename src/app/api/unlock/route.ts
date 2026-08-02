import { NextRequest, NextResponse } from "next/server";
import { grantPremiumCookie } from "@/lib/premium";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const sessionId = body.sessionId as string | undefined;
  const dev = Boolean(body.dev);

  if (dev && !process.env.STRIPE_SECRET_KEY) {
    await grantPremiumCookie("demo@aussiecitizenshipprep.local");
    return NextResponse.json({ ok: true, premium: true });
  }

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session id." }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 501 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed." }, { status: 402 });
    }
    await grantPremiumCookie(session.customer_details?.email ?? undefined);
    return NextResponse.json({ ok: true, premium: true });
  } catch (error) {
    console.error("Unlock error", error);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}
