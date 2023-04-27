import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseFormProps } from "react-hook-form";
import { z } from "zod";

export const inputTypes = ["TEXTAREA", "NUMBER", "BOOLEAN", "RANGE"] as const;
export const inputUnitTypes = [
  "kg",
  "reps",
  "sets",
  "km",
  "meters",
  "hours",
  "minutes",
  "maximum",
  "minimum",
] as const;

export type InputType = typeof inputTypes[number];
export type InputUnitType = typeof inputUnitTypes[number];

export const inputTypeOption = {
  TEXTAREA: inputTypes[0],
  NUMBER: inputTypes[1],
  BOOLEAN: inputTypes[2],
  RANGE: inputTypes[3],
  kg: inputUnitTypes[0],
  reps: inputUnitTypes[1],
  sets: inputUnitTypes[2],
  km: inputUnitTypes[3],
  meters: inputUnitTypes[4],
  hours: inputUnitTypes[5],
  minutes: inputUnitTypes[6],
  maximum: inputUnitTypes[7],
  minimum: inputUnitTypes[8],
};

export const stringToInputType = (inputTypeString: string) => {
  switch (inputTypeString) {
    case "TEXTAREA":
    case "NUMBER":
    case "BOOLEAN":
    case "RANGE":
      return inputTypeOption[inputTypeString];
  }
};

export const stringToInputUnitType = (inputUnitTypeString: string) => {
  switch (inputUnitTypeString) {
    case "kg":
    case "reps":
    case "sets":
    case "km":
    case "meters":
    case "hours":
    case "minutes":
    case "maximum":
    case "minimum":
      return inputTypeOption[inputUnitTypeString];
  }
};

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
  .superRefine((value, ctx) => {
    if (
      (value.inputType === "NUMBER" ||
        value.inputType === "BOOLEAN" ||
        value.inputType === "RANGE") &&
      !value.inputHelper
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Label is required for ${value.inputType} input type`,
        params: { inputHelper: value.inputHelper },
      });
    }
  });

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
