import { type NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import Layout from "../ui/Layout";
import Button from "../ui/Button";
import Heading from "../ui/Heading";
import ButtonContainer from "../ui/ButtonContainer";
import { useZodForm, subjectValidationSchema } from "../utils/useZodForm";

const inputTypes = ["TEXTAREA", "WHOLE NUMBER", "FLOAT", "BOOLEAN", "RANGE"] as const;

const Configure: NextPage = () => {
  const router = useRouter();
  const { data } = trpc.subject.getSubjects.useQuery();
  const addSubject = trpc.subject.addSubject.useMutation({
    onSuccess: async () => {
      router.push("/");
    },
  });

  const form = useZodForm({
    schema: subjectValidationSchema,
    defaultValues: {
      subjectSelection: "Add New Subject",
      subjectName: "",
    },
  });

  return (
    <Layout page="configure">
      <Heading>Profile</Heading>
      <form className="flex flex-col w-10/12 justify-center content-center">
        <div className="mt-2 mb-4 flex flex-row flex-wrap justify-around">
          <label className="h-8 w-1/2 overflow-clip text-center text-lg font-bold text-zinc-200">
            Select Subject
          </label>
          <select
            className="h-8 w-1/2 overflow-clip"
            {...form.register("subjectSelection")}
          >
            <option value="Add New Subject">Add New Subject</option>
            {data?.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-2 mb-4 flex flex-row flex-wrap justify-around">
          <label className="h-8 w-1/2 overflow-clip text-center text-lg font-bold text-zinc-200">
            Subject Name
          </label>
          <input
            type="text"
            className="w-2/4 border-2"
            {...form.register("subjectName")}
          />
          {form.formState.errors.subjectName && (
            <p className="text-red-500">
              {form.formState.errors.subjectName.message}
            </p>
          )}
        </div>
      </form>
      <ButtonContainer>
        <Button
          intent="accept"
          action={form.handleSubmit(async (values) => {
            if (values.subjectSelection === "Add New Subject") {
              await addSubject.mutateAsync(values);
            } else {
              console.log("update subject");
            }
          })}
        >
          {form.formState.dirtyFields.subjectSelection
            ? "Update"
            : "Add New Subject"}
        </Button>
      </ButtonContainer>
    </Layout>
  );
};

export default Configure;
