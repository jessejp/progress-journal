import { router, protectedProcedure } from "../trpc";
import z from "zod";
import { fieldInputValidation } from "../../../utils/useZodForm";

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
  getEntryTemplate: protectedProcedure
    .input(z.object({ subjectName: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.subject.findFirst({
        where: {
          name: input.subjectName,
          userId: ctx.session.user.id,
        },
        include: {
          entries: {
            where: {
              template: true,
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
  createEntry: protectedProcedure
    .input(
      z.object({
        subjectId: z.string(),
        fields: z.array(fieldInputValidation),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.entry.create({
        data: {
          subjectId: input.subjectId,
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
