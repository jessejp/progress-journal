import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import Layout from "../components/layouts/layout";
import Button from "../ui/Button";
import Heading from "../ui/Heading";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <Layout page="home">
      <Heading sessionData={sessionData}>{sessionData ? "Progress Journal" : "Unauthorized"}</Heading>

      <main>{sessionData && <Subjects />}</main>

      <nav className="flex w-full flex-row justify-evenly">
        {!sessionData && <AuthShowcase sessionData={sessionData} />}
        {sessionData && (
          <Button intent="open" link="/configure">
            Configure
          </Button>
        )}
      </nav>
    </Layout>
  );
};

export default Home;

const Subjects: React.FC = () => {
  const subjectsQuery = trpc.subject.getSubjects.useQuery();
  const { data } = subjectsQuery;
  return (
    <div className="flex flex-row flex-wrap justify-center">
      {data?.map((subject) => (
        <Link
          key={subject.id}
          href={`/subjects/${subject.id}`}
          className="m-2 items-center justify-center bg-slate-100 px-3 py-2 text-center"
        >
          {subject.name}
        </Link>
      ))}
    </div>
  );
};

const AuthShowcase: React.FC<{ sessionData: Session | null }> = (props) => {
  const { sessionData } = props;

  return (
    <Button
      intent={sessionData ? "cancel" : "open"}
      action={sessionData ? () => signOut() : () => signIn()}
    >
      {sessionData ? "Sign out" : "Sign in"}
    </Button>
  );
};
