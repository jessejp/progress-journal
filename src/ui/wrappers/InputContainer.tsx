import clsx from "clsx";
import React, { type PropsWithChildren } from "react";

interface InputContainerProps extends PropsWithChildren {
  background?: "violet";
}

const InputContainer: React.FC<InputContainerProps> = ({
  children,
  background,
}) => {
  return (
    <div
      className={clsx("flex flex-col gap-1.5 p-2.5 rounded-md w-full", {
        "bg-violet-800": background === "violet",
      })}
    >
      {children}
    </div>
  );
};

export default InputContainer;
