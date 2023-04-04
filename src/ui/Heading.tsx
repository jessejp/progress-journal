import type { PropsWithChildren } from "react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface HeadingProps {
    sessionData: Session | null;
}

const Heading: React.FC<PropsWithChildren<HeadingProps>> = ({children, sessionData}) => {
  return (
    <div className="flex flex-row justify-between">
      <h1 className="text-center text-4xl font-bold">
       {children}
      </h1>
      {sessionData && (
        <button
          className="text-red-700"
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
