import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LINKS } from "./consts";

const Header = () => {
  return (
    <header className="w-full border-b py-3 px-4 md:px-12 lg:px-20 flex items-center justify-between">
      <Link href='/dashboard' className="cursor-pointer">
        <div>Logo</div>
      </Link>

      <div className="flex gap-3 text-black">
        {LINKS.map((item) => (
          <Link key={item.id} href={item.link} className="font-semibold">
            {item.name}
          </Link>
        ))}
      </div>

      <UserButton />
    </header>
  );
};

export default Header;
