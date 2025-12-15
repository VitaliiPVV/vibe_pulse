import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Stripe webhook signature error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const clerkUserId = session.metadata?.clerkUserId;
    const subscriptionId = session.subscription as string;

    if (!clerkUserId || !subscriptionId) {
      console.error("❌ Missing clerkUserId or subscriptionId in checkout.session.completed");
      return NextResponse.json({ received: true });
    }

    const subscription = (await stripe.subscriptions.retrieve(
      subscriptionId
    )) as Stripe.Subscription;

    const price = subscription.items.data[0]?.price;
    const s: any = subscription;

    const { data, error } = await supabase.from("subscriptions").upsert({
      clerk_user_id: clerkUserId,
      stripe_customer_id: s.customer as string,
      stripe_subscription_id: s.id,

      price_id: price?.id,
      price_amount: price?.unit_amount ?? null,
      price_currency: price?.currency ?? null,
      price_interval: price?.recurring?.interval ?? null,

      status: s.status,
      current_period_end: s.current_period_end
        ? new Date(s.current_period_end * 1000)
        : null,
      cancel_at: s.cancel_at ? new Date(s.cancel_at * 1000) : null,
      canceled_at: s.canceled_at ? new Date(s.canceled_at * 1000) : null,
      cancel_at_period_end: s.cancel_at_period_end,
      trial_end: s.trial_end ? new Date(s.trial_end * 1000) : null,
    });

    if (error) {
      return new Response("Supabase error", { status: 500 });
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;

    const price = subscription.items.data[0]?.price;
    const s: any = subscription;

    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        status: s.status,
        current_period_end: s.current_period_end
          ? new Date(s.current_period_end * 1000)
          : null,
        cancel_at: s.cancel_at ? new Date(s.cancel_at * 1000) : null,
        canceled_at: s.canceled_at ? new Date(s.canceled_at * 1000) : null,
        cancel_at_period_end: s.cancel_at_period_end,
        trial_end: s.trial_end ? new Date(s.trial_end * 1000) : null,

        price_id: price?.id ?? null,
        price_amount: price?.unit_amount ?? null,
        price_currency: price?.currency ?? null,
        price_interval: price?.recurring?.interval ?? null,
      })
      .eq("stripe_subscription_id", s.id);

    if (error) {
      return new Response("Supabase error", { status: 500 });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        status: "canceled",
        canceled_at: new Date(),
      })
      .eq("stripe_subscription_id", subscription.id);

    if (error) {
      return new Response("Supabase error", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
