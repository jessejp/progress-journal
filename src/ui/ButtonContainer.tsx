import React, { type PropsWithChildren } from "react";

const ButtonContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <nav className="mb-4 flex max-h-20 flex-row justify-evenly gap-2">
      {children}
    </nav>
  );
};

export default ButtonContainer;
