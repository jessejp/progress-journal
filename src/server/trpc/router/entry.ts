import { router, protectedProcedure } from "../trpc";
import z from "zod";

const fieldInputValidation = z.object({
  valueInteger: z.optional(z.number().nullable()),
  valueFloat: z.optional(z.number().nullable()),
  valueString: z.optional(z.string().max(510).nullable()),
  valueBoolean: z.optional(z.boolean().nullable()),
  unit: z.optional(z.string().max(12).nullable()),
  inputType: z.string(),
});

export const entryRouter = router({
  getEntries: protectedProcedure
    .input(
      z.object({
        subjectId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.entry.findMany({
        where: {
          subjectId: input.subjectId,
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
