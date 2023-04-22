import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseFormProps } from "react-hook-form";
import { z } from "zod";

export const fieldInputValidation = z.object({
  fieldId: z.string(),
  valueNumber: z.optional(z.number().nullable()),
  valueString: z.optional(z.string().max(510).nullable()),
  valueBoolean: z.optional(z.boolean().nullable()),
  inputHelper: z.optional(z.string().max(12).nullable()),
  inputType: z.string(),
});

export const fieldValidationSchema = z.object({
  name: z.string().min(1).max(36),
  category: z.optional(z.string()),
  fieldInputs: z.array(fieldInputValidation),
});

export const entryValidationSchema = z.object({
  subjectId: z.string(),
  categories: z.optional(z.string()),
  fields: z.array(fieldValidationSchema),
});

export const subjectValidationSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
  entries: z.array(
    z.object({
      template: z.boolean(),
      categories: z.optional(z.string().nullable()),
      id: z.string(),
      fields: z.array(
        z.object({
          name: z.string().min(1).max(50),
          category: z.optional(z.string().nullable()),
          id: z.string(),
          fieldInputs: z.array(
            z.object({
              id: z.string(),
              valueNumber: z.optional(z.number().nullable()),
              valueString: z.optional(z.string().max(510).nullable()),
              valueBoolean: z.optional(z.boolean().nullable()),
              inputHelper: z.optional(z.string().max(36).nullable()),
              inputType: z.string(),
            })
          ),
        })
      ),
    })
  ),
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

export const inputTypes = ["TEXTAREA", "NUMBER", "BOOLEAN", "RANGE"] as const;
