import { type NextPage } from "next";
import { useState } from "react";
import Layout from "../../../ui/Layout";
import Button from "../../../ui/Button";
import Heading from "../../../ui/Heading";
import ButtonContainer from "../../../ui/ButtonContainer";
import MainContent from "../../../ui/MainContent";

const Entry: NextPage = () => {
  return (
    <Layout page="New Entry">
      <Heading>New Entry</Heading>
      <MainContent></MainContent>
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

export default Entry;
