import Head from "next/head";
import { type PropsWithChildren } from "react";

interface Props {
  page: string;
}

const Layout: React.FC<PropsWithChildren<Props>> = ({ children, page }) => {
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
      <div className="flex min-h-screen flex-col items-center bg-slate-800">
        <div className="flex h-screen w-full flex-col items-center justify-between w-full md:w-3/4">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
