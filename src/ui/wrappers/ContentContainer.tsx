import clsx from "clsx";
import React, { type PropsWithChildren } from "react";

interface ContentContainerProps extends PropsWithChildren {
  background?: "violet";
  direction?: "row" | "column";
}

const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  background,
  direction = "column",
}) => {
  return (
    <div
      className={clsx("flex w-full gap-3 rounded-md bg-neutral-700 text-slate-100 p-3", {
        "bg-violet-700": background === "violet",
        "flex-row": direction === "row",
        "flex-col": direction === "column",
      })}
    >
      {children}
    </div>
  );
};

export default ContentContainer;
