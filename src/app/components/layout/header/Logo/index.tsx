import GlobeLogo from "@/app/components/logo";
import Link from "next/link";

interface HeaderProps {}
const Logo: React.FC<HeaderProps> = () => {
  return (
    <Link className="flex items-center gap-1" href="/">
      <span className="italic instrument-font text-5xl font-bold">TURK3</span>
      <div className="mt-2">
        <GlobeLogo />
      </div>
    </Link>
  );
};

export default Logo;
