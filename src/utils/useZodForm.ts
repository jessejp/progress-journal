import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormProps } from "react-hook-form";
import { z } from "zod";

export const subjectValidationSchema = z.object({
  subjectName: z.string().min(1).max(50),
});

export const fieldInputValidation = z.object({
  fieldId: z.string(),
  valueInteger: z.optional(z.number().nullable()),
  valueFloat: z.optional(z.number().nullable()),
  valueString: z.optional(z.string().max(510).nullable()),
  valueBoolean: z.optional(z.boolean().nullable()),
  unit: z.optional(z.string().max(12).nullable()),
  inputType: z.string(),
});

export const fieldValidationSchema = z.object({
  name: z.string().min(1).max(50),
  fieldInputs: z.array(fieldInputValidation),
});

export const entryValidationSchema = z.object({
  fields: z.array(fieldValidationSchema),
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
