import React, { type PropsWithChildren } from "react";

const MainContent: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="my-3 flex h-full w-full justify-center overflow-scroll rounded bg-slate-800">
      <div className="flex w-11/12 flex-col items-center md:w-4/5">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
