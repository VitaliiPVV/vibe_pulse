import { SubscribeButton } from "@/components/SubscribeButton";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";
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
          <CardDescription className="text-md px-6">
            Free trial plan only for 1 week
          </CardDescription>
          <CardContent>
            <ul>
              <li>- free trial for 1 week</li>
              <li>- <span className="text-[#f00] font-semibold">No</span> average mood</li>
              <li>- <span className="text-[#f00] font-semibold">No</span> average stress level</li>
              <li>- <span className="text-[#f00] font-semibold">No</span> stress trend</li>
              <li>- <span className="text-[#f00] font-semibold">No</span> filters by date/mood/topic</li>
              <li>- Unlimited AI analizing of you entries</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button disabled={!subscription}>
              {!subscription ? 'Current Plan' : 'Downgrade'}
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl flex justify-between">
              <p>Pro plan</p>
              <p>Only 50 PLN/month</p>
            </CardTitle>
          </CardHeader>
          <CardDescription className="text-md px-6">
            Advanced features with a month subscription
          </CardDescription>
          <CardContent>
            <ul>
              <li>- All advanced features available</li>
              <li className="text-[#16ab16] font-semibold">- Average mood</li>
              <li className="text-[#16ab16] font-semibold">- Average stress level</li>
              <li className="text-[#16ab16] font-semibold">- Stress trend</li>
              <li className="text-[#16ab16] font-semibold">- Filters by date/mood/topic</li>
              <li>- Unlimited AI analizing of you entries</li>
            </ul>
          </CardContent>
          <CardFooter>
            <SubscribeButton status={subscription?.status} />
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};
