import clsx from "clsx";
import React, { type PropsWithChildren } from "react";

interface ButtonContainerProps extends PropsWithChildren {
  mainButton: React.ReactNode;
  iconButton?: React.ReactNode;
  variant?: "default" | "ghost-icons";
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({
  mainButton,
  iconButton,
  variant = "default",
}) => {
  return (
    <div
      className={clsx(
        "fixed bottom-4 flex w-fit shrink-0 justify-between gap-3 rounded-full bg-neutral-700 p-1.5 shadow",
        {
          "pr-3": variant === "ghost-icons",
        }
      )}
    >
      {mainButton}

      {!!iconButton && <> {iconButton} </>}
    </div>
  );
};

export default ButtonContainer;
