import { type NextPage } from "next";
import { useState } from "react";
import Layout from "../../../ui/Layout";
import Button from "../../../ui/Button";
import Heading from "../../../ui/Heading";
import ButtonContainer from "../../../ui/ButtonContainer";
import MainContent from "../../../ui/MainContent";
import { trpc } from "../../../utils/trpc";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "../../../server/trpc/router/_app";
import { prisma } from "../../../server/db/client";
import superjson from "superjson";
import type { GetStaticPaths, GetStaticPropsContext } from "next";

const Entry: NextPage<{ subject: string }> = ({ subject }) => {
  console.log(subject);

  const { data } = trpc.entry.getEntries.useQuery({
    subjectName: subject,
  });

  if (!data) return <div>404 Not Found</div>;

  return (
    <Layout page="New Entry">
      <Heading>New Entry</Heading>
      <MainContent>
        <TextArea />
      </MainContent>
      <ButtonContainer>
        <Button intent="cancel" link="/">
          Back
        </Button>
      </ButtonContainer>
    </Layout>
  );
};

const TextArea = () => {
  const [text, setText] = useState("");

  return (
    <div className="flex w-full flex-col">
      <label className="text-slate-200" htmlFor="entry">
        Entry
      </label>
      <textarea
        onChange={(event) => {
          setText(event.target.value);
        }}
        className="bg-slate-400"
      ></textarea>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ subject: string }>
) {
  const ssg = await createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson,
  });

  const subject = context.params?.subject as string;

  await ssg.entry.getEntries.prefetch({ subjectName: subject });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      subject: subject,
    },
  };
}

export default Entry;
