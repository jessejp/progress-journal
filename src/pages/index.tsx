import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import Layout from "../components/layouts/layout";
import Button from "../ui/Button";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <Layout page="home">
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-400">
        <AuthShowcase sessionData={sessionData} />
        {sessionData && (
          <>
            <Subjects />
            <Link href="/configure">Configure</Link>
          </>
        )}
      </main>
    </Layout>
  );
};

export default Home;

const Subjects: React.FC = () => {
  return (
    <div className="flex w-80 flex-row flex-wrap justify-center">
      <Link href="/testing" className="m-2 w-40 items-center justify-center bg-slate-100 px-3 py-2 text-center">
        Test 1
      </Link>
      <Link href="/testing" className="m-2 w-40 items-center justify-center bg-slate-100 px-3 py-2 text-center">
        Test 1
      </Link>
      <Link href="/testing" className="m-2 w-40 items-center justify-center bg-slate-100 px-3 py-2 text-center">
        Test 1
      </Link>
      <Link href="/testing" className="m-2 w-40 items-center justify-center bg-slate-100 px-3 py-2 text-center">
        Test 1
      </Link>
    </div>
  );
};

const AuthShowcase: React.FC<{ sessionData: Session | null }> = (props) => {
  const { sessionData } = props;

  return (
    <div className="flex flex-row items-center justify-center gap-4">
      <p className="text-center text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <Button
        intent={sessionData ? "cancel" : "open"}
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
};
