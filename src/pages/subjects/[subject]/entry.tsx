import { type NextPage } from "next";
import Layout from "../../../ui/Layout";
import Button from "../../../ui/Button";
import Heading from "../../../ui/Heading";
import ButtonContainer from "../../../ui/ButtonContainer";
import MainContent from "../../../ui/MainContent";
import { trpc } from "../../../utils/trpc";
import type { GetStaticPaths, GetStaticPropsContext } from "next";
import { useZodForm, entryValidationSchema } from "../../../utils/useZodForm";
import React from "react";

const Entry: NextPage<{ subject: string }> = ({ subject }) => {
  const { data } = trpc.entry.getEntryTemplate.useQuery({
    subjectName: subject,
  });

  const form = useZodForm({
    schema: entryValidationSchema,
    defaultValues: {
      fields: data?.entries[0]?.fields.map((field) => {
        return {
          fieldInputs: field.fieldInputs.map((input) => {
            return {
              valueString: input.inputType === "TEXTAREA" ? "" : undefined,
              valueNumber:
                input.inputType === "NUMBER" ? input.valueInteger : undefined,
            };
          }),
        };
      }),
    },
  });

  if (!data || !data.entries.length) return <div>No data</div>;

  return (
    <Layout page="New Entry">
      <Heading>New Entry</Heading>
      <MainContent>
        <form
          onSubmit={form.handleSubmit(() => {
            console.log("handleSubmit");
          })}
        >
          {data?.entries[0]?.fields.map((field, fieldIndex) => {
            return (
              <div
                className="w-full bg-slate-500 px-4 py-2 md:w-3/5"
                key={field.id}
              >
                <label className="text-zinc-200" htmlFor={field.name}>
                  {field.name}
                </label>
                {field.fieldInputs.map((input, inputIndex) => {
                  function inputType() {
                    switch (input.inputType) {
                      case "TEXTAREA":
                        return (
                          <React.Fragment key={input.id}>
                            <textarea
                              className="h-32 w-full bg-slate-400"
                              {...form.register(
                                `fields.${fieldIndex}.fieldInputs.${inputIndex}.valueString`
                              )}
                            />
                          </React.Fragment>
                        );
                      default:
                        return null;
                    }
                  }
                  return inputType();
                })}
              </div>
            );
          })}
          <button className="bg-zinc-200" type="submit">
            Submit
          </button>
        </form>
      </MainContent>
      <ButtonContainer>
        <Button intent="cancel" link="/">
          Back
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
