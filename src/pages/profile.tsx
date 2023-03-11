import { type NextPage } from "next";
import Layout from "../components/layouts/layout";
import { useState } from "react";

const Profile: NextPage = () => {
  const [inputBodyweight, setInputBodyweight] = useState<number>();

  return (
    <Layout page="profile">
      <h1>Profile</h1>
      <div className="flex-row">
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
        <div>
          <button className="border-2 bg-red-300">Save Changes</button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
