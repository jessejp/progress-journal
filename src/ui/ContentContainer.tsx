import React, { type PropsWithChildren } from "react";

const ContentContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="bg-neutral-700 p-3 w-full rounded-md">{children}</div>;
};

export default ContentContainer;
