import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Layout from "../ui/Layout";
import Heading from "../ui/Heading";
import MainContent from "../ui/MainContent";
import ButtonContainer from "../ui/ButtonContainer";
import Button from "../ui/Button";
import { useRouter } from "next/router";

const Settings: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const deleteAccount = trpc.auth.deleteAccount.useMutation({
    onSuccess: async () => {
        console.log('account deleted');
        
    },
  });

  console.log(router);

  return (
    <Layout page="User Settings">
      <Heading>User Settings</Heading>
      <MainContent>
        {sessionData && (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <h2 className="text-lg text-zinc-300">
              Sign out of Progress Journal:
            </h2>
            <button
              className="rounded bg-gray-600 px-3 py-2"
              onClick={() => {
                signOut({
                  redirect: true,
                  callbackUrl: "/",
                });
              }}
            >
              Sign out
            </button>
            <div className="mt-4" />

            <h2 className="text-lg text-zinc-300">⚠ Delete Account ⚠</h2>
            <button
              className="rounded bg-red-600 px-3 py-2"
              onClick={() => {
                return;
              }}
            >
              Delete My Account
            </button>
          </div>
        )}
      </MainContent>
      <ButtonContainer>
        <Button intent="cancel" link="/">
          Back
        </Button>
      </ButtonContainer>
    </Layout>
  );
};

export default Settings;
