import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LINKS } from "./consts";
import Image from "next/image";
import logo from '@/public/VibePulseLogo.webp';

const Header = () => {
  return (
    <header className="w-full border-b py-3 px-4 md:px-12 lg:px-20 flex items-center justify-between">
      <Link href='/journal' className="cursor-pointer">
        <div className="w-12">
          <Image
            src={logo}
            alt="logo"
            width={70}
            height={45}
          />
        </div>
      </Link>

      <div className="flex gap-3 text-black">
        {LINKS.map((item) => (
          <Link key={item.id} href={item.link} className="font-semibold">
            {item.name}
          </Link>
        ))}
      </div>

      <UserButton
        appearance={{
          layout: {
            unsafe_disableDevelopmentModeWarnings: true,
          },
        }}
      />
    </header>
  );
};

export default Header;
