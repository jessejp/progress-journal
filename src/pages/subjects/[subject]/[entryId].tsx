import { createServerSideHelpers } from "@trpc/react-query/server";
import type { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { appRouter } from "../../../server/trpc/router/_app";
import superjson from "superjson";
import { trpc } from "../../../utils/trpc";
import { createContextInner } from "../../../server/trpc/context";
import React from "react";
import AppLayout from "../../../ui/layouts/AppLayout";
import LogoHeading from "../../../ui/typography/LogoHeading";
import MainContent from "../../../ui/wrappers/MainContent";
import ButtonContainer from "../../../ui/wrappers/ButtonContainer";
import Button from "../../../ui/primitives/Button";
import ContentContainer from "../../../ui/wrappers/ContentContainer";
import DisplayFieldInput from "../../../ui/components/DisplayFieldInput";

const ReadEntry: NextPage<{ subject: string; entryId: string }> = ({
  subject,
  entryId,
}) => {
  const { data } = trpc.entry.getEntry.useQuery({
    subjectName: subject,
    entryId: entryId,
    template: false,
  });

  return (
    <AppLayout page="Entry">
      <LogoHeading />
      <MainContent>
        {data && (
          <div className="flex flex-col gap-3">
            {data?.entries[0]?.fields.map((field) => {
              return (
                <ContentContainer key={field.id}>
                  <h2 className="text-xl font-semibold text-white">
                    {field.name}
                  </h2>
                  <div className="flex flex-wrap justify-evenly gap-3">
                    {field.fieldInputs.map((input) => {
                      return (
                        <React.Fragment key={input.id}>
                          {input.inputType === "TEXTAREA" && (
                            <div className="w-full">
                              <p>{input.valueString}</p>
                            </div>
                          )}
                          {input.inputType === "NUMBER" && (
                            <DisplayFieldInput
                              value={input.valueNumber}
                              inputLabel={input.inputHelper}
                            />
                          )}
                          {input.inputType === "RANGE" && (
                            <DisplayFieldInput
                              value={input.valueNumber}
                              inputLabel={input.inputHelper}
                            />
                          )}
                          {input.inputType === "BOOLEAN" && (
                            <DisplayFieldInput
                              value={input.valueBoolean ? "Yes" : "No"}
                              inputLabel={input.inputHelper}
                              intent={
                                input.valueBoolean ? "primary" : "destructive"
                              }
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </ContentContainer>
              );
            })}
          </div>
        )}
      </MainContent>
      <ButtonContainer
        mainButton={
          <Button
            icon="plus.svg"
            intent="primary"
            variant="rounded-full"
            link="/configure"
          >
            New Entry
          </Button>
        }
        iconButton={
          <>
            <Button
              icon="settings-neutral-500.svg"
              intent="option"
              variant="just-icon-circle"
              link="/configure"
            />
            <Button
              icon="user.svg"
              intent="option"
              variant="just-icon-circle"
              link="/configure"
            />
          </>
        }
      />
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
  context: GetStaticPropsContext<{ subject: string; entryId: string }>
) {
  const ctxInner = await createContextInner({ session: null });
  const ssg = await createServerSideHelpers({
    router: appRouter,
    ctx: { ...ctxInner },
    transformer: superjson,
  });

  const entryId = context.params?.entryId as string;
  const subject = context.params?.subject as string;

  await ssg.entry.getEntry.prefetch({
    subjectName: subject,
    entryId: entryId,
    template: false,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      subject: subject,
      entryId: entryId,
    },
  };
}

export default ReadEntry;
