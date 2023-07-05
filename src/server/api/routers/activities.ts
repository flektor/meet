import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime";
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

      return activities.map((
        { Favorites, Registrations, ...rest },
      ) => ({
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
            groups: { include: { _count: { select: { GroupViewer: true } } } },
            channel: { include: { Message: true } },
          },
        });

      if (!activity) {
        return;
      }

      const views = await ctx.prisma.activityViewer
        .findMany({
          where: { activityId: activity.id },
          include: { user: true },
        });

      const channelUsers = views.map(({ user }) => ({
        userId: user.id,
        image: user.image,
        name: user.name,
        slug: `user-${user.id}`,
      }));

      const { Favorites, Registrations, channel, groups, ...rest } = activity;

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

        channel: {
          users: channelUsers,
          messages: channel.Message,
          id: channel.id,
          title: channel.title,
          description: channel.description,
          createdAt: channel.createdAt,
        },
        groups: groups.map(({ _count, ...rest }) => ({
          ...rest,
          viewersCount: _count.GroupViewer,
        })),
      };
    }),

  addActivity: protectedProcedure
    .input(addActivityInput)
    .mutation(async ({ input, ctx }) => {
      const channel = await ctx.prisma.channel.create({
        data: {
          title: input.title,
        },
      });
      return ctx.prisma.activity.create({
        data: {
          ...input,
          slug: createSlug(input.title),
          channelId: channel.id,
        },
      });
    }),
});
