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
          id: input.subjectSelection,
        },
        include: {
          entries: {
            where: {
              template: true,
              subjectId: input.subjectSelection,
            },
          },
        },
        data: {
          name: input.subjectName,
          entries: {
            update: input.entries.map((entry) => ({
              where: {
                id: entry.entryId,
              },
              data: {
                fields: {
                  create: input?.entries[0]?.fields.map((field) => ({
                    name: field.name,
                    fieldInputs: {
                      create: field.fieldInputs.map((fieldInput) => ({
                        inputType: fieldInput.inputType,
                        unit: fieldInput.unit,
                      })),
                    },
                  })),
                },
              },
            })),
          },
        },
      });
    }),
  addSubject: protectedProcedure
    .input(subjectValidationSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.subject.create({
        data: {
          name: input.subjectName,
          userId: ctx.session.user.id,
          entries: {
            create: input.entries.map((entry) => ({
              template: entry.template,
              fields: {
                create: input?.entries[0]?.fields.map((field) => ({
                  name: field.name,
                  fieldInputs: {
                    create: field.fieldInputs.map((fieldInput) => ({
                      inputType: fieldInput.inputType,
                      unit: fieldInput.unit,
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
