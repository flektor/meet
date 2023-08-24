import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusherSend } from "~/server/utils";

export const registrationsRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.registrations.findFirst({
        where: { activityId: input.activityId },
      });

      if (user) {
        pusherSend({
          receivers: user.userId,
          channelId: input.activityId,
          body: {
            action: "quick_search_found",
            sentBy: ctx.session.user.id,
            activityId: input.activityId,
          },
        });
      }

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

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.registrations.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
    }),
});
