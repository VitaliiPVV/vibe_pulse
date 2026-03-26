"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui";

interface SubscribeButtonProps {
  status: string;
}

const SubscribeButton = ({ status }: SubscribeButtonProps) => {
  const router = useRouter();

  const handleBuy = async () => {
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      
      if (!res.ok) {
        console.error("Checkout error:", res.status, res);
        return;
      }

      const data = await res.json();
      router.push(data.url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button
      onClick={handleBuy}
      disabled={status === 'active'}
    >
      {status === 'active' ? 'Current Plan' : 'Subscribe'}
    </Button>
  );
};

export default SubscribeButton;
