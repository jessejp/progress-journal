import React, { type PropsWithChildren } from "react";

const MainContent: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="my-3 flex h-4/6 w-full justify-center bg-slate-800">
      <div className="flex w-11/12 flex-col items-center overflow-y-scroll pb-6 scrollbar scrollbar-thumb-cyan-900 md:w-4/5">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
