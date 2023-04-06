import { router, protectedProcedure } from "../trpc";
import z from "zod";

export const subjectValidationSchema = z.object({
  subjectName: z.string().min(1).max(50),
});

export const subjectRouter = router({
  addSubject: protectedProcedure
    .input(subjectValidationSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.subject.create({
        data: { name: input.subjectName, userId: ctx.session.user.id },
      });
    }),
  getSubjects: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.subject.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  checkUserSubjects: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.subject.findFirstOrThrow({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
