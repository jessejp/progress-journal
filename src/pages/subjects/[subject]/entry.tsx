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
import { useZodForm, subjectValidationSchema } from "../../../utils/useZodForm";
import clsx from "clsx";
import Accordion from "../../../ui/Accordion";
import { useFieldArray } from "react-hook-form";

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
    schema: subjectValidationSchema,
  });

  useEffect(() => {
    if (data?.id && !form.formState.defaultValues) {
      form.reset({
        id: data?.id,
        name: data?.name,
        entries: [
          {
            template: false,
            id: data?.entries[0]?.id,
            categories: data?.entries[0]?.categories,
            fields: data?.entries[0]?.fields.map((field) => {
              return {
                name: field.name,
                category: field.category,
                id: field.id,
                fieldInputs: field.fieldInputs.map((input) => {
                  return {
                    id: input.id,
                    fieldId: field.id,
                    valueString:
                      input.inputType === "TEXTAREA" ? "" : undefined,
                    valueNumber:
                      input.inputType === "NUMBER" ||
                      input.inputType === "RANGE"
                        ? input.valueNumber
                        : undefined,
                    valueBoolean:
                      input.inputType === "BOOLEAN" ? false : undefined,
                    inputHelper: input.inputHelper,
                    inputType: input.inputType,
                  };
                }),
              };
            }),
          },
        ],
      });
    }
  }, [data, form]);

  const watchForm = form.watch();
  useEffect(() => {
    console.log(watchForm);
  }, [watchForm]);

  const { insert } = useFieldArray({
    control: form.control,
    name: "entries.0.fields",
  });

  if (!watchForm || !watchForm?.entries?.length) return <div>No data</div>;

  return (
    <Layout page="New Entry">
      <Heading>New Entry</Heading>
      <MainContent>
        <div className="flex flex-row gap-4">
          <div
            className={clsx("rounded p-2", {
              "bg-slate-500": selectedFilter === "all",
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
          {!!watchForm?.entries[0]?.categories &&
            watchForm?.entries[0]?.categories
              ?.split(",")
              .map((category, categoryIndex) => {
                return (
                  <div
                    className={clsx("rounded p-2", {
                      "bg-slate-500": selectedFilter === category,
                      "bg-slate-700": selectedFilter !== category,
                    })}
                    key={`${category}${categoryIndex}`}
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
          {!!watchForm?.entries[0]?.fields &&
            watchForm?.entries[0]?.fields.map((field, fieldIndex) => {
              return (
                <div
                  className={clsx({
                    hidden:
                      selectedFilter !== "all" &&
                      field.category !== selectedFilter,
                  })}
                  key={fieldIndex}
                >
                  <Accordion title={field.name}>
                    {field.fieldInputs.map((input, inputIndex) => {
                      switch (input.inputType) {
                        case "TEXTAREA":
                          return (
                            <div
                              className="flex w-full flex-col rounded bg-slate-700 p-2 md:w-10/12"
                              key={input.id}
                            >
                              <label className="text-sm text-zinc-300">
                                {input.inputHelper || "textarea"}
                              </label>
                              <textarea
                                className="h-32 bg-slate-800 text-slate-200"
                                {...form.register(
                                  `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueString`
                                )}
                              />
                            </div>
                          );
                        case "NUMBER":
                          return (
                            <div
                              key={input.id}
                              className="flex flex-grow-0 flex-row items-center gap-1 rounded bg-slate-700 p-1"
                            >
                              <div className="flex w-10 flex-col justify-center gap-1">
                                <button
                                  className="w-full bg-slate-600 font-bold text-slate-200"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    const currentValue = form.getValues(
                                      `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`
                                    );
                                    form.setValue(
                                      `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`,
                                      currentValue ? currentValue + 1 : 1
                                    );
                                  }}
                                >
                                  +
                                </button>
                                <input
                                  type="number"
                                  className=" bg-slate-800 p-1 text-center text-slate-200"
                                  {...form.register(
                                    `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`,
                                    { valueAsNumber: true }
                                  )}
                                />
                                <button
                                  className="w-full bg-slate-600 font-bold text-slate-200"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    const currentValue = form.getValues(
                                      `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`
                                    );
                                    form.setValue(
                                      `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`,
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
                                type="checkbox"
                                className=" bg-slate-800 text-slate-200"
                                {...form.register(
                                  `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueBoolean`
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
                                  `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`,
                                  { valueAsNumber: true }
                                )}
                              />
                            </React.Fragment>
                          );
                        default:
                          return null;
                      }
                    })}
                    <div className="flex justify-center w-full">
                    <button
                      className="text-sm h-fit w-fit rounded bg-zinc-500 px-4 py-2 align-middle font-bold text-white hover:bg-blue-700"
                      onClick={(event) => {
                        event.preventDefault();
                        insert(fieldIndex + 1, {
                          id: field.id,
                          name: field.name,
                          category: field.category,
                          fieldInputs: field.fieldInputs.map((input) => {
                            return {
                              ...input,
                            };
                          }),
                        });
                      }}
                    >
                      🔁 Clone
                    </button>
                    </div>
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
