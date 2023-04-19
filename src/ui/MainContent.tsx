import React, { type PropsWithChildren } from "react";

const MainContent: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="my-6 flex w-full h-full justify-center overflow-scroll rounded bg-slate-800">
      <div className="flex flex-col items-center w-10/12 md:w-4/5">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
