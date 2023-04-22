import React, { type PropsWithChildren } from "react";

const ButtonContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return <nav className="flex flex-row justify-evenly">{children}</nav>;
};

export default ButtonContainer;
