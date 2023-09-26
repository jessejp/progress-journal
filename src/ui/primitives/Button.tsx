import type { MouseEventHandler, PropsWithChildren } from "react";
import clsx from "clsx";
import ButtonOrLink from "../utils/ButtonOrLink";

type ButtonStyle = "default" | "rounded-full" | "just-icon-circle";

interface Props {
  intent: "primary" | "secondary" | "cancel" | "option" | "disabled";
  action?: MouseEventHandler | undefined;
  link?: string;
  style?: ButtonStyle;
  icon?: string;
}

const Button: React.FC<PropsWithChildren<Props>> = (props) => {
  const { intent, style = "default", children } = props;
  const variants = [
    { "rounded-md": style === "default" },
    { "rounded-full": style === "rounded-full" },
    { "px-3 py-3 rounded-full": style === "just-icon-circle" },
    { "px-4 py-2": style !== "just-icon-circle" },
    { "bg-lime-400 hover:bg-lime-500": intent === "primary" },
    { "bg-violet-500 hover:bg-violet-700": intent === "secondary" },
    { "bg-neutral-800 hover:bg-neutral-700": intent === "option" },
    { "bg-red-500 hover:bg-red-700": intent === "cancel" },
    { "bg-slate-700 hover:bg-slate-900": intent === "disabled" },
  ];

  return (
    <ButtonOrLink
      className={clsx(
        "flex items-center gap-2 self-center font-medium text-sm text-zinc-800",
        ...variants
      )}
      {...props}
    >
      {children}
    </ButtonOrLink>
  );
};

export default Button;
