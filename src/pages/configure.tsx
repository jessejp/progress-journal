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
      <form>
        <div className="flex flex-row flex-wrap justify-between my-2">
          <label>Select Subject</label>
          <select className="overflow-clip w-2/4 h-8"
          {...form.register("subjectSelection")}>
            <option value="Add New Subject">Add New Subject</option>
            {data?.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-row flex-wrap justify-between">
          <label>Subject Name</label>
          <input
            type="text"
            className="border-2 w-2/4"
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
            if(values.subjectSelection === "Add New Subject") {
            await addSubject.mutateAsync(values);
          } else {
            console.log('update subject')
          }
          })}
        >
          {form.formState.dirtyFields.subjectSelection ? "Update" : "Add New Subject"}
        </Button>
      </ButtonContainer>
    </Layout>
  );
};

export default Configure;
