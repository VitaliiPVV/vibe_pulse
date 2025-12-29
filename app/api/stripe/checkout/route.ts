import { NextResponse } from "next/server";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const clerkUserId = user.id;
  const email = user.emailAddresses[0]?.emailAddress;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,

    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],

    success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,

    metadata: {
      clerkUserId,
    },
  });

  return NextResponse.json({ url: session.url });
}
