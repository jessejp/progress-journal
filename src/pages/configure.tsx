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
  const [fieldTemplate, setFieldTemplate] = useState("journal");

  const addSubject = trpc.subject.addSubject.useMutation({
    onSuccess: async () => {
      router.push("/");
    },
  });

  const updateSubject = trpc.subject.updateSubject.useMutation({
    onSuccess: async () => {
      router.push("/");
    },
  });

  const form = useZodForm({
    schema: subjectValidationSchema,
    defaultValues: {
      subjectSelection: "Add New Subject",
      subjectName: "",
      entries: [
        {
          template: true,
          fields: [
            { name: "Journal", fieldInputs: [{ inputType: "TEXTAREA" }] },
          ],
        },
      ],
    },
  });
  const watchSubjectSelection = form.watch("subjectSelection");
  const watchFields = form.watch();

  const subjectWithFields = trpc.subject.getSubject.useQuery(
    {
      id: watchSubjectSelection,
    },
    {
      enabled: watchSubjectSelection !== "Add New Subject",
      refetchOnWindowFocus: false,
    }
  );

  const { isFetched, data } = subjectWithFields;
  useEffect(() => {
    if (watchSubjectSelection === "Add New Subject") {
      form.reset({ ...form.formState.defaultValues });
    }

    if (isFetched) {
      console.log("form reset");
      form.reset(
        {
          subjectName: data?.name,
          subjectSelection: watchSubjectSelection,
          entries: data?.entries,
        },
        { keepDefaultValues: true }
      );
    }
  }, [isFetched, data, form, watchSubjectSelection]);

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
            { inputType: "NUMBER", unit: "kg" },
            { inputType: "NUMBER", unit: "reps" },
            { inputType: "NUMBER", unit: "sets" },
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

  const dirtyfields = form.formState.dirtyFields;
  useEffect(() => {
    console.log(dirtyfields);
  }, [dirtyfields]);

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
            {...form.register("subjectSelection")}
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
        {watchFields.entries[0]?.fields.length &&
          watchFields.entries[0].fields.map((field, fieldIndex, fieldArray) => {
            return (
              <React.Fragment key={fieldIndex}>
                <div className="my-2 rounded bg-slate-500 p-4">
                  <div className="mb-4 mt-2 flex flex-row flex-wrap justify-between gap-2">
                    <div>Field {fieldIndex + 1}</div>
                    {fieldIndex === fieldArray.length - 1 &&
                      fieldIndex > 0 &&
                      watchSubjectSelection === "Add New Subject" && (
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
                              watchSubjectSelection !== "Add New Subject"
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
                                `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.unit`
                              )}
                            ></input>
                          )}
                        </div>
                        <div className="flex flex-grow-0 gap-2">
                          {inputArray.length > 1 &&
                            watchSubjectSelection === "Add New Subject" && (
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
                      onClick={(event) => addField(event, fieldTemplate)}
                    >
                      TEST
                    </button>
                    <select
                      value={fieldTemplate}
                      onChange={(event) => {
                        setFieldTemplate(event.target.value);
                      }}
                      className="w-fit border-2"
                    >
                      <option value="journal">Journal template</option>
                      <option value="weight training">
                        weight training template
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
            if (values.subjectSelection === "Add New Subject") {
              await addSubject.mutateAsync(values);
            } else {
              await updateSubject.mutateAsync(values);
            }
          })}
        >
          {form.formState.dirtyFields.subjectSelection
            ? "Update"
            : "Add New Subject"}
        </Button>
      </ButtonContainer>
    </Layout>
  );
};

export default Configure;
