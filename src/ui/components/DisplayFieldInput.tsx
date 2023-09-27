import clsx from "clsx";
import React, { type PropsWithChildren } from "react";

interface DisplayFieldInputProps extends PropsWithChildren {
  value: string | number | boolean | null;
  inputLabel: string | null;
  intent?: "primary" | "destructive";
}

const DisplayFieldInput: React.FC<DisplayFieldInputProps> = ({
  value,
  inputLabel,
  intent = "primary",
}) => {
  return (
    <div className="flex w-16 flex-col items-center">
      <span
        className={clsx("text-lg font-semibold", {
          "text-orange-500": intent === "destructive",
          "text-slate-100": intent === "primary",
        })}
      >
        {value}
      </span>
      <span className="text-sm text-center text-slate-100">{inputLabel}</span>
    </div>
  );
};

export default DisplayFieldInput;
