import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { grantPremiumCookie } from "@/lib/premium";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const sessionId = body.sessionId as string | undefined;

  const user = await auth();
  if (!user?.user?.email) {
    return NextResponse.json(
      { error: "Sign in required to activate Premium.", requiresAuth: true },
      { status: 401 },
    );
  }

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing Stripe session id. Complete payment on Stripe first." },
      { status: 400 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 503 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed." }, { status: 402 });
    }

    const paidEmail =
      session.customer_details?.email?.toLowerCase() ||
      session.customer_email?.toLowerCase() ||
      session.metadata?.userEmail?.toLowerCase();

    // Ensure the paid session belongs to the signed-in user when email is present
    if (paidEmail && paidEmail !== user.user.email.toLowerCase()) {
      return NextResponse.json(
        { error: "This payment belongs to a different account. Sign in with the purchase email." },
        { status: 403 },
      );
    }

    await grantPremiumCookie(user.user.email);
    return NextResponse.json({ ok: true, premium: true });
  } catch (error) {
    console.error("Unlock error", error);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}
