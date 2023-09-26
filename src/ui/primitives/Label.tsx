import React, { type PropsWithChildren } from "react";

interface LabelProps extends PropsWithChildren {
  htmlFor: string;
}

const Label: React.FC<LabelProps> = ({ children, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="text-sm text-slate-100">
      {children}
    </label>
  );
};

export default Label;
