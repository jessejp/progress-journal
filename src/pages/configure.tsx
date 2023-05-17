import { type NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import Layout from "../ui/Layout";
import Button from "../ui/Button";
import Heading from "../ui/Heading";
import ButtonContainer from "../ui/ButtonContainer";
import {
  useZodForm,
  subjectValidationSchema,
  inputTypes,
  inputTypeOption,
  stringToInputType,
  inputUnitTypes,
} from "../utils/useZodForm";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import MainContent from "../ui/MainContent";
import Accordion from "../ui/Accordion";

const Configure: NextPage = () => {
  const router = useRouter();
  const subjects = trpc.subject.getSubjects.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const [fieldTemplateSelection, setFieldTemplateSelection] =
    useState("journal");
  const [subjectSelection, setSubjectSelection] = useState("Add New Subject");
  const [fieldCategories, setFieldCategories] = useState<Array<string>>([]);
  const [newCategorySelect, setNewCategorySelect] = useState<{
    showInput: boolean;
    fieldIndex: number | null;
  }>({
    showInput: false,
    fieldIndex: null,
  });
  const fieldCategorySelection = useRef<HTMLSelectElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [subjectDeleteConfirmation, setSubjectDeleteConfirmation] =
    useState(false);
  const [showCancelChangesButton, setShowCancelChangesButton] = useState(false);

  // For deleting existing fields from DB
  const [deletedFields, setDeletedFields] = useState<Array<string>>([]);

  const addSubject = trpc.subject.addSubject.useMutation({
    onSuccess: async () => {
      router.push("/");
    },
    onError: async () => {
      console.log("onError addSubject");
    },
  });

  const updateSubject = trpc.subject.updateSubject.useMutation({
    onSuccess: async () => {
      console.log("onSuccess");
      router.push("/");
    },
    onError: async () => {
      console.log("onError");
    },
  });

  const form = useZodForm({
    schema: subjectValidationSchema,
    defaultValues: {
      id: subjectSelection,
      name: "",
      entries: [
        {
          id: "",
          subjectId: subjectSelection,
          template: true,
          categories: "",
          fields: [
            {
              id: "",
              entryId: "",
              name: "Journal",
              fieldInputs: [
                {
                  inputType: inputTypeOption.TEXTAREA,
                  inputHelper: null,
                  id: "",
                  fieldId: "",
                },
              ],
            },
          ],
        },
      ],
    },
  });

  const watchFields = form.watch();

  const deleteSubject = trpc.subject.deleteSubject.useMutation({
    onSuccess: async () => {
      router.push("/");
    },
  });

  const deleteFields = trpc.field.deleteFields.useMutation({
    onSuccess: async () => {
      console.log("onSuccess deleteFields");
    },
  });

  const subjectWithFields = trpc.subject.getSubject.useQuery(
    {
      id: subjectSelection,
    },
    {
      enabled: subjectSelection !== "Add New Subject",
      refetchOnWindowFocus: false,
    }
  );

  const { isFetched, data, refetch } = subjectWithFields;
  useEffect(() => {
    if (subjectSelection === "Add New Subject") {
      form.reset({ ...form.formState.defaultValues });
      setFieldCategories([]);
      setShowCancelChangesButton(false);
    }

    if (isFetched) {
      form.reset(
        {
          name: data?.name,
          id: data?.id,
          entries: data?.entries.map((entry) => ({
            ...entry,
            fields: entry.fields.map((field) => ({
              ...field,
              fieldInputs: field.fieldInputs.map((input) => {
                return {
                  ...input,
                  inputType: stringToInputType(input.inputType),
                  inputHelper: input.inputHelper,
                };
              }),
            })),
          })),
        },
        { keepDefaultValues: true }
      );
      setFieldCategories(
        !data?.entries[0]?.categories
          ? []
          : data?.entries[0]?.categories?.split(",")
      );
      setShowCancelChangesButton(true);
    }

    setSelectedFilter("all");
    setSubjectDeleteConfirmation(false);
    setDeletedFields([]);
  }, [
    isFetched,
    data,
    form,
    subjectSelection,
    setFieldCategories,
    setSubjectDeleteConfirmation,
    setSelectedFilter,
  ]);

  const selectCategoryHandler = (
    event: React.ChangeEvent<HTMLSelectElement>,
    fieldIndex: number
  ) => {
    if (event.target.value === "+ new category") {
      setNewCategorySelect({
        showInput: true,
        fieldIndex,
      });
    } else {
      setNewCategorySelect((prev) => ({ ...prev, showInput: false }));

      if (!!event.target.value) {
        watchFields.entries[0]?.fields[fieldIndex]?.category === undefined
          ? form.register(`entries.0.fields.${fieldIndex}.category`, {
              value: event.target.value,
            })
          : form.setValue(
              `entries.0.fields.${fieldIndex}.category`,
              event.target.value
            );
      }
    }
  };

  const addCategoryHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setFieldCategories((prev) => {
      const newCategory = {
        value: fieldCategorySelection.current?.value,
        fieldIndex: newCategorySelect.fieldIndex,
      };

      if (newCategory.fieldIndex !== null && newCategory.value !== undefined) {
        watchFields.entries[0]?.fields[newCategory.fieldIndex]?.category ===
        undefined
          ? form.register(
              `entries.0.fields.${newCategory.fieldIndex}.category`,
              {
                value: newCategory.value,
              }
            )
          : form.setValue(
              `entries.0.fields.${newCategory.fieldIndex}.category`,
              newCategory.value
            );

        setNewCategorySelect({
          showInput: false,
          fieldIndex: null,
        });

        return [...prev, newCategory.value];
      } else {
        return prev;
      }
    });
  };

  useEffect(() => {
    form.setValue(`entries.0.categories`, fieldCategories.join());
  }, [fieldCategories, form]);

  const addField = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fieldTemplate: string
  ) => {
    event.preventDefault();
    const currentForm = watchFields;

    const fieldTemplateData = () => {
      switch (fieldTemplate) {
        case "weight training":
          return [
            {
              inputType: inputTypeOption.NUMBER,
              inputHelper: inputTypeOption.kg,
              id: "",
              fieldId: "",
            },
            {
              inputType: inputTypeOption.NUMBER,
              inputHelper: inputTypeOption.reps,
              id: "",
              fieldId: "",
            },
            {
              inputType: inputTypeOption.NUMBER,
              inputHelper: inputTypeOption.sets,
              id: "",
              fieldId: "",
            },
            {
              inputType: inputTypeOption.RANGE,
              inputHelper: "Effort",
              id: "",
              fieldId: "",
            },
          ];
        default:
          return [
            {
              inputType: inputTypeOption.TEXTAREA,
              inputHelper: null,
              id: "",
              fieldId: "",
            },
          ];
      }
    };

    currentForm.entries[0]?.fields.push({
      id: "",
      entryId: currentForm.entries[0]?.id,
      name: "",
      fieldInputs: fieldTemplateData(),
    });
    form.reset({ ...currentForm }, { keepDefaultValues: true });
  };

  const removeField = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fieldIndex: number
  ) => {
    event.preventDefault();
    form.unregister(`entries.0.fields.${fieldIndex}`);
    const currentForm = watchFields;
    // Filter method is used to eliminate empty array values left by React Hook Form
    form.reset(
      {
        ...currentForm,
        entries: [
          {
            ...currentForm.entries[0],
            fields: currentForm.entries[0]?.fields.filter((field) => field),
          },
        ],
      },
      { keepDefaultValues: true }
    );
  };

  const addFieldInput = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fieldIndex: number
  ) => {
    event.preventDefault();

    const currentForm = watchFields;

    currentForm.entries[0]?.fields[fieldIndex]?.fieldInputs.push({
      id: "",
      fieldId: currentForm.entries[0]?.fields[fieldIndex]?.id || "",
      inputType: inputTypeOption.NUMBER,
      inputHelper: "",
    });
    form.reset(
      {
        ...currentForm,
      },
      { keepDefaultValues: true }
    );
  };

  const removeFieldInput = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fieldIndex: number,
    inputIndex: number
  ) => {
    event.preventDefault();
    form.unregister(`entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}`);
    const currentForm = watchFields;
    // Filter method is used to eliminate empty array values left by React Hook Form
    form.reset(
      {
        ...currentForm,
        entries: [
          {
            ...currentForm.entries[0],
            fields: currentForm.entries[0]?.fields.map((field) => {
              return {
                ...field,
                fieldInputs: field.fieldInputs.filter((input) => input),
              };
            }),
          },
        ],
      },
      { keepDefaultValues: true }
    );
  };

  // useEffect(() => {
  //   console.log("watchfields", watchFields);
  // }, [watchFields]);

  // console.log("form", form.formState.errors);
  // console.log("fieldCategories", fieldCategories);

  if (updateSubject.isLoading)
    return (
      <Layout page="configure">
        <Heading>Configure Subject</Heading>
        <MainContent>
          <p className="text-2xl text-zinc-100">Loading</p>
        </MainContent>
      </Layout>
    );

  return (
    <Layout page="configure">
      <Heading>Configure Subject</Heading>
      <MainContent>
        <form className="flex w-full flex-col p-2">
          <div className="mb-4 mt-2 flex flex-row flex-wrap justify-between rounded bg-slate-600 p-4">
            <label className="h-8 overflow-clip text-lg font-bold text-zinc-300 max-sm:order-1 max-sm:w-1/2">
              Select Subject
            </label>
            <select
              className="w-40 overflow-clip border-2 max-sm:order-2 max-sm:w-1/2"
              value={subjectSelection}
              onChange={(event) => {
                setSubjectSelection(event.target.value);
              }}
            >
              <option value="Add New Subject">Add New Subject</option>
              {subjects.data?.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 mt-2 flex flex-row flex-wrap justify-between rounded bg-slate-600 p-4">
            <label className="h-8 overflow-clip text-lg font-bold text-zinc-300 max-sm:w-1/2">
              Subject Name
            </label>
            <input
              type="text"
              className="w-40 border-2 max-sm:w-1/2"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <div className="mt-1 flex w-full flex-grow justify-end">
                <p className="w-fit text-red-500 max-sm:order-3">
                  {form.formState.errors.name.message}
                </p>
              </div>
            )}
          </div>
          {newCategorySelect.showInput === true && (
            <div className="mb-4 mt-2 flex flex-row flex-wrap justify-between gap-2 rounded bg-slate-600 p-4">
              <label className="h-8 overflow-clip text-lg font-bold text-zinc-300 max-sm:order-1 max-sm:w-1/2">
                Category Name
              </label>
              <select
                className="flex h-12 w-16 appearance-none flex-row flex-wrap bg-gray-100 text-center text-2xl"
                autoFocus={true}
                ref={fieldCategorySelection}
              >
                <option selected value="🦍">
                  🦍
                </option>
                <option value="🐓">🐓</option>
                <option value="🐳">🐳</option>
                <option value="🐶">🐶</option>
                <option value="🐸">🐸</option>
                <option value="🐻">🐻</option>
                <option value="🐉">🐉</option>
                <option value="🐞">🐞</option>
                <option value="🟨">🟨</option>
                <option value="🟩">🟩</option>
                <option value="🟪">🟪</option>
                <option value="🟦">🟦</option>
              </select>
              <button
                onClick={(event) => {
                  addCategoryHandler(event);
                }}
                className="text-l order-3 w-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                Add Category
              </button>
            </div>
          )}

          <div
            className={clsx("flex flex-row flex-wrap gap-4", {
              hidden: fieldCategories.length === 0,
            })}
          >
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
                checked={selectedFilter === "all"}
                onChange={(e) => setSelectedFilter(e.target.value)}
              />
              <label htmlFor="all">All</label>
            </div>
            {fieldCategories.length > 0 &&
              fieldCategories.map((category, categoryIndex) => {
                return (
                  <React.Fragment key={`${category}${categoryIndex}`}>
                    <div
                      className={clsx("flex flex-row gap-1 rounded p-2", {
                        "bg-slate-500": selectedFilter === category,
                        "bg-slate-700": selectedFilter !== category,
                      })}
                    >
                      <input
                        type="radio"
                        name="filter"
                        id={category}
                        value={category}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                      />
                      <label htmlFor={category}>{category}</label>
                      {selectedFilter === category && (
                        <Button
                          action={() => {
                            setFieldCategories(
                              fieldCategories.filter((cat) => cat !== category)
                            );
                          }}
                          intent="cancel"
                          style="xsmall"
                        >
                          Delete category
                        </Button>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
          {!!watchFields.entries.length &&
            !!watchFields.entries[0]?.fields.length &&
            watchFields.entries[0].fields.map(
              (field, fieldIndex, fieldArray) => {
                return (
                  <div
                    key={fieldIndex}
                    className={clsx({
                      hidden:
                        selectedFilter !== "all" &&
                        field.category !== selectedFilter,
                    })}
                  >
                    <Accordion
                      title={`${field.name}: ${field.category || "unassigned"}`}
                      defaultOpen={!field.id}
                    >
                      <div className="mb-4 flex w-full flex-grow flex-row items-center justify-between gap-2">
                        <div className="flex w-fit flex-col justify-start gap-2 rounded bg-slate-700 p-2">
                          <label className="text-sm text-zinc-300">
                            Category
                          </label>
                          <select
                            aria-label="field category"
                            className="w-40 overflow-clip border-2"
                            value={field.category || "unassigned"}
                            onChange={(event) =>
                              selectCategoryHandler(event, fieldIndex)
                            }
                          >
                            <option value="unassigned">unassigned</option>
                            {fieldCategories?.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                            <option value="+ new category">
                              + new category
                            </option>
                          </select>
                        </div>
                        {fieldArray.length > 1 && (
                          <button
                            className="rounded bg-red-500 px-4 py-2 text-xl font-bold text-white hover:bg-red-700"
                            onClick={(event) => {
                              removeField(event, fieldIndex);
                              if (!!field.id) {
                                setDeletedFields((prev) => [...prev, field.id]);
                              }
                            }}
                          >
                            X
                          </button>
                        )}
                      </div>
                      <div
                        className={clsx(
                          "flex min-h-[5rem] w-fit flex-col justify-start gap-2 rounded bg-slate-700 p-2",
                          {
                            "border-2 border-rose-700":
                              form.formState.errors.entries?.[0]?.fields?.[
                                fieldIndex
                              ]?.name,
                          }
                        )}
                      >
                        <label className="text-sm text-zinc-300">Name</label>
                        <input
                          type="text"
                          className="w-40 max-w-xs border-2"
                          {...form.register(
                            `entries.0.fields.${fieldIndex}.name`
                          )}
                        />
                        {form.formState.errors.entries?.[0]?.fields?.[
                          fieldIndex
                        ]?.name && (
                          <p className="text-red-500 max-sm:order-3">
                            {
                              form.formState.errors.entries?.[0]?.fields?.[
                                fieldIndex
                              ]?.name?.message
                            }
                          </p>
                        )}
                      </div>
                      {field?.fieldInputs?.map(
                        (input, inputIndex, inputArray) => {
                          return (
                            <React.Fragment key={inputIndex}>
                              <div
                                className={clsx(
                                  "flex min-h-[5rem] w-fit flex-col justify-start gap-2 rounded bg-slate-700 p-2",
                                  {
                                    "border-2 border-rose-700":
                                      form.formState.errors.entries?.[0]
                                        ?.fields?.[fieldIndex]?.fieldInputs?.[
                                        inputIndex
                                      ],
                                  }
                                )}
                              >
                                <label className="text-sm text-zinc-300">
                                  Input Type
                                </label>
                                <div className="flex flex-grow flex-wrap gap-4">
                                  <select
                                    className="w-fit border-2"
                                    {...form.register(
                                      `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.inputType`
                                    )}
                                    disabled={
                                      input.id !== "" &&
                                      form.formState.dirtyFields?.entries?.[0]
                                        ?.fields?.[fieldIndex]?.fieldInputs?.[
                                        inputIndex
                                      ]?.id !== undefined
                                    }
                                  >
                                    <option value={input?.inputType}>
                                      {input?.inputType}
                                    </option>
                                    {inputTypes
                                      .filter(
                                        (type) => type !== input?.inputType
                                      )
                                      .map((type) => {
                                        return (
                                          <option key={type} value={type}>
                                            {type === "BOOLEAN"
                                              ? "YES/NO"
                                              : type}
                                          </option>
                                        );
                                      })}
                                  </select>
                                  {input?.inputType === "NUMBER" && (
                                    <select
                                      value={input?.inputHelper || ""}
                                      {...form.register(
                                        `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.inputHelper`
                                      )}
                                    >
                                      <option>{input.inputHelper}</option>
                                      {inputUnitTypes
                                        .filter(
                                          (type) => type !== input?.inputHelper
                                        )
                                        .map((unit) => {
                                          return (
                                            <option key={unit} value={unit}>
                                              {unit}
                                            </option>
                                          );
                                        })}
                                    </select>
                                  )}
                                  {(input?.inputType === "RANGE" ||
                                    input?.inputType === "BOOLEAN") && (
                                    <>
                                      <input
                                        className="w-24"
                                        type="text"
                                        placeholder={
                                          input.inputType === "RANGE"
                                            ? "Subjective" // RANGE
                                            : "Question?" // BOOLEAN
                                        }
                                        {...form.register(
                                          `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.inputHelper`
                                        )}
                                      />
                                      {input?.inputType === "RANGE" && (
                                        <span className="self-center text-zinc-300">
                                          0-100%
                                        </span>
                                      )}
                                    </>
                                  )}
                                  <div className="flex flex-grow-0 gap-2">
                                    {inputArray.length > 1 && !input.id && (
                                      <button
                                        className="rounded  bg-red-500 px-3 py-1 text-xl font-bold text-white hover:bg-red-700"
                                        onClick={(event) =>
                                          removeFieldInput(
                                            event,
                                            fieldIndex,
                                            inputIndex
                                          )
                                        }
                                      >
                                        X
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {form.formState.errors.entries?.[0]?.fields?.[
                                  fieldIndex
                                ]?.fieldInputs?.[inputIndex] && (
                                  <p className="text-red-500 max-sm:order-3">
                                    {
                                      form.formState.errors.entries?.[0]
                                        ?.fields?.[fieldIndex]?.fieldInputs?.[
                                        inputIndex
                                      ]?.message
                                    }
                                  </p>
                                )}
                              </div>
                              {inputIndex === inputArray.length - 1 && (
                                <button
                                  className="h-fit rounded bg-blue-500 px-4 py-2 align-middle text-xl font-bold text-white hover:bg-blue-700"
                                  onClick={(event) =>
                                    addFieldInput(event, fieldIndex)
                                  }
                                >
                                  +
                                </button>
                              )}
                            </React.Fragment>
                          );
                        }
                      )}
                    </Accordion>
                    {fieldIndex === fieldArray.length - 1 && (
                      <div className="mt-4 flex w-full flex-row justify-center">
                        <button
                          className="text-l w-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                          onClick={(event) =>
                            addField(event, fieldTemplateSelection)
                          }
                        >
                          New Field
                        </button>
                        <select
                          value={fieldTemplateSelection}
                          onChange={(event) => {
                            setFieldTemplateSelection(event.target.value);
                          }}
                          className="w-fit border-2"
                        >
                          <option value="journal">default template</option>
                          <option value="weight training">
                            kg/reps/sets template
                          </option>
                        </select>
                      </div>
                    )}
                  </div>
                );
              }
            )}
          {subjectSelection !== "Add New Subject" && (
            <div className="mt-4 flex scale-75 flex-row flex-wrap justify-between rounded bg-slate-600 p-4">
              <label className="h-8 overflow-clip text-lg font-bold text-zinc-300 max-sm:w-1/2">
                Delete Subject
              </label>
              {!subjectDeleteConfirmation && (
                <button
                  className="rounded bg-zinc-500 px-2 py-1 text-xl font-bold text-white hover:bg-zinc-700"
                  onClick={() => {
                    setSubjectDeleteConfirmation(true);
                  }}
                >
                  Delete Subject
                </button>
              )}
              {!!subjectDeleteConfirmation && (
                <>
                  <button
                    className="rounded bg-red-500 px-2 py-1 text-xl font-bold text-white hover:bg-red-700"
                    onClick={(event) => {
                      event.preventDefault();
                      deleteSubject.mutate({ id: subjectSelection });
                    }}
                  >
                    Delete Subject
                  </button>
                  <button
                    className="rounded bg-slate-500 px-2 py-1 text-xl font-bold text-white hover:bg-slate-700"
                    onClick={() => {
                      setSubjectDeleteConfirmation(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </form>
      </MainContent>
      <ButtonContainer>
        {!!showCancelChangesButton &&
          subjectSelection !== "Add New Subject" && (
            <Button
              intent="undo"
              action={() => {
                setDeletedFields([]);
                refetch();
              }}
            >
              ↩Cancel Changes
            </Button>
          )}
        <Button
          intent="accept"
          action={form.handleSubmit(async (values) => {
            if (subjectSelection === "Add New Subject") {
              await addSubject.mutateAsync(values);
            } else {
              if (deletedFields.length > 0 && !!values.entries[0]?.id)
                await deleteFields.mutateAsync({
                  entryId: values.entries[0].id,
                  fieldIds: deletedFields,
                });

              await updateSubject.mutateAsync(values);
            }
          })}
        >
          {subjectSelection === "Add New Subject" ? subjectSelection : "Update"}
        </Button>
      </ButtonContainer>
    </Layout>
  );
};

export default Configure;
