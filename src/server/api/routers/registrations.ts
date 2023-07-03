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
          receivers: `user-${user.userId}`,
          slug: `quick-${input.activityId}`,
          action: "quick",
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
});
