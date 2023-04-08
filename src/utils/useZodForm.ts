import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormProps } from "react-hook-form";
import { z } from "zod";

export const subjectValidationSchema = z.object({
  subjectName: z.string().min(1).max(50),
});

export const useZodForm = <TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  }
) => {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
};
