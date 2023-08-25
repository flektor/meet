import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusherSend } from "~/server/utils";

export const groupViewerRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        channelId: z.string(),
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
    .input(
      z.object({
        groupId: z.string(),
        channelId: z.string(),
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

      pusherSend({
        receivers: others.map(({ userId }) => userId),
        channelId: input.channelId,
        body: {
          action: "remove_viewer",
          sentBy: ctx.session.user.id,
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
      }));
    }),
});
