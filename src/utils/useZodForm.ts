import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseFormProps } from "react-hook-form";
import { z } from "zod";

export const inputTypes = ["TEXTAREA", "NUMBER", "BOOLEAN", "RANGE"] as const;

export type InputType = (typeof inputTypes)[number];

export const fieldInputValidation = z
  .object({
    id: z.string(),
    fieldId: z.string(),
    valueNumber: z.optional(z.number().nullable()),
    valueString: z.optional(z.string().max(510).nullable()),
    valueBoolean: z.optional(z.boolean().nullable()),
    inputType: z.enum(inputTypes),
    inputHelper: z.string().nullable(),
  })
  .refine(
    (schema) => {
      switch (schema.inputType) {
        case "BOOLEAN":
          return schema.inputHelper === null;
        case "NUMBER":
          return schema.inputHelper === null;
        case "RANGE":
          return schema.inputHelper === null;
        case "TEXTAREA":
          return true;
      }
    },
    (schema) => ({
      message: `Input type ${schema.inputType} requires input helper`,
    })
  );

export const fieldValidationSchema = z.object({
  id: z.string(),
  entryId: z.string(),
  name: z.string().min(1).max(36),
  category: z.optional(z.string().max(12).nullable()),
  fieldInputs: z.array(fieldInputValidation),
});

export const entryValidationSchema = z.object({
  id: z.string(),
  subjectId: z.string(),
  categories: z.optional(z.string().max(64).nullable()),
  template: z.boolean(),
  fields: z.array(fieldValidationSchema),
});

export const subjectValidationSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
  entries: z.array(entryValidationSchema),
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
