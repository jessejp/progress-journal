import clsx from "clsx";
import React, { type PropsWithChildren } from "react";

interface InputContainerProps extends PropsWithChildren {
  background?: "violet";
  variant?: "unpadded";
}

const InputContainer: React.FC<InputContainerProps> = ({
  children,
  background,
  variant,
}) => {
  return (
    <div
      className={clsx("flex w-full flex-col gap-1.5 rounded-md", {
        "bg-violet-800": background === "violet",
        "p-0": variant === "unpadded",
        "p-2.5": variant !== "unpadded",
      })}
    >
      {children}
    </div>
  );
};

export default InputContainer;
