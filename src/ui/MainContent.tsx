import React, { type PropsWithChildren } from "react";

const MainContent: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="my-6 flex h-full items-center justify-center overflow-scroll rounded bg-slate-700">
      <div className="flex flex-wrap justify-around">{children}</div>
    </main>
  );
};

export default MainContent;