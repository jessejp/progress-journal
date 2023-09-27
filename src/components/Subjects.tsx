import Link from "next/link";
import ContentContainer from "../ui/wrappers/ContentContainer";
import H2 from "../ui/typography/H2";

interface SubjectProps {
  data: {
    data: {
      id: string;
      name: string;
    }[] | undefined;
  };
}

const Subjects: React.FC<SubjectProps> = (props) => {
  const { data } = props.data;
  return (
    <ContentContainer>
      <H2>Your Subjects</H2>
      {!!data && (
        <div className="flex flex-col gap-3">
          {data.map((subject) => {
            const url = `subjects/${subject.name}`;
            return (
              <Link
                key={subject.id}
                href={url}
                className="w-full rounded-md border-1 border-slate-100 bg-violet-700 px-4 py-2 font-bold text-slate-100"
              >
                {subject.name}
              </Link>
            );
          })}
        </div>
      )}
    </ContentContainer>
  );
};

export default Subjects;
