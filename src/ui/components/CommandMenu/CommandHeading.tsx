import clsx from "clsx";
import React, { type PropsWithChildren } from "react";

interface CommandHeadingProps extends PropsWithChildren {
  intent?: "primary" | "option" | "destructive";
}

const CommandHeading: React.FC<CommandHeadingProps> = ({
  children,
  intent = "option",
}) => {
  return (
    <div className="px-2 py-1.5 ">
      <h4
        className={clsx("text-sm font-semibold", {
          "text-slate-100": intent === "option",
          "text-lime-500": intent === "primary",
          "text-orange-500": intent === "destructive",
        })}
      >
        {children}
      </h4>
    </div>
  );
};

export default CommandHeading;
