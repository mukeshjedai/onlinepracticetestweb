import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pricing } from "@/data/tests";
import { getAppUrl } from "@/lib/config";
import { getStripe, PREMIUM_PRICE_CENTS } from "@/lib/stripe";

export async function POST() {
  const userSession = await auth();
  const email = userSession?.user?.email?.toLowerCase();

  if (!email) {
    return NextResponse.json(
      {
        error: "Sign in required to purchase Premium.",
        requiresAuth: true,
        loginUrl: "/login?callbackUrl=/premium",
      },
      { status: 401 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Set STRIPE_SECRET_KEY so checkout can redirect to Stripe.",
      },
      { status: 503 },
    );
  }

  const origin = getAppUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      client_reference_id: email,
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
        userEmail: email,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json(
      { error: "Unable to create Stripe checkout session." },
      { status: 500 },
    );
  }
}
