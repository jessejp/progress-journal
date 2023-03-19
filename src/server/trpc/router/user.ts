import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  updateSettings: protectedProcedure
    .input(z.object({ bodyweight: z.number(), units: z.string() }))
    .mutation(({ ctx, input }) => {
      /* ctx.prisma.user.findFirst({
        where: { id: { equals: ctx.session.user.id } },
      }) */
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id},
        data: { bodyweight: input.bodyweight, units: input.units || 'Metric' }
      });
    }),
});
