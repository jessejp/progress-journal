import type { MouseEventHandler, PropsWithChildren } from "react";
import clsx from "clsx";
import ButtonOrLink from "../utils/ButtonOrLink";

export type ButtonVariant = "default" | "rounded-full" | "just-icon-circle";
export type ButtonIntent =
  | "primary"
  | "secondary"
  | "cancel"
  | "option"
  | "disabled"
  | "ghost"
  | "destructive";

interface Props {
  intent: ButtonIntent;
  action?: MouseEventHandler | undefined;
  link?: string;
  variant?: ButtonVariant;
  icon?: string;
}

const Button: React.FC<PropsWithChildren<Props>> = (props) => {
  const { intent, variant = "default", children } = props;
  const styles = [
    { "rounded-md min-w-[7.5rem] justify-evenly": variant === "default" },
    {
      "rounded-full min-w-[7.5rem] justify-evenly": variant === "rounded-full",
    },
    { "px-3 py-3 rounded-full": variant === "just-icon-circle" },
    { "px-4 py-2": variant !== "just-icon-circle" },

    { "bg-lime-400 hover:bg-lime-500": intent === "primary" },
    { "bg-violet-500 hover:bg-violet-700": intent === "secondary" },
    { "bg-neutral-800 hover:bg-neutral-600": intent === "option" },
    { "bg-red-500 hover:bg-red-700": intent === "cancel" },
    { "bg-slate-700 ": intent === "disabled" },
    { "bg-transparent hover:bg-transparent": intent === "ghost" },
  ];

  return (
    <ButtonOrLink
      className={clsx(
        "flex items-center gap-2 self-center text-sm font-medium leading-6 text-zinc-800",
        ...styles
      )}
      {...props}
    >
      {children}
    </ButtonOrLink>
  );
};

export default Button;
