import GlobeLogo from "@/app/components/logo";
import Link from "next/link";

interface HeaderProps {}
const Logo: React.FC<HeaderProps> = () => {
  return (
    <Link href="/">
      <GlobeLogo />
    </Link>
  );
};

export default Logo;
