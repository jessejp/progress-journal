import type { MouseEventHandler, PropsWithChildren } from "react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";

type ButtonStyle = "default" | "small" | "xsmall" | "rounded-full";

interface Props {
  intent: "open" | "accept" | "cancel" | "selection" | "disabled" | "undo";
  action?: MouseEventHandler | undefined;
  link?: string;
  style?: ButtonStyle | `${ButtonStyle} ${ButtonStyle}`;
  icon?: string;
}

const Button: React.FC<PropsWithChildren<Props>> = ({
  children,
  intent,
  action,
  link,
  style = "default",
  icon,
}) => {
  const variants = [
    { "px-8 py-3 text-xl": style.includes("default") === true },
    { "px-6 py-2 text-base": style.includes("small") === true },
    { "px-2 py-1 text-sm": style.includes("xsmall") === true  },
    { "rounded-full": style.includes("rounded-full") === true },
    { "rounded-lg": style.includes("rounded-full") === false },
    { "bg-lime-400 hover:bg-lime-500": intent === "open" },
    { "bg-green-500 hover:bg-green-700": intent === "accept" },
    { "bg-red-500 hover:bg-red-700": intent === "cancel" },
    { "bg-indigo-500 hover:bg-indigo-700": intent === "undo" },
    { "bg-slate-500 hover:bg-slate-700": intent === "selection" },
    { "bg-slate-700 hover:bg-slate-900": intent === "disabled" },
  ];

  if (action) {
    return (
      <button
        onClick={action}
        className={clsx(
          "flex self-center items-center font-bold text-zinc-800",
          ...variants
        )}
      >
        {icon && (
          <Image
            src={`/images/${icon}`}
            width={1}
            height={1}
            alt={`${icon.split(".")[0]} icon`}
            className="mr-2 h-6 w-6 opacity-75"
          />
        )}
        {children}
      </button>
    );
  } else if (link) {
    return (
      <Link
        href={link}
        className={clsx(
          "flex self-center font-bold text-zinc-800",
          ...variants
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
