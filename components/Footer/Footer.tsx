import Link from "next/link";
import { LINKS } from "../Header/consts";
import Image from "next/image";
import logo from '@/public/VibePulseLogo.webp';

const Footer = () => {
  return (
    <footer className="h-48 border-t py-4 px-4 md:px-8 lg:px-16 flex justify-between items-center">
      <Link href='/journal' className="cursor-pointer w-fit">
        <div className="w-24">
          <Image
            src={logo}
            alt="logo"
            width={96}
            height={45}
          />
        </div>
      </Link>

      <div className="flex flex-col lg:flex-row gap-3 text-black">
        {LINKS.map((item) => (
          <Link key={item.id} href={item.link} className="font-medium">
            {item.name}
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
