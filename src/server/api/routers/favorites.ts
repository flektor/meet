import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const favoritesRouter = createTRPCRouter({
  addToFavorites: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(({ input, ctx }) => {
      const data = {
        userId: ctx.session.user.id,
        activityId: input.activityId,
      };
      return ctx.prisma.favorites.create({ data });
    }),

  removeFromFavorites: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.favorites.delete({
        where: {
          userId_activityId: {
            activityId: input.activityId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
});
