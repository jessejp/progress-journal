import React, { type PropsWithChildren } from "react";

const MainContent: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="my-6 flex h-full w-full justify-center rounded bg-slate-800">
      <div className="flex w-10/12 flex-col items-center overflow-scroll md:w-4/5">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
