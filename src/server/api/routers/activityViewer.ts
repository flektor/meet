import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusherSend } from "~/server/utils";

export const activityViewerRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        activityId: z.string(),
        channelId: z.string(),
      }),
    )
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

      pusherSend({
        receivers: others.map(({ userId }) => userId),
        channelId: input.channelId,
        body: {
          action: "add_viewer",
          sentBy: ctx.session.user.id,
        },
      });
    }),

  remove: protectedProcedure
    .input(z.object({
      activityId: z.string(),
      channelId: z.string(),
    }))
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

      pusherSend({
        receivers: others.map(({ userId }) => userId),
        channelId: input.channelId,
        body: {
          action: "remove_viewer",
          sentBy: ctx.session.user.id,
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
      }));
    }),
});
