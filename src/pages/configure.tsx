import { type NextPage } from "next";
import Layout from "../components/layouts/layout";
import { useState } from "react";
import Link from "next/link";
import Accordion from "../components/accordion";

const Configure: NextPage = () => {
  const [inputBodyweight, setInputBodyweight] = useState<number>();

  return (
    <Layout page="configure">
      <h1>Profile</h1>
      <div className="flex-row">
        <Accordion title="Personal Information">
        <div>Enter your bodyweight:</div>
        <div className="flex flex-row">
          <input
            value={inputBodyweight}
            name="value"
            type="number"
            placeholder="value"
            onChange={(e) => {
              setInputBodyweight(e.target.valueAsNumber);
            }}
          />
          <p className="w-4 text-red-500">*</p>
        </div>
        <div className="m-1" />
        <div>
          <input name="unit" type="text" placeholder="kg" maxLength={5} />
        </div>
        <div className="m-1" />
        </Accordion>
        <div>
          <Link href="/" className="border-2 bg-red-300">Save Changes</Link>
        </div>
      </div>
    </Layout>
  );
};

export default Configure;
