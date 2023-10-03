import { type NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import Button from "../ui/primitives/Button";
import Heading from "../ui/Heading";
import ButtonContainer from "../ui/wrappers/ButtonContainer";
import MainContent from "../ui/wrappers/MainContent";
import Accordion from "../ui/primitives/Accordion";
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
import { useAutoAnimate } from "@formkit/auto-animate/react";
import AppLayout from "../ui/layouts/AppLayout";
import LogoHeading from "../ui/typography/LogoHeading";
import ContentContainer from "../ui/wrappers/ContentContainer";
import H2 from "../ui/typography/H2";
import Select from "../ui/primitives/Select";
import Label from "../ui/primitives/Label";
import Input from "../ui/primitives/Input";
import InputContainer from "../ui/wrappers/InputContainer";
import CommandMenu from "../ui/components/CommandMenu/CommandMenu";
import CommandHeading from "../ui/components/CommandMenu/CommandHeading";
import Command from "../ui/components/CommandMenu/Command";

const categories = [
  "Category 🦍",
  "Category 🐓",
  "Category 🐳",
  "Category 🐶",
  "Category 🐸",
  "Category 🐻",
  "Category 🐉",
  "Category 🐞",
  "Category 🟨",
  "Category 🟩",
  "Category 🟪",
  "Category 🟦",
];

const Configure: NextPage = () => {
  const router = useRouter();
  const subjects = trpc.subject.getSubjects.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const [subjectSelection, setSubjectSelection] = useState("Add New Subject");
  const [fieldCategories, setFieldCategories] = useState<Array<string>>([]);
  const [newCategorySelect, setNewCategorySelect] = useState<{
    showInput: boolean;
    fieldIndex: number | null;
    selectedCategory: string | null;
  }>({
    showInput: false,
    fieldIndex: null,
    selectedCategory: "Category 🦍",
  });
  const fieldCategorySelection = useRef<HTMLSelectElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [subjectDeleteConfirmation, setSubjectDeleteConfirmation] =
    useState(false);
  const [showCancelChangesButton, setShowCancelChangesButton] = useState(false);
  const [animationParent] = useAutoAnimate();

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
      setSubjectSelection("Add New Subject");
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
  }, [isFetched, data, form, subjectSelection]);

  const selectCategoryHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    category: string | "",
    fieldIndex: number,
    createCategory = false
  ) => {
    event.preventDefault();
    if (createCategory) {
      setNewCategorySelect((prev) => {
        return { ...prev, showInput: true, fieldIndex };
      });
    } else {
      setNewCategorySelect((prev) => ({ ...prev, showInput: false }));

      watchFields.entries[0]?.fields[fieldIndex]?.category === undefined
        ? form.register(`entries.0.fields.${fieldIndex}.category`, {
            value: category,
          })
        : form.setValue(`entries.0.fields.${fieldIndex}.category`, category);
    }
  };

  const addCategoryHandler = (event: React.MouseEvent<Element, MouseEvent>) => {
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

        setNewCategorySelect((prev) => {
          return { ...prev, showInput: false, fieldIndex: null };
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

  if (updateSubject.isLoading)
    return (
      <AppLayout page="configure">
        <Heading>Configure Subject</Heading>
        <MainContent>
          <p className="text-2xl text-zinc-100">Loading</p>
        </MainContent>
      </AppLayout>
    );

  return (
    <AppLayout page="configure">
      <LogoHeading />
      <MainContent>
        <form className="flex w-full flex-col gap-3" ref={animationParent}>
          <ContentContainer>
            <H2>Configure Subjects</H2>
            <InputContainer variant="unpadded">
              <Label htmlFor="subject-selection">Select Subject</Label>
              <Select
                id="subject-selection"
                value={subjectSelection}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  setSubjectSelection(event.target.value);
                }}
              >
                <option value="Add New Subject">Add New Subject</option>
                {subjects.data?.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Select>
            </InputContainer>
            <InputContainer variant="unpadded">
              <Label htmlFor="subject-name">Subject Name</Label>
              <Input
                placeholder="Add Subject Name"
                id="subject-name"
                inputType="text"
                formProps={form.register("name")}
                error={form.formState.errors.name?.message}
              />
            </InputContainer>
          </ContentContainer>
          {newCategorySelect.showInput === true && (
            <>
              <ContentContainer direction="row">
                <InputContainer>
                  <Label htmlFor="new-category">Category Name</Label>
                  <Select
                    onChange={(event) =>
                      setNewCategorySelect((prev) => {
                        return {
                          ...prev,
                          selectedCategory: event.target.value,
                        };
                      })
                    }
                    ref={fieldCategorySelection}
                    value={newCategorySelect.selectedCategory || ""}
                    id="new-category"
                  >
                    {categories
                      .filter((cat) => !fieldCategories.includes(cat))
                      .map((categories) => {
                        return (
                          <option key={categories} value={categories}>
                            {categories}
                          </option>
                        );
                      })}
                  </Select>
                </InputContainer>
                <InputContainer>
                  <Label htmlFor="">Set Category</Label>
                  <div className="w-fit">
                    <Button
                      intent="secondary"
                      action={(event) => {
                        addCategoryHandler(event);
                      }}
                    >
                      Set Category
                    </Button>
                  </div>
                </InputContainer>
              </ContentContainer>
            </>
          )}

          <div
            className={clsx(
              "flex w-fit flex-row flex-wrap gap-3 rounded-md bg-neutral-700 p-1.5",
              {
                hidden: fieldCategories.length === 0,
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
                checked={selectedFilter === "all"}
                onChange={(e) => setSelectedFilter(e.target.value)}
              />
              <label htmlFor="all">All Fields</label>
            </div>
            {fieldCategories.length > 0 &&
              fieldCategories.map((category, categoryIndex) => {
                return (
                  <React.Fragment key={`${category}${categoryIndex}`}>
                    <div
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
                      title={`Field: ${field.name} (${
                        field.category || "unassigned"
                      })`}
                      defaultOpen={!field.id}
                    >
                      <InputContainer background="violet">
                        <Label htmlFor="field-name">Field Name</Label>
                        <Input
                          id="field-name"
                          placeholder="Add Field Name"
                          inputType="text"
                          formProps={form.register(
                            `entries.0.fields.${fieldIndex}.name`
                          )}
                          error={
                            form.formState.errors.entries?.[0]?.fields?.[
                              fieldIndex
                            ]?.name?.message
                          }
                        />
                      </InputContainer>
                      {field?.fieldInputs?.map(
                        (input, inputIndex, inputArray) => {
                          return (
                            <React.Fragment key={inputIndex}>
                              <ContentContainer
                                background="violet"
                                direction="row"
                              >
                                <InputContainer variant="unpadded">
                                  <Label htmlFor="input-type">Input Type</Label>
                                  <Select
                                    id="input-type"
                                    value={input?.inputType}
                                    formProps={form.register(
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
                                            {type}
                                          </option>
                                        );
                                      })}
                                  </Select>
                                </InputContainer>
                                <InputContainer variant="unpadded">
                                  {input?.inputType === "NUMBER" && (
                                    <>
                                      <Label htmlFor="input-unit">Unit</Label>
                                      <Select
                                        id="input-unit"
                                        value={input?.inputHelper || ""}
                                        formProps={form.register(
                                          `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.inputHelper`
                                        )}
                                        error={
                                          form.formState.errors.entries?.[0]
                                            ?.fields?.[fieldIndex]
                                            ?.fieldInputs?.[inputIndex]?.message
                                        }
                                      >
                                        <option>{input.inputHelper}</option>
                                        {inputUnitTypes
                                          .filter(
                                            (type) =>
                                              type !== input?.inputHelper
                                          )
                                          .map((unit) => {
                                            return (
                                              <option key={unit} value={unit}>
                                                {unit}
                                              </option>
                                            );
                                          })}
                                      </Select>
                                    </>
                                  )}
                                  {(input?.inputType === "RANGE" ||
                                    input?.inputType === "BOOLEAN") && (
                                    <>
                                      <Label htmlFor="input-label">
                                        Input Label
                                      </Label>
                                      <Input
                                        id="input-label"
                                        inputType="text"
                                        placeholder={
                                          input.inputType === "RANGE"
                                            ? "Subjective" // RANGE
                                            : "Question?" // BOOLEAN
                                        }
                                        formProps={form.register(
                                          `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.inputHelper`
                                        )}
                                        error={
                                          form.formState.errors.entries?.[0]
                                            ?.fields?.[fieldIndex]
                                            ?.fieldInputs?.[inputIndex]?.message
                                        }
                                      />
                                    </>
                                  )}
                                </InputContainer>
                              </ContentContainer>
                              {inputArray.length - 1 === inputIndex && (
                                <div className="flex justify-center">
                                  <CommandMenu
                                    button={
                                      <Button
                                        intent="ghost"
                                        variant="just-icon-circle"
                                        icon="more-slate-100.svg"
                                      />
                                    }
                                  >
                                    <CommandHeading intent="primary">
                                      Add Input
                                    </CommandHeading>
                                    <Command
                                      action={(event) =>
                                        addFieldInput(event, fieldIndex)
                                      }
                                      intent="primary"
                                      icon="plus-circle-slate-100.svg"
                                    >
                                      New Input
                                    </Command>
                                    <CommandHeading intent="option">
                                      Set Category
                                    </CommandHeading>
                                    <Command
                                      key={"unassigned"}
                                      intent="option"
                                      icon="filter-slate-100.svg"
                                      action={(event) =>
                                        selectCategoryHandler(
                                          event,
                                          "",
                                          fieldIndex
                                        )
                                      }
                                      activeSelection={
                                        field.category || "Unassigned"
                                      }
                                    >
                                      Unassigned
                                    </Command>
                                    {fieldCategories.map((category) => {
                                      return (
                                        <Command
                                          key={category}
                                          intent="option"
                                          icon="filter-slate-100.svg"
                                          action={(event) =>
                                            selectCategoryHandler(
                                              event,
                                              category,
                                              fieldIndex
                                            )
                                          }
                                          activeSelection={
                                            field.category || "unassigned"
                                          }
                                        >
                                          {category}
                                        </Command>
                                      );
                                    })}
                                    <Command
                                      intent="primary"
                                      icon="plus-circle-slate-100.svg"
                                      action={(event) =>
                                        selectCategoryHandler(
                                          event,
                                          "",
                                          fieldIndex,
                                          true
                                        )
                                      }
                                    >
                                      Assign New Category
                                    </Command>
                                    {inputArray.length > 1 && !input.id && (
                                      <>
                                        <CommandHeading intent="destructive">
                                          Delete Input
                                        </CommandHeading>

                                        {inputArray.map((input, index) => {
                                          return (
                                            <Command
                                              key={`${inputIndex}${index}`}
                                              intent="destructive"
                                              icon="minus-circle-slate-100.svg"
                                              action={(
                                                event: React.MouseEvent<
                                                  HTMLButtonElement,
                                                  MouseEvent
                                                >
                                              ) =>
                                                removeFieldInput(
                                                  event,
                                                  fieldIndex,
                                                  index
                                                )
                                              }
                                            >
                                              <span className="capitalize">
                                                {input.inputType.toLowerCase()}
                                              </span>
                                              {!!input.inputHelper &&
                                                ` | ${input.inputHelper}`}
                                            </Command>
                                          );
                                        })}
                                      </>
                                    )}
                                    {fieldArray.length > 1 && (
                                      <>
                                        <CommandHeading intent="destructive">
                                          Delete Field
                                        </CommandHeading>

                                        <Command
                                          action={(event) => {
                                            removeField(event, fieldIndex);
                                            if (!!field.id) {
                                              setDeletedFields((prev) => [
                                                ...prev,
                                                field.id,
                                              ]);
                                            }
                                          }}
                                          intent="destructive"
                                          icon="minus-circle-slate-100.svg"
                                        >
                                          Delete Field
                                        </Command>
                                      </>
                                    )}
                                  </CommandMenu>
                                </div>
                              )}
                            </React.Fragment>
                          );
                        }
                      )}
                    </Accordion>
                  </div>
                );
              }
            )}
        </form>
      </MainContent>
      <ButtonContainer
        mainButton={
          <Button
            intent="primary"
            action={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              addField(event, "journal")
            }
            icon="plus.svg"
            variant="rounded-full"
          >
            Add Field
          </Button>
        }
        iconButton={
          <>
            <CommandMenu
              button={
                <Button
                  icon="more-slate-100.svg"
                  intent="ghost"
                  variant="just-icon-circle"
                />
              }
            >
              {subjectSelection === "Add New Subject" && (
                <CommandHeading intent="option">
                  No Options Available
                </CommandHeading>
              )}
              {showCancelChangesButton && (
                <>
                  <CommandHeading intent="primary">Edit</CommandHeading>
                  <Command
                    action={() => {
                      setDeletedFields([]);
                      refetch();
                    }}
                    icon="undo-slate-100.svg"
                  >
                    Undo All Changes
                  </Command>
                </>
              )}
              {!subjectDeleteConfirmation &&
                subjectSelection !== "Add New Subject" && (
                  <>
                    <CommandHeading intent="destructive">
                      Delete Subject
                    </CommandHeading>
                    <Command
                      action={() => setSubjectDeleteConfirmation(true)}
                      icon="trash-slate-100.svg"
                      intent="destructive"
                    >
                      Delete Subject
                    </Command>
                  </>
                )}
              {subjectDeleteConfirmation &&
                subjectSelection !== "Add New Subject" && (
                  <>
                    <CommandHeading intent="destructive">
                      Confirm Delete
                    </CommandHeading>
                    <Command
                      action={() => {
                        deleteSubject.mutateAsync({ id: subjectSelection });
                      }}
                      icon="trash-slate-100.svg"
                      intent="destructive"
                    >
                      Yes, Delete Subject
                    </Command>
                    <Command
                      action={() => setSubjectDeleteConfirmation(false)}
                      icon="undo-slate-100.svg"
                      intent="option"
                    >
                      Cancel
                    </Command>
                  </>
                )}
            </CommandMenu>
            <Button
              icon="save-neutral-800.svg"
              intent="primary"
              variant="just-icon-circle"
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
            />
          </>
        }
      ></ButtonContainer>
    </AppLayout>
  );
};

export default Configure;
