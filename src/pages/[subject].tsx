import { type NextPage } from "next";
import Layout from "../components/layouts/layout";
import { useRouter } from "next/router";
import Heading from "../ui/Heading";
import Button from "../ui/Button";

const Subject: NextPage = () => {
  const router = useRouter();
  const { subject } = router.query;
  return (
    <Layout page={"Subject"}>
      <Heading>{subject}</Heading>
      <main>Test</main>
      <nav className="flex w-full flex-row justify-evenly">
      <Button intent="cancel" link="/">
        Back
      </Button>
      </nav>
    </Layout>
  );
};

export default Subject;
