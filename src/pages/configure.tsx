import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import { type SubmitHandler } from "react-hook-form/dist/types";
import { trpc } from "../utils/trpc";
import Layout from "../components/layouts/layout";
import Accordion from "../components/accordion";
import { useEffect } from "react";
import { type RouterOutputs } from "../utils/trpc";

type FormValues = {
  units: string;
  bodyweight: number;
  subjectName: string;
  trackingTemplate: string;
};

const Configure: NextPage = () => {
  const getSettings = trpc.user.getSettings.useQuery();
  const updateUserSettings = trpc.user.updateSettings.useMutation();

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (
      data.bodyweight !== getSettings.data?.bodyweight ||
      data.units !== getSettings.data?.units
    )
      updateUserSettings.mutate({
        bodyweight: data.bodyweight,
        units: data.units,
      });
  };

  useEffect(() => {
    if (getSettings.data) {
      console.log(getSettings.data?.bodyweight + " " + "use Effect");
      let defaultValues = {
        units: getSettings.data.units || "Metric",
        bodyweight: getSettings.data.bodyweight || 0,
      };
      reset({
        ...defaultValues,
      });
    }
  }, [getSettings.data]);

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
              {...register("bodyweight", { valueAsNumber: true, min: 0 })}
            />
          </div>
          <div className="m-2" />
        </Accordion>

        <div className="m-2" />

        {/* <Accordion title="New Journal Subject">
          <div className="flex flex-row justify-between">
            <label>Subject Name</label>
            <input
              type="text"
              className="border-2"
              {...register("subjectName")}
            />
          </div>
          <div className="m-2" />
          <div className="flex flex-row justify-between">
            <p>Measurable data for progress tracking</p>
          </div>
          <div className="m-2" />
          <div className="flex flex-row justify-between">
            <label>Template</label>
            <select className="border-2" {...register("trackingTemplate")}>
              <option value="Custom">Custom</option>
              <option value="Weight Training">Weight Training</option>
            </select>
          </div>
          <div className="m-2" />
          <div className="flex flex-row justify-between">
            <label>Entry Name</label>
            <input type="text" className="border-2" />
          </div>
        </Accordion> */}
        <div>
          <button className="border-2 bg-red-300">Save Changes</button>
        </div>
      </form>
    </Layout>
  );
};

export default Configure;
