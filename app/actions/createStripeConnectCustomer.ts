"use server"

import { auth } from "@clerk/nextjs/server"
import { api } from "@/convex/_generated/api"
import { ConvexHttpClient } from "convex/browser"
import { stripe } from "@/lib/stripe"

if(!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in environment variables")
}

if(!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is missing in environment variables")
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export async function  createStripeConnectCustomer() {
    const { userId} = await auth()

    if(!userId) {
        throw new Error("User is not authenticated")
    }

    const existingStripeConnectId = await convex.query(
        api.user.getUserStripeConnectId,
        { userId }
    )

    if(existingStripeConnectId) {
        return { account: existingStripeConnectId}
    }

    const account = await stripe.accounts.create({
        type: "express",
        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
            
        }
    })

    await convex.mutation(api.user.updateUserStripeConnectId, {
        userId,
        stripeConnectId: account.id
    })

}