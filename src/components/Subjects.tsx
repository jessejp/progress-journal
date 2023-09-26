import Link from "next/link";
import { trpc } from "../utils/trpc";

const Subjects: React.FC = () => {
    const subjectsQuery = trpc.subject.getSubjects.useQuery();
    const { data } = subjectsQuery;
  
    if (!data)
      return (
        <p className="text-red-600">
          Create your first subject in order to start journaling!
        </p>
      );
  
    return (
      <div className="flex h-full flex-col justify-center">
        {data.map((subject) => {
          const url = `subjects/${subject.name}`;
          return (
            <Link
              key={subject.id}
              href={url}
              className="mb-3 w-full max-w-xs rounded bg-slate-300 px-7 py-5 text-center text-lg text-zinc-900"
            >
              {subject.name}
            </Link>
          );
        })}
      </div>
    );
  };

  export default Subjects;