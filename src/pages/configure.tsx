import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import { type SubmitHandler } from "react-hook-form/dist/types";
import { trpc } from "../utils/trpc";
import Layout from "../components/layouts/layout";
import Accordion from "../components/accordion";

type FormValues = {
  units: string;
  bodyweight: number;
};

const Configure: NextPage = () => {
  const updateUserSettings = trpc.user.updateSettings.useMutation();

  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    updateUserSettings.mutate(data);
  };

  return (
    <Layout page="configure">
      <h1>Profile</h1>
      <form className="flex-row" onSubmit={handleSubmit(onSubmit)}>
        <Accordion title="Personal Information">
          <div className="flex flex-row justify-between">
            <label>Units</label>
            <select className="border-2" {...register("units")}>
              <option value="Metric">Metric</option>
            </select>
          </div>
          <div className="m-2" />
          <div className="flex flex-row justify-between">
            <label>Bodyweight:</label>
            <input
              type="number"
              className="w-16 border-2"
              {...register("bodyweight", {valueAsNumber: true, min: 0})}
            />
          </div>
          <div className="m-2" />
        </Accordion>
        <div>
          <button className="border-2 bg-red-300">Save Changes</button>
        </div>
      </form>
    </Layout>
  );
};

export default Configure;
