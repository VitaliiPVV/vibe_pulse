import { ManageBillingButton } from "@/components/ManageBillingButton";
import { DateFormatting } from "../../utils";

interface ManageSectionProps {
  amount: number;
  currency: string;
  interval: string;
  cancel_at: Date;
};

const ManageSection = ({ amount, currency, interval, cancel_at }: ManageSectionProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p>Current Plan:</p>
        <p className="text-xl font-semibold">Pro Plan - {amount / 100} {currency} / {interval}</p>
      </div>
      <div>
        <ManageBillingButton />
        {cancel_at ? (
          <p>Until {DateFormatting(cancel_at)}</p>
        ) : null}
      </div>
    </div>
  );
};

export default ManageSection;
