import { getUserProfileData, getUserSubscription } from "@/utils/supabase-server";
import { currentUser } from "@clerk/nextjs/server";
import { JournalEntry } from "./components";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

export default async function Journal() {
  const user = await currentUser();
  const subscription = user && await getUserSubscription(user.id);
  const profileData = user && await getUserProfileData(user.id);

  const isTrialEnded = () => {
    const now = new Date();
    if (user && !subscription) {
      return now > new Date(profileData.trial_end)
    }
  }

  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Journal Entry</h1>
        <p className="text-muted-foreground">
          Write about your day and get AI-powered insights
        </p>
      </div>

      {isTrialEnded() ? (
        <Card className="px-4 flex items-center">
          <p className="font-medium text-lg">
            Oops, your trial is aleady ended, please subscribe to our PRO plan to continue using this site
          </p>

          <Link href='/pricing'>
            <Button>Subscribe to PRO plan</Button>
          </Link>
        </Card>
      ) : (
        <JournalEntry />
      )}
    </main>
  );
};
