import { router, protectedProcedure } from "../trpc";
import z from "zod";
import { subjectValidationSchema } from "../../../utils/useZodForm";


export const subjectRouter = router({
  addSubject: protectedProcedure
    .input(subjectValidationSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.subject.create({
        data: { name: input.subjectName, userId: ctx.session.user.id },
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
  checkUserSubjects: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.subject.findFirstOrThrow({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
