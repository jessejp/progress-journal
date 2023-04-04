import React, { PropsWithChildren } from "react";
import clsx from "clsx";

interface Props {
  onClick?: () => void;
  intent: "open" | "accept" | "cancel";
}

const Button: React.FC<PropsWithChildren<Props>> = ({ children, intent }) => {
  return (
    <button
      className={clsx(
        "rounded  py-2 px-4 font-bold text-white",
        {"bg-blue-500 hover:bg-blue-700": intent === "open"},
        {"bg-green-500 hover:bg-green-700": intent === "accept"},
        {"bg-red-500 hover:bg-red-700": intent === "cancel"}
      )}
    >
      {children}
    </button>
  );
};

export default Button;