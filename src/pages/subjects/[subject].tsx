import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "../../server/trpc/router/_app";
import { prisma } from "../../server/db/client";
import superjson from "superjson";
import type { GetStaticPaths, GetStaticPropsContext } from "next";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import FieldLineChart from "../../ui/charts/FieldLineChart";
import LogoHeading from "../../ui/typography/LogoHeading";
import AppLayout from "../../ui/layouts/AppLayout";
import Button from "../../ui/primitives/Button";
import ButtonContainer from "../../ui/wrappers/ButtonContainer";
import MainContent from "../../ui/wrappers/MainContent";
import ContentContainer from "../../ui/wrappers/ContentContainer";
import Link from "next/link";
import Select from "../../ui/primitives/Select";
import Label from "../../ui/primitives/Label";

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

  // SubjectFields is for chart selection
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
    <AppLayout page={"Subject"}>
      <LogoHeading />
      <MainContent>
        <div className="flex flex-col gap-3">
          <ContentContainer>
            <Label htmlFor="field-chart">Select a field for statistics</Label>
            <Select
              value={selectedField}
              id="field-chart"
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
            </Select>
            {/*   <select
          className="focus:shadow-outline mb-2 max-w-sm appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
        >
          
        </select> */}

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
          </ContentContainer>
          <ContentContainer>
            {!SubjectEntries.data.length && <div>No entries yet</div>}
            {!!SubjectEntries.data.length &&
              SubjectEntries.data
                .filter((entry) => entry.template === false)
                .map((entry) => {
                  const date = dayjs(entry.createdAt).format(
                    "DD/MM/YYYY HH-mm"
                  );
                  return (
                    <Link
                      className="w-full rounded-md border-1 border-slate-100 bg-violet-700 px-4 py-2 font-bold text-slate-100"
                      key={entry.id}
                      href={`/subjects/${subject}/${entry.id}`}
                    >
                      Entry: {date}
                    </Link>
                  );
                })
                .reverse()}
          </ContentContainer>
        </div>
      </MainContent>
      <ButtonContainer
        mainButton={
          <Button
            icon="plus.svg"
            intent="primary"
            variant="rounded-full"
            link="/configure"
          >
            New Entry
          </Button>
        }
        iconButton={
          <>
            <Button
              icon="settings-neutral-500.svg"
              intent="option"
              variant="just-icon-circle"
              link="/configure"
            />
            <Button
              icon="user.svg"
              intent="option"
              variant="just-icon-circle"
              link="/configure"
            />
          </>
        }
      />
    </AppLayout>
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
