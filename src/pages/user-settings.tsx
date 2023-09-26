import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Layout from "../ui/Layout";
import Heading from "../ui/Heading";
import MainContent from "../ui/MainContent";
import ButtonContainer from "../ui/ButtonContainer";
import Button from "../ui/Button";
import { useState } from "react";

const Settings: NextPage = () => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const { data: sessionData } = useSession();

  const deleteAccount = trpc.auth.deleteAccount.useMutation({
    onSuccess: async () => {
      console.log("account deleted");
    },
  });

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
              className="rounded bg-gray-600 text-zinc-300 px-3 py-2"
              onClick={() => {
                signOut({
                  redirect: true,
                  callbackUrl: "/",
                });
              }}
            >
              Sign Out
            </button>
            <div className="mt-8" />

            <h2 className="text-lg text-zinc-300">⚠ Delete Account ⚠</h2>
            {!deleteConfirmation && (<p className="text-base text-zinc-300">
              Confirm Account deletion by writing{" "}
              <span className="text-lg font-bold text-red-500">delete</span>
            </p>
            )}
            
            {!!deleteConfirmation && (
                <p className="text-base text-zinc-300">
                Are you sure you want to delete this account?
              </p>
            )}
            {!deleteConfirmation && (
              <div className="flex flex-wrap gap-4">
                <input
                  type="text"
                  className="w-36 bg-slate-400 text-lg text-center font-bold"
                  onChange={(event) => {
                    setDeleteConfirmationInput(event.target.value);
                  }}
                />
                <button
                  className="rounded bg-slate-500 px-3 py-2"
                  onClick={() => {
                    if (deleteConfirmationInput === "delete") {
                      setDeleteConfirmation(true);
                    } else {
                      setDeleteConfirmation(false);
                    }
                  }}
                >
                  Confirm
                </button>
              </div>
            )}
            {!!deleteConfirmation && (
              <button
                className="rounded bg-red-600 px-3 py-2"
                onClick={() => {
                  if (!sessionData.user) return;
                  deleteAccount.mutate({ userId: sessionData.user.id });
                }}
              >
                Delete My Account
              </button>
            )}
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
