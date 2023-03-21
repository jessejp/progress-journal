import { router, protectedProcedure } from "../trpc";
import { validationSchema } from "../../../pages/configure";

export const subjectRouter = router({
    addSubject: protectedProcedure.input(validationSchema).mutation(({ ctx, input }) => {
        console.log("--- --- addSubject called --- ---");
        return ctx.prisma.subject.create({
            data: { name: input.subjectName, },
        });
    }
});