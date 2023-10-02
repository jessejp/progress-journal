import React, { type PropsWithChildren } from "react";

interface ButtonContainerProps extends PropsWithChildren {
  mainButton: React.ReactNode;
  iconButton?: React.ReactNode;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({
  mainButton,
  iconButton,
}) => {
  console.log(iconButton);
  
  return (
    <div className="fixed bottom-4 flex w-fit shrink-0 justify-between gap-3 rounded-full bg-neutral-700 p-1.5 shadow">
      {mainButton}

      {!!iconButton && <> {iconButton} </>}
    </div>
  );
};

export default ButtonContainer;
