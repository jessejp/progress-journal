import React, { type PropsWithChildren } from "react";
import clsx from "clsx";
import Link from "next/link";

interface Props {
  intent: "open" | "accept" | "cancel";
  action?: () => Promise<undefined>;
  link?: string;
}

const Button: React.FC<PropsWithChildren<Props>> = ({
  children,
  intent,
  action,
  link,
}) => {
  if (action) {
    return (
      <button
        onClick={action}
        className={clsx(
          "rounded py-4 px-6 text-2xl font-bold text-white",
          { "bg-blue-500 hover:bg-blue-700": intent === "open" },
          { "bg-green-500 hover:bg-green-700": intent === "accept" },
          { "bg-red-500 hover:bg-red-700": intent === "cancel" }
        )}
      >
        {children}
      </button>
    );
  } else if (link) {
    return (
      <Link
        href={link}
        className={clsx(
          "rounded py-4 px-6 text-2xl font-bold text-white",
          { "bg-blue-500 hover:bg-blue-700": intent === "open" },
          { "bg-green-500 hover:bg-green-700": intent === "accept" },
          { "bg-red-500 hover:bg-red-700": intent === "cancel" }
        )}
      >
        {children}
      </Link>
    );
  } else {
    return null;
  }
};

export default Button;
