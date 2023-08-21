import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusherSend } from "~/server/utils";

export const activityViewerRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ activitySlug: z.string(), activityId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const data = {
        userId: ctx.session.user.id,
        activityId: input.activityId,
      };

      const others = await ctx.prisma.activityViewer
        .findMany({ where: { activityId: input.activityId } });

      await ctx.prisma.activityViewer.create({ data });

      if (others.length === 0) {
        return;
      }

      const receivers = others.map(({ userId }) => `user-${userId}`);

      pusherSend({
        receivers,
        channelId: input.activitySlug,
        body: {
          action: "add_viewer",
          sentBy: ctx.session.user.id,
          activitySlug: input.activitySlug,
        },
      });
    }),

  remove: protectedProcedure
    .input(z.object({ activitySlug: z.string(), activityId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.activityViewer.delete({
        where: {
          userId_activityId: {
            activityId: input.activityId,
            userId: ctx.session.user.id,
          },
        },
      });

      const others = await ctx.prisma.activityViewer
        .findMany({ where: { activityId: input.activityId } });

      if (others.length === 0) {
        return;
      }

      const receivers = others.map(({ userId }) => `user-${userId}`);

      pusherSend({
        receivers,
        channelId: input.activitySlug,
        body: {
          action: "remove_viewer",
          sentBy: ctx.session.user.id,
          activitySlug: input.activitySlug,
        },
      });
    }),

  // getAll: protectedProcedure
  //   .input(z.object({ activityId: z.string() }))
  //   .query(({ input, ctx }) =>
  //     ctx.prisma.activityViewer
  //       .findMany({
  //         where: { activityId: input.activityId },
  //       })
  //   ),

  getActivityViewers: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .query(async ({ input, ctx }) => {
      const views = await ctx.prisma.activityViewer
        .findMany({
          where: { activityId: input.activityId },
          include: { user: true },
        });

      return views.map(({ user }) => ({
        userId: user.id,
        image: user.image,
        name: user.name,
        slug: `user-${user.id}`,
      }));
    }),
});
