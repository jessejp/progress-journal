import React, { useEffect, useState } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import type { GetStaticPaths, GetStaticPropsContext } from "next";
import Heading from "../../../ui/Heading";
import { trpc } from "../../../utils/trpc";
import {
  useZodForm,
  subjectValidationSchema,
  stringToInputType,
  type fieldType,
} from "../../../utils/useZodForm";
import clsx from "clsx";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useFieldArray } from "react-hook-form";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createContextInner } from "../../../server/trpc/context";
import { appRouter } from "../../../server/trpc/router/_app";
import superjson from "superjson";
import Accordion from "../../../ui/primitives/Accordion";
import Button from "../../../ui/primitives/Button";
import ButtonContainer from "../../../ui/wrappers/ButtonContainer";
import MainContent from "../../../ui/wrappers/MainContent";
import AppLayout from "../../../ui/layouts/AppLayout";
import LogoHeading from "../../../ui/typography/LogoHeading";
import H2 from "../../../ui/typography/H2";
import InputContainer from "../../../ui/wrappers/InputContainer";
import DisplayFieldInput from "../../../ui/components/DisplayFieldInput";
import Image from "next/image";
import CommandMenu from "../../../ui/components/CommandMenu/CommandMenu";
import CommandHeading from "../../../ui/components/CommandMenu/CommandHeading";
import Command from "../../../ui/components/CommandMenu/Command";

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
  const [animationParent] = useAutoAnimate();

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
      <AppLayout page="New Entry">
        <Heading>New Entry</Heading>
        <MainContent>
          <p className="text-2xl text-zinc-100">Loading</p>
        </MainContent>
      </AppLayout>
    );

  return (
    <AppLayout page="New Entry">
      <LogoHeading />
      <H2>New Entry</H2>
      <MainContent>
        <div
          className={clsx(
            "flex w-fit flex-row flex-wrap gap-3 rounded-md bg-neutral-700 p-1.5",
            {
              hidden: !watchForm?.entries[0]?.categories,
            }
          )}
        >
          <div
            className={clsx(
              "flex flex-row items-center gap-1 rounded p-2 text-slate-100",
              {
                "bg-violet-700": selectedFilter === "all",
                "bg-neutral-700": selectedFilter !== "all",
              }
            )}
          >
            <input
              type="radio"
              name="filter"
              id="all"
              value="all"
              defaultChecked
              onChange={(e) => setSelectedFilter(e.target.value)}
            />
            <label htmlFor="all">All Fields</label>
          </div>
          {!!watchForm?.entries[0]?.categories &&
            watchForm?.entries[0]?.categories
              ?.split(",")
              .map((category, categoryIndex) => {
                return (
                  <div
                    key={`${category}${categoryIndex}`}
                    className={clsx(
                      "flex flex-row items-center gap-1 rounded p-2 text-slate-100",
                      {
                        "bg-violet-700": selectedFilter === category,
                        "bg-neutral-700": selectedFilter !== category,
                      }
                    )}
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
        <form
          ref={animationParent}
          className="flex w-full flex-col gap-3 sm:w-9/12"
        >
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
                      <div className="flex w-full flex-grow flex-row flex-wrap justify-evenly gap-2">
                        {field.fieldInputs.map((input, inputIndex) => {
                          switch (input.inputType) {
                            case "TEXTAREA":
                              return (
                                <InputContainer
                                  variant="unpadded"
                                  key={input.id}
                                >
                                  <textarea
                                    className="min-h-[6.125rem] rounded-md bg-slate-100 px-3 py-2 text-base text-neutral-800"
                                    {...form.register(
                                      `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueString`
                                    )}
                                  />
                                </InputContainer>
                              );
                            case "NUMBER":
                              return (
                                <div
                                  key={input.id}
                                  className="flex w-32 flex-col items-center justify-start gap-2 rounded-md bg-neutral-800 p-3"
                                >
                                  <input
                                    type="number"
                                    className="w-16 rounded-md bg-white p-1 text-center text-neutral-800"
                                    {...form.register(
                                      `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`,
                                      { valueAsNumber: true }
                                    )}
                                  />
                                  <label className="text-sm text-zinc-300">
                                    {input.inputHelper}
                                  </label>
                                  <div className="flex w-full flex-nowrap">
                                    <button
                                      className="w-full rounded-l-full bg-neutral-600 px-4 py-2 font-bold text-slate-200"
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
                                      <Image
                                        src={`/icons/minus-input.svg`}
                                        width={1}
                                        height={1}
                                        alt={`minus 1 from number input ${input.inputHelper}`}
                                        className="h-4 w-4"
                                      />
                                    </button>
                                    <button
                                      className="w-full rounded-r-full border-1 border-neutral-700 bg-neutral-600 px-4 py-2 font-bold text-slate-200"
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
                                      <Image
                                        src={`/icons/plus-input.svg`}
                                        width={1}
                                        height={1}
                                        alt={`plus 1 from number input ${input.inputHelper}`}
                                        className="h-4 w-4"
                                      />
                                    </button>
                                  </div>
                                </div>
                              );
                            case "BOOLEAN":
                              return (
                                <div
                                  key={input.id}
                                  className="flex w-32 flex-col items-center justify-start gap-2 rounded-md bg-neutral-800 p-3"
                                >
                                  <label className="ml-2 text-base font-medium text-zinc-300">
                                    {input.inputHelper}
                                  </label>
                                  <div
                                    className={clsx(
                                      "flex w-20 flex-row items-center gap-2 rounded px-3 py-2",
                                      {
                                        "bg-neutral-600 text-orange-500":
                                          !input.valueBoolean,
                                      },
                                      {
                                        "bg-neutral-600 text-lime-500":
                                          !!input.valueBoolean,
                                      }
                                    )}
                                  >
                                    <input
                                      type="checkbox"
                                      className="h-5 w-5"
                                      {...form.register(
                                        `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueBoolean`,
                                        {
                                          setValueAs: () =>
                                            !!input.valueBoolean,
                                        }
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
                                  className="flex w-32 flex-col items-center justify-start gap-3 rounded-md bg-neutral-800 p-3"
                                >
                                  <DisplayFieldInput
                                    value={`${sliderValue}%`}
                                    inputLabel={input.inputHelper}
                                  />
                                  <div className="flex flex-col items-center justify-center rounded-md bg-slate-300 p-0.5">
                                    <input
                                      type="range"
                                      className={clsx(
                                        "h-1 w-2/3 scale-150 appearance-none rounded  accent-slate-100 transition-accent duration-700"
                                      )}
                                      {...form.register(
                                        `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.valueNumber`,
                                        { valueAsNumber: true }
                                      )}
                                    />
                                  </div>
                                  <div className="mt-3" />
                                </div>
                              );
                            default:
                              return null;
                          }
                        })}
                      </div>
                      <div className="flex w-full justify-center">
                        <CommandMenu
                          button={{
                            intent: "ghost",
                            variant: "just-icon-circle",
                            icon: "more-slate-100.svg",
                          }}
                        >
                          <CommandHeading>Clone Field</CommandHeading>
                          <Command
                            action={(event) => {
                              cloneField(event, fieldIndex, field);
                            }}
                            intent="primary"
                            icon="plus-circle-slate-100.svg"
                          >
                            Clone
                          </Command>
                        </CommandMenu>
                      </div>
                    </Accordion>
                  </div>
                );
              }
            )}
        </form>
      </MainContent>
      <ButtonContainer
        mainButton={
          <>
            <Button
              variant="rounded-full"
              icon="undo-neutral-800.svg"
              intent="cancel"
              link={`/subjects/${subject}`}
            >
              Back
            </Button>
            <Button
              variant="rounded-full"
              icon="save-neutral-800.svg"
              intent={`${!!dirtyFields.entries ? "primary" : "disabled"}`}
              action={form.handleSubmit(
                async (values) => {
                  const fieldIndexes: number[] = [];
                  if (!!dirtyFields.entries)
                    dirtyFields?.entries[0]?.fields?.map((_, fieldIndex) => {
                      fieldIndexes.push(fieldIndex);
                    });

                  if (!!values.entries[0] && fieldIndexes.length > 0) {
                    values.entries[0].fields = values.entries[0].fields.filter(
                      (_, fieldIndex) => fieldIndexes.includes(fieldIndex)
                    );

                    values.entries[0].fields.map((field) => {
                      field.fieldInputs = field.fieldInputs.filter((input) => {
                        return [
                          input.valueString,
                          input.valueNumber,
                          input.valueBoolean,
                        ].some(
                          (value) => value !== undefined && value !== null
                        );
                      });
                    });
                  }

                  await addEntry.mutateAsync(values);
                },
                (err) => {
                  console.log("on invalid", err);
                }
              )}
            >
              Save
            </Button>
          </>
        }
      ></ButtonContainer>
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
