import Head from "next/head";
import { type PropsWithChildren } from "react";

interface Props {
  page: string;
}

const AppLayout: React.FC<PropsWithChildren<Props>> = ({ children, page }) => {
  const title = `${
    page.charAt(0).toUpperCase() + page.slice(1)
  } | Progress Journal`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-start h-smallScreen w-full bg-slate-800">
        <div className="flex flex-col items-center justify-start h-full w-full">
          {children}
        </div>
      </div>
    </>
  );
};

export default AppLayout;