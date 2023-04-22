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
import Accordion from "../../../ui/Accordion";

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

  const watchForm = form.watch();
  useEffect(() => {
    console.log(watchForm);
  }, [watchForm]);

  if (!data || !data.entries.length) return <div>No data</div>;

  return (
    <Layout page="New Entry">
      <Heading>New Entry</Heading>
      <MainContent>
        <div className="flex flex-row gap-4">
          <div
            className={clsx("rounded p-2", {
              "bg-slate-600": selectedFilter === "all",
              "bg-slate-700": selectedFilter !== "all",
            })}
          >
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
              <div
                className={clsx("rounded p-2", {
                  "bg-slate-600": selectedFilter === category,
                  "bg-slate-700": selectedFilter !== category,
                })}
                key={category}
              >
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
        <form className="flex w-full flex-col gap-2 sm:w-9/12">
          {data?.entries[0]?.fields.map((field, fieldIndex) => {
            return (
              <div
                className={clsx({
                  hidden:
                    selectedFilter !== "all" &&
                    field.category !== selectedFilter,
                })}
                key={field.id}
              >
                <Accordion title={field.name}>
                  {field.fieldInputs.map((input, inputIndex) => {
                    switch (input.inputType) {
                      case "TEXTAREA":
                        return (
                          <div className="flex w-full flex-col rounded bg-slate-700 p-2 md:w-10/12">
                            <label className="text-sm text-zinc-300">
                              {input.inputHelper || "textarea"}
                            </label>
                            <textarea
                              key={input.id}
                              className="h-32 bg-slate-800 text-slate-200"
                              {...form.register(
                                `fields.${fieldIndex}.fieldInputs.${inputIndex}.valueString`
                              )}
                            />
                          </div>
                        );
                      case "NUMBER":
                        return (
                          <div
                            key={input.id}
                            className="flex flex-row items-center gap-1 rounded bg-slate-700 p-1"
                          >
                            <div className="flex w-10 flex-col justify-center gap-1">
                              <button
                                className="w-full bg-slate-600 font-bold text-slate-200"
                                onClick={(event) => {
                                  event.preventDefault();
                                  const currentValue = form.getValues(
                                    `fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`
                                  );
                                  form.setValue(
                                    `fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`,
                                    currentValue ? currentValue + 1 : 1
                                  );
                                }}
                              >
                                +
                              </button>
                              <input
                                key={input.id}
                                type="number"
                                className=" bg-slate-800 p-1 text-center text-slate-200"
                                {...form.register(
                                  `fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`,
                                  { valueAsNumber: true }
                                )}
                              />
                              <button
                                className="w-full bg-slate-600 font-bold text-slate-200"
                                onClick={(event) => {
                                  event.preventDefault();
                                  const currentValue = form.getValues(
                                    `fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`
                                  );
                                  form.setValue(
                                    `fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`,
                                    currentValue ? currentValue - 1 : 0
                                  );
                                }}
                              >
                                -
                              </button>
                            </div>
                            <label className="text-sm text-zinc-300">
                              {input.inputHelper}
                            </label>
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
                </Accordion>
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
