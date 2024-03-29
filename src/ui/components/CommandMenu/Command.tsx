import clsx from "clsx";
import Image from "next/image";
import React, { type PropsWithChildren } from "react";
import ButtonOrLink from "../../utils/ButtonOrLink";

interface CommandProps extends PropsWithChildren {
  intent?: "primary" | "option" | "destructive";
  icon: string;
  action?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  link?: string;
  activeSelection?: string | null | undefined;
}

const Command: React.FC<CommandProps> = ({
  children,
  icon,
  action,
  link,
  intent = "primary",
  activeSelection,
}) => {
  return (
    <ButtonOrLink
      intent={intent}
      className={clsx(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm font-medium text-slate-100",
        {
          "hover:bg-violet-500": intent === "primary",
          "hover:bg-neutral-600": intent === "option",
          "hover:bg-orange-500 hover:text-neutral-800":
            intent === "destructive",
          "bg-neutral-700": activeSelection === children,
        }
      )}
      action={action}
      link={link}
    >
      <Image
        src={`/icons/${icon}`}
        width={1}
        height={1}
        alt={`${icon.split(".")[0]} icon`}
        className="h-4 w-4"
      />
      <span>{children}</span>
    </ButtonOrLink>
  );
};

export default Command;
