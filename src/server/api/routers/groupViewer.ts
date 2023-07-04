import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusherServerClient } from "~/server/pusher";

export const groupViewerRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const data = {
        userId: ctx.session.user.id,
        groupId: input.groupId,
      };

      const others = await ctx.prisma.groupViewer
        .findMany({
          where: { groupId: input.groupId },
        });

      const viewer = await ctx.prisma.groupViewer.create({ data });

      const receivers = others.map(({ userId }) => `user-${userId}`);

      if (receivers.length > 0) {
        pusherServerClient.trigger(
          receivers,
          input.groupId,
          "viewer",
        );
      }

      return viewer;
    }),

  remove: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(({ input, ctx }) =>
      ctx.prisma.groupViewer.delete({
        where: {
          userId_groupId: {
            groupId: input.groupId,
            userId: ctx.session.user.id,
          },
        },
      })
    ),

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
