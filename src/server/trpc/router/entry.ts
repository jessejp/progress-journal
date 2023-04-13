import { router, protectedProcedure } from "../trpc";
import z from "zod";
import {
  entryValidationSchema,
  fieldInputValidation,
} from "../../../utils/useZodForm";

export const entryRouter = router({
  getEntries: protectedProcedure
    .input(
      z.object({
        subjectName: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const subject = await ctx.prisma.subject.findFirst({
        where: {
          name: input.subjectName,
          userId: ctx.session.user.id,
        },
      });
      return ctx.prisma.entry.findMany({
        where: {
          subjectId: subject?.id,
        },
      });
    }),
  getEntry: protectedProcedure
    .input(
      z.object({
        subjectName: z.string(),
        template: z.boolean(),
        entryId: z.string().optional(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.subject.findFirst({
        where: {
          name: input.subjectName,
          userId: ctx.session.user.id,
        },
        include: {
          entries: {
            where: {
              id: input.entryId,
              OR: {
                template: input.template,
              },
            },
            include: {
              fields: {
                include: {
                  fieldInputs: true,
                },
              },
            },
          },
        },
      });
    }),
  addEntry: protectedProcedure
    .input(entryValidationSchema)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.entry.create({
        data: {
          subjectId: input.subjectId,
          fields: {
            create: input.fields.map((field) => ({
              name: field.name,
              fieldInputs: {
                create: field.fieldInputs.map((fieldInput) => ({
                  valueInteger: fieldInput.valueInteger,
                  valueFloat: fieldInput.valueFloat,
                  valueString: fieldInput.valueString,
                  valueBoolean: fieldInput.valueBoolean,
                  unit: fieldInput.unit,
                  inputType: fieldInput.inputType,
                })),
              },
            })),
          },
        },
      });
    }),
});

export const fieldRouter = router({
  createField: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        fieldInputs: z.array(fieldInputValidation),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.field.create({
        data: {
          name: input.name,
        },
      });
    }),
  createFieldInput: protectedProcedure
    .input(fieldInputValidation)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.fieldInput.create({
        data: {
          fieldId: input.fieldId,
          valueInteger: input.valueInteger,
          valueFloat: input.valueFloat,
          valueString: input.valueString,
          valueBoolean: input.valueBoolean,
          unit: input.unit,
          inputType: input.inputType,
        },
      });
    }),
});
