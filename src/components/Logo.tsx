import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo-no-background.png";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      <Image
        src={logo}
        height="60"
        quality={100}
        width="100"
        alt="Readit logo"
      />
    </Link>
  );
}

export default Logo;
