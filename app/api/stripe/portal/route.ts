import { NextResponse } from "next/server";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("clerk_user_id", user.id)
    .single();

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json({ error: "User has no Stripe customer" }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
