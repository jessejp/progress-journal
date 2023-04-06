import React, { type PropsWithChildren } from "react";

const MainContent: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="my-6 h-full rounded bg-slate-700 flex items-center justify-center">
      <div className="flex flex-wrap justify-around">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
