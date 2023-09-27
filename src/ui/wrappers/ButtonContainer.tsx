import React, { type PropsWithChildren } from "react";

interface ButtonContainerProps extends PropsWithChildren {
  mainButton: React.ReactNode;
  iconButton?: React.ReactNode;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({
  mainButton,
  iconButton,
}) => {
  return (
    <div className="fixed bottom-5 flex w-74 shrink-0 justify-between rounded-full bg-neutral-700 p-1.5">
      {mainButton}

      {!!iconButton && (
        <div className="flex w-max grow justify-between px-6">{iconButton}</div>
      )}
    </div>
  );
};

export default ButtonContainer;
