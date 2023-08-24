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
          ActivityViewer: {
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
        },
      });

      return activities.map((
        { Favorites, Registrations, ActivityViewer, ...activity },
      ) => {
        const activityViewers = ActivityViewer.map(({ user }) => ({
          userId: user.id,
          image: user.image,
          name: user.name,
        }));

        return ({
          ...activity,
          viewersCount: activityViewers.length,
          registrationsCount: Registrations.length,
          favoritesCount: Favorites.length,
          isFavorite: ctx.session?.user.id
            ? Favorites.some(({ userId }) => ctx.session?.user.id === userId)
            : false,

          isRegistered: ctx.session?.user.id
            ? Registrations.some(({ userId }) =>
              ctx.session?.user.id === userId
            )
            : false,
        });
      });
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
            ActivityViewer: {
              include: {
                user: { select: { id: true, name: true, image: true } },
              },
            },
            groups: {
              include: {
                _count: { select: { GroupViewer: true, Membership: true } },
                Membership: {
                  select: { user: { select: { id: true } } },
                  where: {
                    userId: ctx.session?.user.id,
                    group: {
                      activity: { slug: input.slug },
                    },
                  },
                },
              },
            },
            channel: { include: { Message: true } },
          },
        });

      if (!activity) {
        return;
      }

      const activityViewers = activity.ActivityViewer.map(({ user }) => ({
        userId: user.id,
        image: user.image,
        name: user.name,
      }));

      const {
        Favorites,
        Registrations,
        channel,
        groups,
        ActivityViewer,
        ...rest
      } = activity;

      return {
        ...rest,
        viewersCount: activityViewers.length,
        registrationsCount: Registrations.length,
        favoritesCount: Favorites.length,
        isFavorite: ctx.session?.user.id
          ? Favorites.some(({ userId }) => ctx.session?.user.id === userId)
          : false,

        isRegistered: ctx.session?.user.id
          ? Registrations.some(({ userId }) => ctx.session?.user.id === userId)
          : false,

        groups: groups.map((group) => ({
          id: group.id,
          activityId: activity.id,
          title: group.title,
          slug: group.slug,
          activitySlug: activity.slug,
          channelId: group.channelId,
          viewersCount: group._count.GroupViewer,
          isMember: group.Membership.length === 1,
          membersCount: group.Membership.length,
          favoritesCount: 0, // not implemented yet
          isFavorite: false, // not implemented yet
        })),

        channel: {
          id: activity.channelId,
          users: activityViewers,
          messages: channel.Message,
          title: channel.title,
          description: channel.description,
          createdAt: channel.createdAt,
        },
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
