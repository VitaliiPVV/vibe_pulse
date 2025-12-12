import { SubscribeButton } from "@/components/SubscribeButton";
import { Button, Card, CardFooter, CardHeader, CardTitle } from "@/components/ui";
import { currentUser } from "@clerk/nextjs/server";
import { ManageSection } from "./components";
import { getUserSubscription } from "@/utils/supabase-server";

export default async function Pricing() {
  const user = await currentUser();
  const subscription = user && await getUserSubscription(user.id);

  return (
    <main className="flex flex-col gap-6 max-w-[1200px] m-auto px-4 md:px-8 lg:px-16 lg:py-16">
      {user && subscription && (
        <ManageSection
          amount={subscription.price_amount}
          currency={subscription.price_currency}
          interval={subscription.price_interval}
          cancel_at={subscription.cancel_at}
        />
      )}

      <div className="flex gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Free plan</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button disabled={!subscription}>
              {!subscription ? 'Current Plan' : 'Downgrade'}
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Pro plan</CardTitle>
          </CardHeader>
          <CardFooter>
            <SubscribeButton status={subscription?.status} />
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};
