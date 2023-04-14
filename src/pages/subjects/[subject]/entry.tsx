import React, { useEffect } from "react";
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
                  input.inputType === "NUMBER" ? input.valueInteger : undefined,
                valueBoolean: input.inputType === "BOOLEAN" ? false : undefined,
                unit: input.unit,
                inputType: input.inputType,
              };
            }),
          };
        }),
      });
    }
  }, [data, form]);

  if (!data || !data.entries.length) return <div>No data</div>;

  return (
    <Layout page="New Entry">
      <Heading>New Entry</Heading>
      <MainContent>
        <form className="flex w-full justify-center">
          {data?.entries[0]?.fields.map((field, fieldIndex) => {
            return (
              <div
                className="w-full bg-slate-600 px-4 py-2 md:w-3/5"
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
                              className="h-32 w-full bg-slate-800 text-slate-200"
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
