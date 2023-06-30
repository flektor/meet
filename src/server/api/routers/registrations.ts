import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const registrationsRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(({ input, ctx }) => {
      const data = {
        userId: ctx.session.user.id,
        activityId: input.activityId,
      };
      return ctx.prisma.registrations.create({ data });
    }),

  remove: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.registrations.delete({
        where: {
          userId_activityId: {
            activityId: input.activityId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
});
