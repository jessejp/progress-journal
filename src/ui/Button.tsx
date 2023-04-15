import type { PropsWithChildren } from "react";
import clsx from "clsx";
import Link from "next/link";

interface Props {
  intent: "open" | "accept" | "cancel";
  action?: () => Promise<void> | void;
  link?: string;
  style?: "default" | "small";
}

const Button: React.FC<PropsWithChildren<Props>> = ({
  children,
  intent,
  action,
  link,
  style = "default",
}) => {
  if (action) {
    return (
      <button
        onClick={action}
        className={clsx(
          "rounded font-bold text-white",
          { "px-6 py-4 text-2xl": style === "default" },
          { "px-4 py-2 text-xl": style === "small" },
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
          "rounded font-bold text-white",
          { "px-6 py-4 text-2xl": style === "default" },
          { "px-4 py-2 text-xl": style === "small" },
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
