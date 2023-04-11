import { type NextPage } from "next";
import { useState } from "react";
import Layout from "../../../ui/Layout";
import Button from "../../../ui/Button";
import Heading from "../../../ui/Heading";
import ButtonContainer from "../../../ui/ButtonContainer";
import MainContent from "../../../ui/MainContent";
import { trpc } from "../../../utils/trpc";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "../../../server/trpc/router/_app";
import { prisma } from "../../../server/db/client";
import superjson from "superjson";
import type { GetStaticPaths, GetStaticPropsContext } from "next";

const Entry: NextPage<{ subject: string }> = ({ subject }) => {
  console.log(subject);
  const { data } = trpc.entry.getEntryTemplate.useQuery({
    subjectName: subject,
  });

  if (!data) return <div>No data</div>;

  return (
    <Layout page="New Entry">
      <Heading>New Entry</Heading>
      <MainContent>
        {data?.fields.map((field) => {
          const inputType = () => {
            switch (field.inputType) {
              case "textarea":
                return <TextArea />;
            }
          };

          return (
            <div key={field.id}>
              <label htmlFor={field.name}>{field.name}</label>
              {inputType()}
            </div>
          );
        })}
      </MainContent>
      <ButtonContainer>
        <Button intent="cancel" link="/">
          Back
        </Button>
      </ButtonContainer>
    </Layout>
  );
};

const TextArea = () => {
  const [text, setText] = useState("");

  return (
    <div className="flex w-full flex-col">
      <label className="text-slate-200" htmlFor="entry">
        Entry
      </label>
      <textarea
        onChange={(event) => {
          setText(event.target.value);
        }}
        className="bg-slate-400"
      ></textarea>
    </div>
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
