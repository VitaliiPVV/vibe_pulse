import { currentUser } from "@clerk/nextjs/server";
import { getUserSubscription } from "@/utils/supabase-server";
import { Content } from "./components";

export default async function Dashboard () {
  const user = await currentUser();
  const subscription = user && await getUserSubscription(user.id);

  return (
    <Content hasSubscription={user && subscription} />
  );
};
