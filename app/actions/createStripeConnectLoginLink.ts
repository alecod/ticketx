"use server";

import { stripe } from "@/lib/stripe";

export async function createStripeConnectLoginLink(stripeAccountId: string) {
  if (!stripeAccountId) throw new Error("Stripe account id is required");

  try {
    const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
    return loginLink;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create login link");
  }
}
