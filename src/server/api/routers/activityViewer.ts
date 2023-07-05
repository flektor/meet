import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusherSend } from "~/server/utils";

export const activityViewerRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const data = {
        userId: ctx.session.user.id,
        activityId: input.activityId,
      };

      const others = await ctx.prisma.activityViewer
        .findMany({
          where: { activityId: input.activityId },
        });

      const viewer = await ctx.prisma.activityViewer.create({ data });

      const receivers = others.map(({ userId }) => `user-${userId}`);

      if (receivers.length > 0) {
        pusherSend({
          receivers,
          slug: input.activityId,
          body: { action: "viewer", sentBy: ctx.session.user.id },
        });
      }

      console.log("www");

      return viewer;
    }),

  remove: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(({ input, ctx }) =>
      ctx.prisma.activityViewer.delete({
        where: {
          userId_activityId: {
            activityId: input.activityId,
            userId: ctx.session.user.id,
          },
        },
      })
    ),

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
