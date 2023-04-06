import { type NextPage } from "next";
import Layout from "../../../ui/Layout";
import Button from "../../../ui/Button";
import Heading from "../../../ui/Heading";
import ButtonContainer from "../../../ui/ButtonContainer";
import MainContent from "../../../ui/MainContent";

const Entry: NextPage = () => {
  return <Layout page="New Entry">
    <Heading>New Entry</Heading>
    <MainContent>
      New Entry
    </MainContent>
      <ButtonContainer>
        <Button intent="cancel" link="/">Back</Button>
      </ButtonContainer>
  </Layout>;
};

export default Entry;
