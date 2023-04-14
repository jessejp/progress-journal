import { router, protectedProcedure } from "../trpc";
import z from "zod";
import { subjectValidationSchema } from "../../../utils/useZodForm";

export const subjectRouter = router({
  addSubject: protectedProcedure
    .input(subjectValidationSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.subject.create({
        data: {
          name: input.subjectName,
          userId: ctx.session.user.id,
          entries: {
            create: input.entries.map((entry) => ({
              template: entry.template,
              fields: {
                create: input?.entries[0]?.fields.map((field) => ({
                  name: field.name,
                  fieldInputs: {
                    create: field.fieldInputs.map((fieldInput) => ({
                      inputType: fieldInput.inputType,
                      unit: fieldInput.unit,
                    })),
                  },
                })),
              },
            })),
          },
        },
      });
    }),
  getSubjects: protectedProcedure
    .output(z.array(z.object({ name: z.string(), id: z.string() }))) //Output filter's the data that is returned
    .query(({ ctx }) => {
      const subject = ctx.prisma.subject.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (!subject) throw new Error("No subjects found");

      return subject;
    }),
});
