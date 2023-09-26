import type { MouseEventHandler, PropsWithChildren } from "react";
import clsx from "clsx";
import ButtonOrLink from "./utils/ButtonOrLink";

type ButtonStyle = "default" | "rounded-full";

interface Props {
  intent: "primary" | "secondary" | "cancel" | "selection" | "disabled";
  action?: MouseEventHandler | undefined;
  link?: string;
  style?: ButtonStyle;
  icon?: string;
}

const Button: React.FC<PropsWithChildren<Props>> = (props) => {
  const { intent, style = "default", children } = props;
  const variants = [
    { "rounded-full": style.includes("rounded-full") },
    { "rounded-md": !style.includes("rounded-full") },
    { "bg-lime-400 hover:bg-lime-500": intent === "primary" },
    { "bg-violet-500 hover:bg-violet-700": intent === "secondary" },
    { "bg-red-500 hover:bg-red-700": intent === "cancel" },
    { "bg-slate-500 hover:bg-slate-700": intent === "selection" },
    { "bg-slate-700 hover:bg-slate-900": intent === "disabled" },
  ];

  return (
    <ButtonOrLink
      className={clsx(
        "flex items-center self-center font-bold text-zinc-800 px-8 py-3 text-base",
        ...variants
      )}
      {...props}
    >
      {children}
    </ButtonOrLink>
  );
};

export default Button;
