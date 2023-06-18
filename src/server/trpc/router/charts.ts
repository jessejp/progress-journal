import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const chartsRouter = router({
  getFieldsByTemplateId: protectedProcedure
    .input(z.object({ templateId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.field.findMany({
        where: {
          templateId: input.templateId,
        },
        include: {
          fieldInputs: true,
        },
      });
    }),
});
