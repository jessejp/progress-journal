import type { PropsWithChildren } from "react";
import type { Session } from "next-auth";
import Link from "next/link";

interface HeadingProps {
  sessionData?: Session | null;
}

const Heading: React.FC<PropsWithChildren<HeadingProps>> = ({
  children,
}) => {
  return (
    <div className="relative mt-3 flex w-full max-h-16 flex-row justify-evenly items-center">
      <h1 className="text-center text-2xl font-bold text-zinc-300 md:text-4xl">
        <Link href="/">
          {children}
        </Link>
      </h1>
    </div>
  );
};

export default Heading;
