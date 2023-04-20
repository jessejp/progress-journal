import { router, protectedProcedure } from "../trpc";
import z from "zod";
import { subjectValidationSchema } from "../../../utils/useZodForm";
import { TRPCError } from "@trpc/server";

export const subjectRouter = router({
  updateSubject: protectedProcedure
    .input(subjectValidationSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.subject.update({
        where: {
          id: input.id,
        },
        // include: {
        //   entries: {
        //     where: {
        //       template: true,
        //     },
        //   },
        // },
        data: {
          name: input.name,
          
          // entries: {
          //   upsert: input.entries.map((entry) => ({
          //     where: {
          //       id: entry.entryId,
          //     },
          //     update: {
          //       categories: entry.categories,
          //     },
          //     create: {
          //       categories: entry.categories,
          //     },
          //   })),
          // },
        },
      });
    }),
  addSubject: protectedProcedure
    .input(subjectValidationSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.subject.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
          entries: {
            create: input.entries.map((entry) => ({
              template: entry.template,
              categories: entry.categories,
              fields: {
                create: input?.entries[0]?.fields.map((field) => ({
                  name: field.name,
                  category: field.category,
                  fieldInputs: {
                    create: field.fieldInputs.map((fieldInput) => ({
                      inputType: fieldInput.inputType,
                      inputHelper: fieldInput.inputHelper,
                    })),
                  },
                })),
              },
            })),
          },
        },
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

      if (!subject)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No subjects found",
        });

      return subject;
    }),
  getSubject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const subject = ctx.prisma.subject.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          entries: {
            include: {
              fields: {
                include: {
                  fieldInputs: true,
                },
              },
            },
          },
        },
      });

      if (!subject)
        throw new TRPCError({ code: "NOT_FOUND", message: "No subject found" });

      return subject;
    }),
});
