import React, { type PropsWithChildren } from "react";

const MainContent: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="my-3 flex h-5/6 w-full justify-center">
      <div className="flex w-34/36 flex-col overflow-y-scroll scrollbar-none scrollbar-thumb-transparent">
        {children}
        <div className="mt-12" />
      </div>
    </main>
  );
};

export default MainContent;
