import React, { type PropsWithChildren } from "react";

const H2: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <h2 className="text-2xl font-medium text-slate-100">{children}</h2>
    </>
  );
};

export default H2;
