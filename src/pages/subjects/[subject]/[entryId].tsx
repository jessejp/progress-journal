import { createServerSideHelpers } from "@trpc/react-query/server";
import type { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { appRouter } from "../../../server/trpc/router/_app";
import superjson from "superjson";
import { trpc } from "../../../utils/trpc";
import Layout from "../../../ui/Layout";
import Heading from "../../../ui/Heading";
import Button from "../../../ui/Button";
import ButtonContainer from "../../../ui/ButtonContainer";
import MainContent from "../../../ui/MainContent";
import { createContextInner } from "../../../server/trpc/context";

const ReadEntry: NextPage<{ subject: string; entryId: string }> = ({
  subject,
  entryId,
}) => {
  const { data } = trpc.entry.getEntry.useQuery({
    subjectName: subject,
    entryId: entryId,
    template: false,
  });

  return (
    <Layout page="Entry">
      <Heading>Read Entry</Heading>
      <MainContent>
        {data && (
          <div className="flex flex-col gap-4">
            {data?.entries[0]?.fields.map((field) => {
              return (
                <div key={field.id}>
                  <h2>{field.name}</h2>
                  {field.fieldInputs.map((input) => {
                    return (
                      <div key={input.id} className="text-slate-300">
                        {input.inputType === "TEXTAREA" &&
                          input.valueString && <span>{input.valueString}</span>}
                        {input.inputType === "NUMBER" &&
                          input.valueNumber !== null && (
                            <span>{`${input.valueNumber}${input.inputHelper}`}</span>
                          )}
                        {input.inputType === "RANGE" &&
                          input.valueNumber !== null && (
                            <>
                              <h3>{input.inputHelper}</h3>
                              <span>{`${input.valueNumber}%`}</span>
                            </>
                          )}
                        {input.inputType === "BOOLEAN" && (
                          <>
                            <h3>{input.inputHelper}</h3>
                            <span>{input.valueBoolean ? "Yes" : "No"}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </MainContent>
      <ButtonContainer>
        <Button intent="cancel" link={`/subjects/${subject}`}>
          Back
        </Button>
      </ButtonContainer>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ subject: string; entryId: string }>
) {
  const ctxInner = await createContextInner({ session: null });
  const ssg = await createServerSideHelpers({
    router: appRouter,
    ctx: { ...ctxInner },
    transformer: superjson,
  });

  const entryId = context.params?.entryId as string;
  const subject = context.params?.subject as string;

  await ssg.entry.getEntry.prefetch({
    subjectName: subject,
    entryId: entryId,
    template: false,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      subject: subject,
      entryId: entryId,
    },
  };
}

export default ReadEntry;
