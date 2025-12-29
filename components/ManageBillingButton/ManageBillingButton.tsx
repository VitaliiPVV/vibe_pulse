"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui";

const ManageBillingButton = () => {
  const router = useRouter();

  const openPortal = async () => {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    router.push(data.url);
  };

  return (
    <Button onClick={openPortal}>
      Manage Billing
    </Button>
  );
}

export default ManageBillingButton;
