import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  return new Stripe(key, {
    apiVersion: "2026-07-29.dahlia",
  });
}

export const PREMIUM_COOKIE = "oz_premium";
export const PREMIUM_PRICE_CENTS = 1099;
