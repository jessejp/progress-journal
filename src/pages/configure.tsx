import { type NextPage } from "next";
import { useForm, UseFormProps, useFormState } from "react-hook-form";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import Layout from "../components/layouts/layout";
import Accordion from "../components/accordion";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// This validation schema is exported to the backend, it is used by the server
export const validationSchema = z.object({
  bodyweight: z.number().nullable(),
  units: z.string(),
  subjectName: z.string().nullable(),
  trackingTemplate: z.string(),
});

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  }
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
}

const Configure: NextPage = () => {
  const utils = trpc.useContext().user;
  const getSettings = trpc.user.getSettings.useQuery();

  const userSettings = getSettings.data;

  const updateUserSettings = trpc.user.updateSettings.useMutation({
    onSuccess: async () => {
      await utils.getSettings.invalidate();
    },
  });

  const form = useZodForm({
    schema: validationSchema,
  });

  // Set Form Defaults
  useEffect(() => {
    if (userSettings) {
      let defaultValues = {
        units: userSettings.units || "Metric",
        bodyweight: userSettings.bodyweight,
      };
      form.reset({
        ...defaultValues,
      });
    }
  }, [userSettings]);

  return (
    <Layout page="configure">
      <h1>Profile</h1>
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={form.handleSubmit(async (values) => {
          await updateUserSettings.mutateAsync(values);
        })}
      >
        <Accordion title="Personal Information">
          <div className="flex flex-row justify-between">
            <label>Units</label>
            <select className="border-2" {...form.register("units")}>
              <option value="Metric">Metric</option>
            </select>
          </div>
          <div className="m-2" />
          <div className="flex flex-row justify-between">
            <label>Bodyweight:</label>
            <input
              type="number"
              className="w-16 border-2"
              {...form.register("bodyweight", { valueAsNumber: true, min: 0 })}
            />
          </div>
          <div className="m-2" />
        </Accordion>

        <div className="m-2" />

        <Accordion title="New Journal Subject">
          <div className="flex flex-row justify-between">
            <label>Subject Name</label>
            <input
              type="text"
              className="border-2"
              {...form.register("subjectName")}
            />
          </div>
          <div className="m-2" />
          <div className="flex flex-row justify-between">
            <p>Measurable data for progress tracking</p>
          </div>
          <div className="m-2" />
          <div className="flex flex-row justify-between">
            <label>Template</label>
            <select className="border-2" {...form.register("trackingTemplate")}>
              <option value="Custom">Custom</option>
              <option value="Weight Training">Weight Training</option>
            </select>
          </div>
          <div className="m-2" />
          <div className="flex flex-row justify-between">
            <label>Entry Name</label>
            <input type="text" className="border-2" />
          </div>
        </Accordion>
        <div>
          <button className="border-2 bg-red-300">Save Changes</button>
        </div>
      </form>
      <Link href="/">Back</Link>
    </Layout>
  );
};

export default Configure;
