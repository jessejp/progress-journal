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
import { useEffect, useState } from "react";
import FieldLineChart from "../../ui/charts/FieldLineChart";

const Subject: NextPage<{ subject: string }> = ({ subject }) => {
  const [selectedField, setSelectedField] = useState<string>("Select a field");
  const [showChart, setShowChart] = useState<boolean>(false);
  const SubjectEntries = trpc.entry.getEntries.useQuery(
    {
      subjectName: subject,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const SubjectFields = trpc.entry.getEntry.useQuery(
    {
      subjectName: subject,
      entryId: SubjectEntries.data?.find((entry) => entry.template === true)
        ?.id as string,
      template: true,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const ChartFields = trpc.chart.getFieldsByTemplateId.useQuery(
    {
      templateId: selectedField,
    },
    {
      enabled: selectedField !== "Select a field",
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const { isFetched } = ChartFields;

  useEffect(() => {
    setShowChart(isFetched);
  }, [selectedField, isFetched, ChartFields.data]);

  if (!SubjectEntries.data) return <div>404 Not Found</div>;

  return (
    <Layout page={"Subject"}>
      <Heading>{subject}</Heading>
      <MainContent>
        <select
          className="focus:shadow-outline max-w-sm appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
          onChange={(event) => setSelectedField(event.target.value)}
        >
          <option value={"Select a field"}>Select a field</option>
          {SubjectFields.data?.entries[0]?.fields.map((field) => {
            return (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            );
          })}
        </select>

        {showChart && (
          <FieldLineChart
            data={ChartFields.data?.map((field) => {
              const weight = field.fieldInputs.find(
                (input) => input.inputHelper === "kg"
              )?.valueNumber;
              const reps = field.fieldInputs.find(
                (input) => input.inputHelper === "reps"
              )?.valueNumber;
              const sets = field.fieldInputs.find(
                (input) => input.inputHelper === "sets"
              )?.valueNumber;

              if (!weight && !reps && !sets) return null;

              return {
                entryId: field.entryId,
                date: dayjs(field.createdAt).format("DD/MM/YYYY"),
                weight,
                reps,
                sets,
              };
            })}
          />
        )}
        <div className="flex flex-col gap-3">
        {!SubjectEntries.data.length && <div>No entries yet</div>}
        {!!SubjectEntries.data.length &&
          SubjectEntries.data
            .filter((entry) => entry.template === false)
            .map((entry) => {
              const date = dayjs(entry.createdAt).format("DD/MM/YYYY HH-mm");
              return (
                <Button
                  key={entry.id}
                  link={`/subjects/${subject}/${entry.id}`}
                  intent="selection"
                  style="small"
                >
                  Entry: {date}
                </Button>
              );
            })
            .reverse()}
            </div>
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
