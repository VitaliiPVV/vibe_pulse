import { UserProfile } from "@clerk/nextjs";

const Account = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <UserProfile
        routing="hash"
        appearance={{
          layout: {
            unsafe_disableDevelopmentModeWarnings: true,
          },
        }}
      />
    </div>
  );
};

export default Account;
