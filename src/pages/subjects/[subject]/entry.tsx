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
import {
  useZodForm,
  subjectValidationSchema,
  stringToInputType,
  type fieldType,
} from "../../../utils/useZodForm";
import clsx from "clsx";
import Accordion from "../../../ui/Accordion";
import { useFieldArray } from "react-hook-form";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createContextInner } from "../../../server/trpc/context";
import { appRouter } from "../../../server/trpc/router/_app";
import superjson from "superjson";

const Entry: NextPage<{ subject: string }> = ({ subject }) => {
  const router = useRouter();
  const { data, isFetched } = trpc.entry.getEntry.useQuery(
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
    if (!!data?.id && isFetched) {
      form.reset({
        id: data?.id,
        name: data?.name,
        entries: [
          {
            id: data?.entries[0]?.id,
            subjectId: data?.id,
            template: false,
            categories: data?.entries[0]?.categories,
            fields: data?.entries[0]?.fields.map((field) => {
              return {
                id: field.id,
                entryId: data?.entries[0]?.id,
                name: field.name,
                category: field.category,
                fieldInputs: field.fieldInputs.map((input) => {
                  return {
                    id: input.id,
                    fieldId: field.id,
                    valueString: input.valueString,
                    valueNumber: input.valueNumber,
                    valueBoolean: input.valueBoolean,
                    inputHelper: input.inputHelper,
                    inputType: stringToInputType(input.inputType),
                  };
                }),
              };
            }),
          },
        ],
      });
    }
  }, [data, form, isFetched]);

  const watchForm = form.watch();

  const { dirtyFields } = form.formState;
  const { insert } = useFieldArray({
    control: form.control,
    name: "entries.0.fields",
  });

  const cloneField = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fieldIndex: number,
    field: fieldType
  ) => {
    event.preventDefault();
    insert(fieldIndex + 1, {
      id: field.id,
      entryId: field.entryId,
      name: field.name,
      category: field.category,
      fieldInputs: field.fieldInputs.map((input) => {
        return {
          ...input,
        };
      }),
    });
  };

  if (!watchForm || !watchForm?.entries?.length || addEntry.isLoading)
    return (
      <Layout page="New Entry">
        <Heading>New Entry</Heading>
        <MainContent>
          <p className="text-2xl text-zinc-100">Loading</p>
        </MainContent>
      </Layout>
    );

  return (
    <Layout page="New Entry">
      <Heading>New Entry</Heading>
      <MainContent>
        <div className="flex flex-row flex-wrap gap-4">
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
            watchForm?.entries[0]?.fields.map(
              (field, fieldIndex, fieldArray) => {
                return (
                  <div
                    className={clsx({
                      hidden:
                        selectedFilter !== "all" &&
                        field.category !== selectedFilter,
                    })}
                    key={fieldIndex}
                  >
                    <Accordion
                      title={`${fieldIndex + 1}: ${field.name}`}
                      defaultOpen={fieldIndex === 0 || fieldArray.length < 5}
                    >
                      <div className="mb-4 flex w-full flex-grow flex-row flex-wrap justify-evenly gap-2 sm:justify-center">
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
                                          currentValue ? currentValue + 1 : 1,
                                          { shouldDirty: true }
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
                                          currentValue ? currentValue - 1 : 0,
                                          { shouldDirty: true }
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
                                <div
                                  key={input.id}
                                  className="flex flex-grow-0 flex-col items-center gap-1 rounded bg-slate-700 p-3"
                                >
                                  <label className="ml-2 text-base font-medium text-zinc-300">
                                    {input.inputHelper}
                                  </label>
                                  <div
                                    className={clsx(
                                      "flex flex-row items-center gap-1 rounded px-3 py-2",
                                      {
                                        "bg-slate-600 text-zinc-300":
                                          !input.valueBoolean,
                                      },
                                      {
                                        "bg-green-700 text-zinc-100":
                                          !!input.valueBoolean,
                                      }
                                    )}
                                  >
                                    <input
                                      type="checkbox"
                                      className="h-5 w-5"
                                      {...form.register(
                                        `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueBoolean`
                                      )}
                                    />
                                    <span className="font-bold">
                                      {input.valueBoolean ? "Yes" : "No"}
                                    </span>
                                  </div>
                                </div>
                              );
                            case "RANGE":
                              const sliderValue =
                                form.getValues(
                                  `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`
                                ) || 0;
                              return (
                                <div
                                  key={input.id}
                                  className="flex flex-grow flex-col items-center justify-evenly gap-2 rounded bg-slate-700 p-1"
                                >
                                  <label className="text-lg font-bold text-zinc-300">
                                    {input.inputHelper}
                                  </label>
                                  <div className="flex flex-col items-center justify-center rounded-md bg-slate-300 p-0.5">
                                    <input
                                      type="range"
                                      className={clsx(
                                        "h-1 w-2/3 scale-150 appearance-none rounded bg-gradient-to-r from-sky-500 to-rose-700 transition-accent duration-700",
                                        { "accent-sky-300": sliderValue < 25 },
                                        {
                                          "accent-slate-100":
                                            sliderValue >= 25 &&
                                            sliderValue <= 75,
                                        },
                                        { "accent-red-500": sliderValue > 75 }
                                      )}
                                      {...form.register(
                                        `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`,
                                        { valueAsNumber: true }
                                      )}
                                    />
                                  </div>
                                  <div className="flex flex-row justify-center text-base text-slate-300">
                                    <span>{sliderValue}%</span>
                                  </div>
                                </div>
                              );
                            default:
                              return null;
                          }
                        })}
                      </div>
                      <div className="flex w-full justify-center">
                        <button
                          className="h-fit w-fit rounded bg-slate-500 px-3 py-2 align-middle text-sm font-bold text-white hover:bg-blue-700"
                          onClick={(event) => {
                            cloneField(event, fieldIndex, field);
                          }}
                        >
                          🔁 Clone
                        </button>
                      </div>
                    </Accordion>
                  </div>
                );
              }
            )}
        </form>
      </MainContent>
      <ButtonContainer>
        <Button intent="cancel" link={`/subjects/${subject}`}>
          Back
        </Button>
        <Button
          intent="accept"
          action={form.handleSubmit(
            async (values) => {
              const fieldIndexes: number[] = [];
              if (!!dirtyFields.entries)
                dirtyFields?.entries[0]?.fields?.map((field, fieldIndex) => {
                  fieldIndexes.push(fieldIndex);
                });

              if (!!values.entries[0])
                values.entries[0].fields = values.entries[0].fields.filter(
                  (_, fieldIndex) => {
                    return fieldIndexes.includes(fieldIndex);
                  }
                );

              await addEntry.mutateAsync(values);
            },
            (err) => {
              console.log("on invalid", err);
              alert(`Error: ${err}`);
            }
          )}
        >
          Save
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
  const ctxInner = await createContextInner({ session: null });
  const ssg = await createServerSideHelpers({
    router: appRouter,
    ctx: { ...ctxInner },
    transformer: superjson,
  });

  const subject = context.params?.subject as string;

  await ssg.entry.getEntry.prefetch({
    subjectName: subject,
    entryId: undefined,
    template: true,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      subject: subject,
    },
  };
}

export default Entry;
