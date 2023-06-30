import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { addActivityInput } from "~/types";
import { createSlug } from "~/utils";

export const activitiesRouter = createTRPCRouter({
  getActivities: publicProcedure
    .query(async ({ ctx }) => {
      const activities = await ctx.prisma.activity.findMany({
        include: {
          Favorites: true,
          Registrations: true,
        },
      });

      return activities.map(({ Favorites, Registrations, ...rest }) => ({
        ...rest,
        isFavorite: ctx.session?.user.id
          ? Favorites.some(({ userId }) => ctx.session?.user.id === userId)
          : false,
        favoritesCount: Favorites.length,
        isRegistered: ctx.session?.user.id
          ? Registrations.some(({ userId }) => ctx.session?.user.id === userId)
          : false,
        registrationsCount: Registrations.length,
      }));
    }),

  getActivity: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const activity = await ctx.prisma.activity
        .findUnique({
          where: { slug: input.slug },
          include: {
            Favorites: true,
            Registrations: true,
          },
        });

      if (!activity) {
        return;
      }

      const { Favorites, Registrations, ...rest } = activity;

      return {
        ...rest,
        isFavorite: ctx.session?.user.id
          ? Favorites.some(({ userId }) => ctx.session?.user.id === userId)
          : false,
        favoritesCount: Favorites.length,
        isRegistered: ctx.session?.user.id
          ? Registrations.some(({ userId }) => ctx.session?.user.id === userId)
          : false,
        registrationsCount: Registrations.length,
      };
    }),

  addActivity: protectedProcedure
    .input(addActivityInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.activity.create({
        data: { ...input, slug: createSlug(input.title) },
      });
    }),
});
