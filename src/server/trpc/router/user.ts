import { router, protectedProcedure } from "../trpc";
import { validationSchema } from "../../../pages/configure";

export const userRouter = router({
  updateSettings: protectedProcedure
    .input(validationSchema)
    .mutation(({ ctx, input }) => {
      console.log("--- --- updateSettings called --- ---");
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { bodyweight: input.bodyweight, units: input.units || "Metric" },
      });
    }),
  getSettings: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findFirst({
      where: { id: { equals: ctx.session.user.id } },
    });
  }),
});
