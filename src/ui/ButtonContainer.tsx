import React, { type PropsWithChildren } from "react";

const ButtonContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <nav className="mb-4 flex h-1/6 max-h-20 flex-row justify-evenly">
      {children}
    </nav>
  );
};

export default ButtonContainer;
