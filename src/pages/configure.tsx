import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type UseFormProps } from "react-hook-form";
import { trpc } from "../utils/trpc";
import Layout from "../components/layouts/layout";
import Button from "../ui/Button";
import Heading from "../ui/Heading";

// This validation schema is exported to the backend, it is used by the server
export const validationSchema = z.object({
  subjectName: z.string().min(1).max(50),
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
  const router = useRouter();
  const utils = trpc.useContext();

  const addSubject = trpc.subject.addSubject.useMutation({
    onSuccess: async () => {
      await utils.subject.getSubjects.invalidate();
      router.push("/");
    },
  });

  const form = useZodForm({
    schema: validationSchema,
    defaultValues: {
      subjectName: "",
    },
  });

  return (
    <Layout page="configure">
      <Heading>Profile</Heading>
      <form>
        <div className="flex flex-row flex-wrap justify-between">
          <label>Subject Name</label>
          <input
            type="text"
            className="border-2"
            {...form.register("subjectName")}
          />
          {form.formState.errors.subjectName && (
            <p>{form.formState.errors.subjectName.message}</p>
          )}
        </div>
      </form>
      <Button
        intent="accept"
        action={form.handleSubmit(async (values) => {
          await addSubject.mutateAsync(values);
        })}
      >
        Submit
      </Button>
    </Layout>
  );
};

export default Configure;
