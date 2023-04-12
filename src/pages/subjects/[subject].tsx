import { type NextPage } from "next";
import Layout from "../../ui/Layout";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import ButtonContainer from "../../ui/ButtonContainer";
import MainContent from "../../ui/MainContent";
import { trpc } from "../../utils/trpc";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "../../server/trpc/router/_app";
import { prisma } from "../../server/db/client";
import superjson from "superjson";
import type { GetStaticPaths, GetStaticPropsContext } from "next";
import dayjs from "dayjs";

const Subject: NextPage<{ subject: string }> = ({ subject }) => {
  const { data } = trpc.entry.getEntries.useQuery({
    subjectName: subject,
  });
  if (!data) return <div>404 Not Found</div>;

  return (
    <Layout page={"Subject"}>
      <Heading>{subject}</Heading>
      <MainContent>
        {!data.length && <div>No entries yet</div>}
        {!!data.length &&
          data.map((entry) => {
            const date = dayjs(entry.createdAt).format("DD/MM/YYYY");
            return <div key={entry.id}>Entry: {date}</div>;
          })}
      </MainContent>
      <ButtonContainer>
        {/*  <Button intent="cancel" link="/">
          Back
        </Button> */}
        <Button intent="open" link={`/subjects/${subject}/entry`}>
          + Journal
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
  context: GetStaticPropsContext<{ subject: string }>
) {
  const ssg = await createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson,
  });
  console.log(context.params);
  const subject = context.params?.subject as string;

  await ssg.entry.getEntries.prefetch({ subjectName: subject });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      subject: subject,
    },
  };
}

export default Subject;
