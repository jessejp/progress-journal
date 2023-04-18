import { createServerSideHelpers } from "@trpc/react-query/server";
import type { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { appRouter } from "../../../server/trpc/router/_app";
import { prisma } from "../../../server/db/client";
import superjson from "superjson";
import { trpc } from "../../../utils/trpc";
import Layout from "../../../ui/Layout";
import Heading from "../../../ui/Heading";
import Button from "../../../ui/Button";
import ButtonContainer from "../../../ui/ButtonContainer";
import MainContent from "../../../ui/MainContent";

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
          <div>
            {data?.entries[0]?.fields.map((field) => {
              return (
                <div key={field.id}>
                  <div>{field.name}</div>
                  {field.fieldInputs.map((input) => {
                    return (
                      <div key={input.id}>
                        {input.inputType === "TEXTAREA" && (
                          <div>{input.valueString}</div>
                        )}
                        {input.inputType === "NUMBER" ||
                          (input.inputType === "RANGE" && (
                            <div>{input.valueNumber}</div>
                          ))}
                        {input.inputType === "BOOLEAN" && (
                          <div>{input.valueBoolean}</div>
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
  const session = trpc.auth.getSession.useQuery();
  const ssg = await createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: session.data === undefined ? null : session.data },
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
    },
  };
}

export default ReadEntry;
