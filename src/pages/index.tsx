import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import Layout from "../ui/Layout";
import Button from "../ui/Button";
import Heading from "../ui/Heading";
import { trpc } from "../utils/trpc";
import ButtonContainer from "../ui/ButtonContainer";
import MainContent from "../ui/MainContent";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <Layout page="home">
      <Heading sessionData={sessionData}>
        {sessionData ? "Progress Journal" : "Unauthorized"}
      </Heading>

      <MainContent>{sessionData && <Subjects />}</MainContent>

      <ButtonContainer>
        {!sessionData && <AuthShowcase sessionData={sessionData} />}
        {sessionData && (
          <Button intent="open" link="/configure">
            Configure
          </Button>
        )}
      </ButtonContainer>
    </Layout>
  );
};

export default Home;

const Subjects: React.FC = () => {
  const subjectsQuery = trpc.subject.getSubjects.useQuery();
  const { data } = subjectsQuery;
  return (
    <>
      {data?.map((subject) => {
        const url = `subjects/${subject.name}`;
        return (
          <Link
            key={subject.id}
            href={url}
            className="m-3 w-2/5 rounded bg-zinc-200 px-3 py-5 text-center text-lg text-zinc-900"
          >
            {subject.name}
          </Link>
        );
      })}
    </>
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
