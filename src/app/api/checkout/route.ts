import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pricing } from "@/data/tests";
import { grantPremiumCookie } from "@/lib/premium";
import { getStripe, PREMIUM_PRICE_CENTS } from "@/lib/stripe";

export async function POST() {
  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const stripe = getStripe();
  const userSession = await auth();
  const email = userSession?.user?.email ?? undefined;

  // Dev / demo fallback when Stripe keys are not configured
  if (!stripe) {
    await grantPremiumCookie(email ?? "demo@aussiecitizenshipprep.local");
    return NextResponse.json({
      devUnlock: true,
      message:
        "Stripe is not configured. Premium unlocked locally for development.",
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/premium?cancelled=1`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: pricing.currency,
            unit_amount: PREMIUM_PRICE_CENTS,
            product_data: {
              name: "AussieCitizenshipPrep Premium",
              description:
                "One-time unlock: 50 mock tests, section-wise practice, and progress tracking.",
            },
          },
        },
      ],
      metadata: {
        product: "aussiecitizenshipprep_premium",
        userEmail: email ?? "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json(
      { error: "Unable to create Stripe checkout session." },
      { status: 500 },
    );
  }
}
