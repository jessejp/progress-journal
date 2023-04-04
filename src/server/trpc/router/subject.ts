import { router, protectedProcedure } from "../trpc";
import { validationSchema } from "../../../pages/configure";

export const subjectRouter = router({
  addSubject: protectedProcedure
    .input(validationSchema)
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
