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
import FrontPageLayout from "../ui/landing-page/FrontPageLayout";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  if (!sessionData) return <LandingPage sessionData={sessionData} />;

  return (
    <Layout page="home">
      <Heading sessionData={sessionData}>Progress Journal</Heading>

      <MainContent>{sessionData && <Subjects />}</MainContent>

      <ButtonContainer>
        <Button intent="open" link="/configure">
          Configure
        </Button>
      </ButtonContainer>
    </Layout>
  );
};

export default Home;

const Subjects: React.FC = () => {
  const subjectsQuery = trpc.subject.getSubjects.useQuery();
  const { data } = subjectsQuery;

  if (!data)
    return (
      <p className="text-red-600">
        Create your first subject in order to start journaling!
      </p>
    );

  return (
    <>
      {data.map((subject) => {
        const url = `subjects/${subject.name}`;
        return (
          <Link
            key={subject.id}
            href={url}
            className="m-3 w-full max-w-sm rounded bg-zinc-200 px-3 py-5 text-center text-lg text-zinc-900"
          >
            {subject.name}
          </Link>
        );
      })}
    </>
  );
};

type SessionData = {
  sessionData: Session | null;
  text?: string;
  icon?: string;
};

const AuthShowcase: React.FC<SessionData> = (props) => {
  const { sessionData } = props;

  return (
    <Button
      intent={sessionData ? "cancel" : "open"}
      action={sessionData ? () => signOut() : () => signIn()}
      style="small rounded-full"
      icon={props.icon}
    >
      {!!props.text && props.text}
      {!props.text && (sessionData ? "Sign out" : "Sign in")}
    </Button>
  );
};

const LandingPage: React.FC<SessionData> = (props) => {
  const { sessionData } = props;

  return (
    <FrontPageLayout>
      <div className="relative flex flex-col items-center justify-between bg-hero bg-cover bg-center bg-no-repeat pb-4 text-center after:absolute after:z-0 after:min-h-smallScreen after:w-full after:bg-gradient-to-t after:from-slate-800 after:from-50% after:via-slate-transparent after:via-70% after:to-slate-800 after:to-95%">
        <div className="relative z-10 h-smallScreenHalf w-full">
          <h1 className="mt-4 font-bebasneue text-4xl text-lime-400">
            PROGRESS JOURNAL
          </h1>
        </div>
        <div className="bottom-0 z-10 flex w-11/12 flex-col justify-center gap-4 pb-6">
          <h2 className="text-3xl font-bold text-zinc-100">
            Progress Journal helps you to find your footing
          </h2>
          <AuthShowcase
            sessionData={sessionData}
            icon="discord.svg"
            text="Sign in with Discord"
          />
          <p className="text-sm text-zinc-50">
            Not a member yet?{" "}
            <a
              onClick={sessionData ? () => signOut() : () => signIn()}
              className="cursor-pointer underline hover:text-lime-400"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-end text-center">
        <div className="h-80 w-full bg-mobile-user bg-cover bg-center"></div>
        <div className="relative -top-14 flex w-11/12 flex-col justify-center gap-4 bg-slate-800 px-4 pb-6 pt-4 text-zinc-100">
          <h2 className="text-3xl font-bold">
            Progress Journal helps you to find your footing
          </h2>
          <p>
            You can use Progress Journal to track your progress in any area!
            It&apos;s a great way to keep yourself accountable and to see how
            far you&apos;ve come.
          </p>
          <AuthShowcase
            sessionData={sessionData}
            icon="discord.svg"
            text="Sign in with Discord"
          />
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-end text-center">
        <div className="flex w-full flex-col items-center justify-evenly gap-6 bg-exercising-user bg-cover bg-center pb-20 pt-6 after:absolute after:top-0 after:-z-0 after:h-4/5 after:w-full after:bg-lime-800 after:opacity-70 ">
          <div className="z-10 flex w-11/12 flex-col items-center justify-center gap-1 py-2 text-center text-zinc-100">
            <p>&quot;There are no shortcuts to any place worth going.&quot;</p>
            <p className="text-sm">— Beverly Sills</p>
          </div>

          <div className="z-10 flex w-11/12 flex-col items-center justify-center gap-1 py-2 text-center text-zinc-100">
            <p>
              &quot;Training is about skill development, not about winning or
              losing. You don’t need to win every battle, you only need to win
              the battles that count.&quot;
            </p>
            <p className="text-sm">— John Danaher</p>
          </div>
        </div>

        <div className="relative -top-14 flex w-11/12 flex-col justify-center gap-4 bg-slate-800 px-4 pb-6 pt-4 text-zinc-100">
          <h3 className="text-3xl font-bold">
            Progress Journal helps you to find your footing
          </h3>
        </div>
      </div>
      <div className="relative flex flex-col items-center justify-end gap-6 pb-20 text-center">
        <h4 className="font-bebasneue text-5xl text-lime-400">
          PROGRESS JOURNAL
        </h4>
        <AuthShowcase
          sessionData={sessionData}
          icon="discord.svg"
          text="Sign in with Discord"
        />
      </div>
    </FrontPageLayout>
  );
};
