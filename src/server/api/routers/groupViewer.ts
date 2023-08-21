import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusherSend } from "~/server/utils";

export const groupViewerRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        activitySlug: z.string(),
        groupSlug: z.string(),
        groupId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const data = {
        userId: ctx.session.user.id,
        groupId: input.groupId,
      };

      const others = await ctx.prisma.groupViewer
        .findMany({ where: { groupId: input.groupId } });

      await ctx.prisma.groupViewer.create({ data });

      if (others.length === 0) {
        return;
      }

      const receivers = others.map(({ userId }) => `user-${userId}`);

      pusherSend({
        receivers,
        channelId: `${input.activitySlug}/${input.groupSlug}`,
        body: {
          action: "add_viewer",
          sentBy: ctx.session.user.id,
          activitySlug: input.activitySlug,
          groupSlug: input.groupSlug,
        },
      });
    }),

  remove: protectedProcedure
    .input(
      z.object({
        activitySlug: z.string(),
        groupSlug: z.string(),
        groupId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.groupViewer.delete({
        where: {
          userId_groupId: {
            groupId: input.groupId,
            userId: ctx.session.user.id,
          },
        },
      });

      const others = await ctx.prisma.groupViewer
        .findMany({ where: { groupId: input.groupId } });

      if (others.length === 0) {
        return;
      }

      const receivers = others.map(({ userId }) => `user-${userId}`);

      pusherSend({
        receivers,
        channelId: `${input.activitySlug}/${input.groupSlug}`,
        body: {
          action: "remove_viewer",
          sentBy: ctx.session.user.id,
          activitySlug: input.activitySlug,
          groupSlug: input.groupSlug,
        },
      });
    }),

  getGroupViewers: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input, ctx }) => {
      const views = await ctx.prisma.groupViewer
        .findMany({
          where: { groupId: input.groupId },
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
