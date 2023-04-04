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
    <div className="flex flex-row justify-evenly">
      <h1 className="text-center text-4xl font-bold">
        <Link className="hover:text-cyan-400 hover:bg-zinc-800" href="/">{children}</Link>
      </h1>
      {sessionData && (
        <button
          className="text-red-700 hover:text-cyan-400 hover:bg-zinc-800"
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
