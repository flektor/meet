import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusherSend } from "~/server/utils";

export const registrationsRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ activityId: z.string(), activitySlug: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.registration.findFirst({
        where: {
          activityId: input.activityId,
          AND: { NOT: { userId: ctx.session.user.id } },
        },
      });
      if (user) {
        pusherSend({
          receivers: user.userId,
          channelId: input.activityId,
          body: {
            action: "quick_search_found",
            sentBy: ctx.session.user.id,
            activitySlug: input.activitySlug,
          },
        });
      }

      const data = {
        userId: ctx.session.user.id,
        activityId: input.activityId,
      };

      return ctx.prisma.registration.create({ data });
    }),

  remove: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.registration.delete({
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
      return await ctx.prisma.registration.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
    }),
});
