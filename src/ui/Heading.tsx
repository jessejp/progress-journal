import type { PropsWithChildren } from "react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface HeadingProps {
  sessionData?: Session | null;
}

const Heading: React.FC<PropsWithChildren<HeadingProps>> = ({
  children,
  sessionData,
}) => {
  return (
    <div className="mt-3 flex h-1/6 max-h-16 flex-row justify-evenly">
      <h1 className="text-center text-2xl font-bold text-zinc-100 md:text-4xl">
        <Link className="hover:bg-zinc-800 hover:text-cyan-400" href="/">
          {children}
        </Link>
      </h1>
      {sessionData && (
        <button
          className="text-red-700 hover:bg-zinc-800 hover:text-cyan-400"
          onClick={() => {
            signOut();
          }}
        >
          log off 📴
        </button>
      )}
    </div>
  );
};

export default Heading;
