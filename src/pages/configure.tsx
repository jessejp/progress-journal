import { type NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import Layout from "../ui/Layout";
import Button from "../ui/Button";
import Heading from "../ui/Heading";
import ButtonContainer from "../ui/ButtonContainer";
import { useZodForm, subjectValidationSchema } from "../utils/useZodForm";

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
    schema: subjectValidationSchema,
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
      <ButtonContainer>
        <Button
          intent="accept"
          action={form.handleSubmit(async (values) => {
            await addSubject.mutateAsync(values);
          })}
        >
          Submit
        </Button>
      </ButtonContainer>
    </Layout>
  );
};

export default Configure;
