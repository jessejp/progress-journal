import { type NextPage } from "next";
import Layout from "../../ui/Layout";
import { useRouter } from "next/router";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import ButtonContainer from "../../ui/ButtonContainer";
import MainContent from "../../ui/MainContent";

const Subject: NextPage = () => {
  const router = useRouter();
  const { subject } = router.query;
  return (
    <Layout page={"Subject"}>
      <Heading>{subject}</Heading>
      <MainContent>Test!</MainContent>
      <ButtonContainer>
       {/*  <Button intent="cancel" link="/">
          Back
        </Button> */}
        <Button intent="open" link={`/subjects/${subject}/entry`}>
          + Journal
        </Button>
      </ButtonContainer>
    </Layout>
  );
};

export default Subject;
