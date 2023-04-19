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
} from "../utils/useZodForm";
import React, { useEffect, useState } from "react";

const Configure: NextPage = () => {
  const router = useRouter();
  const subjects = trpc.subject.getSubjects.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const [fieldTemplateSelection, setFieldTemplateSelection] =
    useState("journal");
  const [subjectSelection, setSubjectSelection] = useState("Add New Subject");
  const [fieldCategories, setFieldCategories] = useState<Array<string>>([
    "unassigned",
  ]);
  const [fieldCategoryInput, setFieldCategoryInput] = useState({
    showInput: false,
    value: "",
  });

  const addSubject = trpc.subject.addSubject.useMutation({
    onSuccess: async () => {
      router.push("/");
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
      subjectId: subjectSelection,
      subjectName: "",
      entries: [
        {
          template: true,
          fields: [
            {
              name: "Journal",
              fieldInputs: [{ inputType: "TEXTAREA" }],
            },
          ],
        },
      ],
    },
  });

  const watchFields = form.watch();

  const subjectWithFields = trpc.subject.getSubject.useQuery(
    {
      id: subjectSelection,
    },
    {
      enabled: subjectSelection !== "Add New Subject",
      refetchOnWindowFocus: false,
    }
  );

  const { isFetched, data } = subjectWithFields;
  useEffect(() => {
    if (subjectSelection === "Add New Subject") {
      form.reset({ ...form.formState.defaultValues });
    }

    if (isFetched) {
      console.log("form reset");
      form.reset(
        {
          subjectName: data?.name,
          entries: data?.entries,
        },
        { keepDefaultValues: true }
      );
    }
  }, [isFetched, data, form, subjectSelection]);

  const addCategoryHandler = (
    event: React.ChangeEvent<HTMLSelectElement>,
    fieldIndex: number
  ) => {
    console.log("addCategoryHandler", event.target.value);
    if (event.target.value === "+ new category") {
      setFieldCategoryInput((prev) => ({ ...prev, showInput: true }));
    } else {
      setFieldCategoryInput((prev) => ({ ...prev, showInput: false }));

      if (!!event.target.value) {
        form.register(`entries.0.fields.${fieldIndex}.category`, {
          value: event.target.value,
        });
      }
    }
  };

  const addField = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fieldTemplate: string
  ) => {
    event.preventDefault();
    const currentForm = watchFields;

    const fieldTemplateData = () => {
      switch (fieldTemplate) {
        case "journal":
          return [{ inputType: "TEXTAREA" }];
        case "weight training":
          return [
            { inputType: "NUMBER", inputHelper: "kg" },
            { inputType: "NUMBER", inputHelper: "reps" },
            { inputType: "NUMBER", inputHelper: "sets" },
          ];
        default:
          return [{ inputType: "TEXTAREA" }];
      }
    };

    currentForm.entries[0]?.fields.push({
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
    form.reset({ ...currentForm }, { keepDefaultValues: true });
  };

  const addFieldInput = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fieldIndex: number
  ) => {
    event.preventDefault();

    const currentForm = watchFields;
    currentForm.entries[0]?.fields[fieldIndex]?.fieldInputs.push({
      inputType: "BOOLEAN",
    });
    form.reset({ ...currentForm }, { keepDefaultValues: true });
  };

  const removeFieldInput = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fieldIndex: number,
    inputIndex: number
  ) => {
    event.preventDefault();
    form.unregister(`entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}`);
    const currentForm = watchFields;
    form.reset({ ...currentForm }, { keepDefaultValues: true });
  };

  return (
    <Layout page="configure">
      <Heading>Profile</Heading>
      <form className="flex w-full flex-col overflow-scroll">
        <div className="mb-4 mt-2 flex flex-row flex-wrap justify-between">
          <label className="h-8 text-lg font-bold text-zinc-200 max-sm:order-1 max-sm:w-1/2">
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
        <div className="mb-4 mt-2 flex flex-row flex-wrap justify-between">
          <label className="h-8 text-lg font-bold text-zinc-200 max-sm:order-1 max-sm:w-1/2">
            Subject Name
          </label>
          {form.formState.errors.subjectName && (
            <p className="text-red-500 max-sm:order-3">
              {form.formState.errors.subjectName.message}
            </p>
          )}
          <input
            type="text"
            className="w-40 border-2 max-sm:order-2 max-sm:w-1/2"
            {...form.register("subjectName")}
          />
        </div>
        {fieldCategoryInput.showInput === true && (
          <div className="mb-4 mt-2 flex flex-row flex-wrap justify-between">
            <>
              <input
                type="text"
                maxLength={12}
                className="w-40 overflow-clip border-2"
                placeholder="category name"
                value={fieldCategoryInput.value}
                onChange={(event) => {
                  setFieldCategoryInput((prev) => ({
                    ...prev,
                    value: event.target.value,
                  }));
                }}
              />
              <button
                onClick={(event) => {
                  event.preventDefault();
                  setFieldCategories((prev) => [
                    ...prev,
                    fieldCategoryInput.value,
                  ]);
                }}
                className="text-l w-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                Add Category
              </button>
            </>
          </div>
        )}
        {watchFields.entries[0]?.fields.length &&
          watchFields.entries[0].fields.map((field, fieldIndex, fieldArray) => {
            return (
              <React.Fragment key={fieldIndex}>
                <div className="my-2 rounded bg-slate-500 p-4">
                  <div className="mb-4 mt-2 flex flex-row flex-wrap justify-between gap-2">
                    <div className="flex h-10 flex-row items-center gap-4">
                      <select
                        aria-label="field category"
                        className="w-40 overflow-clip border-2"
                        /* {...form.register(
                          `entries.0.fields.${fieldIndex}.category`
                        )} */
                        onChange={(event) =>
                          addCategoryHandler(event, fieldIndex)
                        }
                      >
                        {fieldCategories?.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                        <option value="+ new category">+ new category</option>
                      </select>
                    </div>
                    {fieldIndex === fieldArray.length - 1 &&
                      fieldIndex > 0 &&
                      subjectSelection === "Add New Subject" && (
                        <button
                          className="rounded  bg-red-500 px-4 py-2 text-xl font-bold text-white hover:bg-red-700"
                          onClick={(event) => removeField(event, fieldIndex)}
                        >
                          X
                        </button>
                      )}
                  </div>
                  <div className="mb-4 mt-2 flex flex-row flex-wrap justify-start gap-2">
                    <label className="h-8 w-1/3 flex-grow-0 overflow-clip text-lg font-bold text-zinc-200">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-40 max-w-xs border-2"
                      {...form.register(`entries.0.fields.${fieldIndex}.name`)}
                    />
                  </div>
                  {field?.fieldInputs?.map((input, inputIndex, inputArray) => {
                    return (
                      <div
                        className="mb-4 mt-2 flex flex-row flex-wrap justify-start gap-2"
                        key={inputIndex}
                      >
                        <label className="h-8 w-1/3 flex-grow-0 text-lg font-bold text-zinc-200">
                          Input Type
                        </label>
                        <div className="flex flex-grow gap-4">
                          <select
                            className="w-fit border-2"
                            {...form.register(
                              `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.inputType`
                            )}
                            disabled={
                              subjectSelection !== "Add New Subject" &&
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
                              .filter((type) => type !== input?.inputType)
                              .map((type) => {
                                return (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                );
                              })}
                          </select>
                          {input?.inputType === "NUMBER" && (
                            <input
                              className="w-24"
                              type="text"
                              placeholder="kg, lbs, etc."
                              {...form.register(
                                `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.inputHelper`
                              )}
                            ></input>
                          )}
                        </div>
                        <div className="flex flex-grow-0 gap-2">
                          {inputArray.length > 1 &&
                            inputIndex === inputArray.length - 1 &&
                            subjectSelection === "Add New Subject" && (
                              <button
                                className="rounded  bg-red-500 px-4 py-2 text-xl font-bold text-white hover:bg-red-700"
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
                          {inputIndex === inputArray.length - 1 && (
                            <button
                              className="rounded bg-blue-500 px-4 py-2 text-xl font-bold text-white hover:bg-blue-700"
                              onClick={(event) =>
                                addFieldInput(event, fieldIndex)
                              }
                            >
                              +
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {fieldIndex === fieldArray.length - 1 && (
                  <div className="mt-4 flex w-full flex-row justify-center">
                    <button
                      className="w-fit rounded bg-blue-500 px-4 py-2 text-xl font-bold text-white hover:bg-blue-700"
                      onClick={(event) =>
                        addField(event, fieldTemplateSelection)
                      }
                    >
                      + add field
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
              </React.Fragment>
            );
          })}
      </form>
      <ButtonContainer>
        <Button
          intent="accept"
          action={form.handleSubmit(async (values) => {
            if (subjectSelection === "Add New Subject") {
              await addSubject.mutateAsync(values);
            } else {
              //filter out fields with an id from the values
              // const filteredValues = {
              //   ...values,
              //   entries: {
              //     ...values.entries,
              //     fields: values.entries[0]?.fields.map((field) => {
              //       field.fieldInputs.filter((input) => input.id === undefined);
              //     }),
              //   },
              // };
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
