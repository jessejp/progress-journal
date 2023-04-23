import React, { type PropsWithChildren } from "react";

const MainContent: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="my-3 flex max-h-[32rem] w-full justify-center rounded bg-slate-800">
      <div className="flex w-11/12 flex-col items-center overflow-y-scroll scrollbar-thin scrollbar-thumb-cyan-900 md:w-4/5">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
