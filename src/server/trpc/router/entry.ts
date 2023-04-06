import { router, protectedProcedure } from "../trpc";
import z from "zod";

export const entryRouter = router({
    getEntries: protectedProcedure.input(z.object({
        subjectId: z.string(),
    })).query(({ input, ctx }) => {
        return ctx.prisma.entry.findMany({
            where: {
                subjectId: input.subjectId,
            },
        });
    }),
    createEntry: protectedProcedure.input(z.object({
        subjectId: z.string()
    })).mutation(({ input, ctx }) => {
        return ctx.prisma.entry.create({
            data: {
                subjectId: input.subjectId,
            }
        });
    }),
})