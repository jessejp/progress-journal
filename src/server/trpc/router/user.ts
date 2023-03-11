import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  addBodyweight: protectedProcedure
    .input(z.object({ value: z.number(), unit: z.string().nullish() }))
    .mutation(({ ctx, input }) => {
      /* ctx.prisma.user.findFirst({
        where: { id: { equals: ctx.session.user.id } },
      }) */
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id},
        data: { bodyweightValue: input.value, bodyweightUnit: input.unit || 'kg' }
      });
    }),
});
