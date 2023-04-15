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
import React from "react";

const Configure: NextPage = () => {
  const router = useRouter();
  const { data } = trpc.subject.getSubjects.useQuery();
  const addSubject = trpc.subject.addSubject.useMutation({
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

  const watchFields = form.watch("entries.0.fields");

  return (
    <Layout page="configure">
      <Heading>Profile</Heading>
      <form className="flex w-10/12 flex-col content-center justify-center">
        <div className="mb-4 mt-2 flex flex-row flex-wrap justify-around">
          <label className="h-8 w-24 overflow-clip text-center text-lg font-bold text-zinc-200">
            Select Subject
          </label>
          <select
            className="h-8 w-1/2 overflow-clip"
            {...form.register("subjectSelection")}
          >
            <option value="Add New Subject">Add New Subject</option>
            {data?.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4 mt-2 flex flex-row flex-wrap justify-between">
          <label className="h-8 w-24 overflow-clip text-center text-lg font-bold text-zinc-200">
            Subject Name
          </label>
          <input
            type="text"
            className="w-2/4 border-2"
            {...form.register("subjectName")}
          />
          {form.formState.errors.subjectName && (
            <p className="text-red-500">
              {form.formState.errors.subjectName.message}
            </p>
          )}
        </div>
        {form.formState?.defaultValues?.entries?.length &&
          watchFields.map((field, fieldIndex) => {
            return (
              <div className="rounded bg-slate-500 p-4" key={fieldIndex}>
                <div className="mb-4 mt-2 flex flex-row flex-wrap justify-between gap-2">
                  <div>Field {fieldIndex + 1}</div>
                </div>
                <div className="mb-4 mt-2 flex flex-row flex-wrap justify-start gap-2">
                  <label className="h-8 w-1/3 text-lg overflow-clip font-bold text-zinc-200">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-40 border-2"
                    {...form.register(`entries.0.fields.${fieldIndex}.name`)}
                  />
                </div>
                {field?.fieldInputs?.map((input, inputIndex) => {
                  return (
                    <div
                      className="mb-4 mt-2 flex flex-row flex-wrap justify-start gap-2"
                      key={inputIndex}
                    >
                      <label className="h-8 w-1/3 text-lg font-bold text-zinc-200">
                        Input&nbsp;Type
                      </label>
                      <div
                      className="flex gap-4">
                      <select
                        className="w-fit border-2"
                        {...form.register(
                          `entries.0.fields.${fieldIndex}.fieldInputs.${inputIndex}.inputType`
                        )}
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
                    </div>
                  );
                })}
              </div>
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
              //update subject
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
