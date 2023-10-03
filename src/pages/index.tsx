import { type NextPage } from "next";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import FrontPageLayout from "../ui/layouts/FrontPageLayout";
import AppLayout from "../ui/layouts/AppLayout";
import Button from "../ui/primitives/Button";
import ButtonContainer from "../ui/wrappers/ButtonContainer";
import MainContent from "../ui/wrappers/MainContent";
import Subjects from "../components/Subjects";
import { type SessionData } from "../types/next-auth";
import Authentication from "../components/Authentication";
import LogoHeading from "../ui/typography/LogoHeading";
import CommandMenu from "../ui/components/CommandMenu/CommandMenu";
import CommandHeading from "../ui/components/CommandMenu/CommandHeading";
import { trpc } from "../utils/trpc";
import Command from "../ui/components/CommandMenu/Command";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const [loadApp, setLoadApp] = useState(!!sessionData);

  const subjectsQuery = trpc.subject.getSubjects.useQuery();

  if (!loadApp)
    return (
      <LandingPage
        sessionData={sessionData}
        onGoToApp={() => {
          setLoadApp(true);
        }}
      />
    );

  return (
    <AppLayout page="home">
      <LogoHeading />

      <MainContent>
        <Subjects data={{ data: subjectsQuery.data }} />
        <div className="mt-3"></div>
        <Button
          icon="settings-neutral-800.svg"
          intent="primary"
          link="/configure"
        >
          Configure Subjects
        </Button>
      </MainContent>

      <ButtonContainer
        mainButton={
          <CommandMenu
            button={
              <Button icon="plus.svg" intent="primary" variant="rounded-full">
                New Entry
              </Button>
            }
          >
            <CommandHeading>Select Subject</CommandHeading>
            {subjectsQuery.data?.map((subject) => {
              return (
                <Command
                  icon="plus-circle-slate-100.svg"
                  key={subject.id}
                  link={`/subjects/${subject.name}/entry`}
                >
                  {subject.name}
                </Command>
              );
            })}
          </CommandMenu>
        }
        iconButton={
          <>
            <Button
              icon="settings-neutral-300.svg"
              intent="ghost"
              variant="just-icon-circle"
              link="/configure"
            />
            <Button
              icon="user-neutral-300.svg"
              intent="ghost"
              variant="just-icon-circle"
              action={sessionData ? () => signOut() : () => signIn()}
            />
          </>
        }
        variant="ghost-icons"
      />
    </AppLayout>
  );
};

export default Home;

interface LandingPageProps extends SessionData {
  onGoToApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  sessionData,
  onGoToApp,
}) => {
  return (
    <FrontPageLayout>
      <div className="relative flex w-full max-w-4xl flex-col items-center justify-between bg-hero bg-cover bg-center bg-no-repeat pb-4 text-center after:absolute after:z-0 after:min-h-smallScreen after:w-full after:bg-gradient-to-t after:from-neutral-800 after:from-50% after:via-slate-transparent after:via-70% after:to-neutral-800 after:to-95%">
        <div className="relative z-10 h-smallScreenHalf w-full">
          <LogoHeading />
        </div>
        <div className="bottom-0 z-10 flex w-11/12 flex-col justify-center gap-4 pb-6">
          <h2 className="text-3xl font-bold text-slate-100">
            Progress Journal helps you to find your footing
          </h2>
          <Button intent="primary" variant="rounded-full" action={onGoToApp}>
            Proceed to the App
          </Button>
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

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-end text-center">
        <div className="h-80 w-full bg-mobile-user bg-cover bg-center"></div>
        <div className="relative -top-14 flex w-11/12 flex-col justify-center gap-4 bg-neutral-800 px-4 pb-6 pt-4 text-slate-100">
          <h2 className="text-3xl font-bold">
            Progress Journal helps you to find your footing
          </h2>
          <p>
            You can use Progress Journal to track your progress in any area!
            It&apos;s a great way to keep yourself accountable and to see how
            far you&apos;ve come.
          </p>
          <Authentication
            sessionData={sessionData}
            icon="discord.svg"
            text={!sessionData ? "Sign in with Discord" : "Sign out"}
          />
        </div>
      </div>

      <div className="relative flex w-full max-w-4xl flex-col items-center justify-end text-center">
        <div className="flex w-full flex-col items-center justify-evenly gap-6 bg-exercising-user bg-cover bg-center pb-20 pt-6 after:absolute after:top-0 after:-z-0 after:h-4/5 after:w-full after:bg-lime-800 after:opacity-70 ">
          <div className="z-10 flex w-11/12 flex-col items-center justify-center gap-1 py-2 text-center text-slate-100">
            <p>&quot;There are no shortcuts to any place worth going.&quot;</p>
            <p className="text-sm">— Beverly Sills</p>
          </div>

          <div className="z-10 flex w-11/12 flex-col items-center justify-center gap-1 py-2 text-center text-slate-100">
            <p>
              &quot;Training is about skill development, not about winning or
              losing. You don’t need to win every battle, you only need to win
              the battles that count.&quot;
            </p>
            <p className="text-sm">— John Danaher</p>
          </div>
        </div>

        <div className="relative -top-14 flex w-11/12 flex-col justify-center gap-4 bg-neutral-800 px-4 pb-6 pt-4 text-slate-100">
          <h3 className="text-3xl font-bold">
            Progress Journal helps you to find your footing
          </h3>
        </div>
      </div>
      <div className="relative flex w-full max-w-4xl flex-col items-center justify-end gap-6 pb-20 text-center">
        <h4 className="font-bebasneue text-5xl text-lime-400">
          PROGRESS JOURNAL
        </h4>
        <Authentication
          sessionData={sessionData}
          icon="discord.svg"
          text={!sessionData ? "Sign in with Discord" : "Sign out"}
        />
      </div>
    </FrontPageLayout>
  );
};
