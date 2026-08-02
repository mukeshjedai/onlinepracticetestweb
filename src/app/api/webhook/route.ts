import { NextRequest, NextResponse } from "next/server";
import { grantPremiumAccess } from "@/lib/access-api";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 501 },
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid" || session.status === "complete") {
        const email =
          session.metadata?.userEmail?.toLowerCase() ||
          session.customer_details?.email?.toLowerCase() ||
          session.customer_email?.toLowerCase() ||
          session.client_reference_id?.toLowerCase();

        if (email) {
          await grantPremiumAccess(email, session.id);
          console.info("Premium granted in DB for", email, session.id);
        } else {
          console.warn("Premium checkout completed without email", session.id);
        }
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error", error);
    return NextResponse.json({ error: "Invalid webhook." }, { status: 400 });
  }
}
