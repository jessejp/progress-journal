import { router, publicProcedure, protectedProcedure } from "../trpc";
import z from "zod";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  deleteAccount: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.prisma.account.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
      if (!account) {
        throw new Error("Account not found");
      }
      return account;
    }),
});
