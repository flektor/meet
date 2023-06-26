import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { addActivityValidator } from "~/types";

export const activitiesRouter = createTRPCRouter({
  getActivities: publicProcedure
    .query(async ({ ctx }) => {
      const activities = await ctx.prisma.activity.findMany({
        include: {
          Favorites: true,
          // Favorites: { where: { userId: ctx.session?.user.id } },
        },
      });

      return activities.map(({ Favorites, ...rest }) => ({
        ...rest,
        isFavorite: ctx.session?.user.id
          ? Favorites.some(({ userId }) => ctx.session?.user.id === userId)
          : false,
        favoritesCount: Favorites.length,
      }));
    }),

  addActivity: protectedProcedure
    .input(addActivityValidator)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.activity.create({ data: input });
    }),
});
