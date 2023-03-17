import { type NextPage } from "next";
import Layout from "../components/layouts/layout";
import { useRouter } from "next/router";
import Link from "next/link";

const Subject: NextPage = () => {
  const router = useRouter();
  const { subject } = router.query;

  return (
    <Layout page={"Subject"}>
      <h1>Subject: {subject}</h1>
      <Link href="/" className="border-2 bg-red-300">
        Next
      </Link>
    </Layout>
  );
};

export default Subject;
