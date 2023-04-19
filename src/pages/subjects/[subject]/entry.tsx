import React, { useEffect, useState } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import type { GetStaticPaths, GetStaticPropsContext } from "next";
import Layout from "../../../ui/Layout";
import Button from "../../../ui/Button";
import Heading from "../../../ui/Heading";
import ButtonContainer from "../../../ui/ButtonContainer";
import MainContent from "../../../ui/MainContent";
import { trpc } from "../../../utils/trpc";
import { useZodForm, entryValidationSchema } from "../../../utils/useZodForm";
import clsx from "clsx";

const Entry: NextPage<{ subject: string }> = ({ subject }) => {
  const router = useRouter();
  const { data } = trpc.entry.getEntry.useQuery(
    {
      subjectName: subject,
      template: true,
      entryId: undefined,
    },
    { refetchOnWindowFocus: false }
  );
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const addEntry = trpc.entry.addEntry.useMutation({
    onSuccess: async () => {
      console.log("onSuccess");
      router.push(`/subjects/${subject}`);
    },
    onError: async () => {
      console.log("onError");
    },
  });

  const form = useZodForm({
    schema: entryValidationSchema,
  });

  useEffect(() => {
    if (data?.id && !form.formState.defaultValues) {
      form.reset({
        subjectId: data?.id,
        fields: data?.entries[0]?.fields.map((field) => {
          return {
            name: field.name,
            fieldInputs: field.fieldInputs.map((input) => {
              return {
                fieldId: field.id,
                valueString: input.inputType === "TEXTAREA" ? "" : undefined,
                valueNumber:
                  input.inputType === "NUMBER" || input.inputType === "RANGE"
                    ? input.valueNumber
                    : undefined,
                valueBoolean: input.inputType === "BOOLEAN" ? false : undefined,
                inputHelper: input.inputHelper,
                inputType: input.inputType,
              };
            }),
          };
        }),
      });
    }
  }, [data, form]);

  if (!data || !data.entries.length) return <div>No data</div>;

  return (
    <Layout page="New Entry">
      <Heading>New Entry</Heading>
      <MainContent>
        <div className="flex flex-row gap-4">
          <div className="rounded bg-slate-600 p-2">
            <input
              type="radio"
              name="filter"
              id="all"
              value="all"
              defaultChecked
              onChange={(e) => setSelectedFilter(e.target.value)}
            />
            <label htmlFor="all">All</label>
          </div>
          {data?.entries[0]?.categories?.split(",").map((category) => {
            return (
              <div className="rounded bg-slate-600 p-2" key={category}>
                <input
                  type="radio"
                  name="filter"
                  id={category}
                  value={category}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                />
                <label htmlFor={category}>{category}</label>
              </div>
            );
          })}
        </div>
        <div className="mt-4" />
        <form className="flex flex-col gap-2">
          {data?.entries[0]?.fields.map((field, fieldIndex) => {
            return (
              <div
                className={clsx(
                  "flex w-full flex-col items-start gap-2 bg-slate-600 px-4 py-2",
                  {
                    hidden:
                      selectedFilter !== "all" &&
                      field.category !== selectedFilter,
                  }
                )}
                key={field.id}
              >
                <label className="w-full text-zinc-200" htmlFor={field.name}>
                  {field.name}
                </label>
                {field.fieldInputs.map((input, inputIndex) => {
                  switch (input.inputType) {
                    case "TEXTAREA":
                      return (
                        <textarea
                          key={input.id}
                          className="h-32 bg-slate-800 text-slate-200"
                          {...form.register(
                            `fields.${fieldIndex}.fieldInputs.${inputIndex}.valueString`
                          )}
                        />
                      );
                    case "NUMBER":
                      return (
                        <div key={input.id} className="flex flex-row gap-1">
                          <input
                            key={input.id}
                            type="number"
                            className="w-14 bg-slate-800 p-1 text-center text-slate-200"
                            {...form.register(
                              `fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`,
                              { valueAsNumber: true }
                            )}
                          />
                          <span className="bg-slate-700 p-1 px-2 text-slate-200">
                            {input.inputHelper}
                          </span>
                        </div>
                      );
                    case "BOOLEAN":
                      return (
                        <React.Fragment key={input.id}>
                          <input
                            key={input.id}
                            type="checkbox"
                            className=" bg-slate-800 text-slate-200"
                            {...form.register(
                              `fields.${fieldIndex}.fieldInputs.${inputIndex}.valueBoolean`
                            )}
                          />
                        </React.Fragment>
                      );
                    case "RANGE":
                      return (
                        <React.Fragment key={input.id}>
                          <input
                            type="range"
                            className=" bg-slate-800 text-slate-200"
                            {...form.register(
                              `fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`,
                              { valueAsNumber: true }
                            )}
                          />
                        </React.Fragment>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            );
          })}
        </form>
      </MainContent>
      <ButtonContainer>
        <Button intent="cancel" link="/">
          Back
        </Button>
        <Button
          intent="accept"
          action={form.handleSubmit(
            async (values) => {
              await addEntry.mutateAsync(values);
            },
            (err) => {
              console.log("on invalid", err);
            }
          )}
        >
          Next
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
  const subject = context.params?.subject as string;

  return {
    props: {
      subject: subject,
    },
  };
}

export default Entry;
