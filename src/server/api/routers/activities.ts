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
          favorites: true,
          registrations: true,
          viewers: {
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
        },
      });

      return activities.map((
        { favorites, registrations, viewers, ...activity },
      ) => {
        const activityViewers = viewers.map(({ user }) => ({
          userId: user.id,
          image: user.image,
          name: user.name,
        }));

        return ({
          ...activity,
          viewersCount: activityViewers.length,
          registrationsCount: registrations.length,
          favoritesCount: favorites.length,
          isFavorite: ctx.session?.user.id
            ? favorites.some(({ userId }) => ctx.session?.user.id === userId)
            : false,

          isRegistered: ctx.session?.user.id
            ? registrations.some(({ userId }) =>
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
            favorites: true,
            registrations: true,
            viewers: {
              include: {
                user: { select: { id: true, name: true, image: true } },
              },
            },
            groups: {
              include: {
                _count: { select: { viewers: true, memberships: true } },
                memberships: {
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
            channel: { include: { messages: true } },
          },
        });

      if (!activity) {
        return;
      }

      const activityViewers = activity.viewers.map(({ user }) => ({
        userId: user.id,
        image: user.image,
        name: user.name,
      }));

      const {
        favorites,
        registrations,
        channel,
        groups,
        viewers,
        ...rest
      } = activity;

      return {
        ...rest,
        viewersCount: activityViewers.length,
        registrationsCount: registrations.length,
        favoritesCount: favorites.length,
        isFavorite: ctx.session?.user.id
          ? favorites.some(({ userId }) => ctx.session?.user.id === userId)
          : false,

        isRegistered: ctx.session?.user.id
          ? registrations.some(({ userId }) => ctx.session?.user.id === userId)
          : false,

        groups: groups.map((group) => ({
          id: group.id,
          activityId: activity.id,
          title: group.title,
          slug: group.slug,
          activitySlug: activity.slug,
          channelId: group.channelId,
          viewersCount: group._count.viewers,
          isMember: group.memberships.length === 1,
          membersCount: group.memberships.length,
          favoritesCount: 0, // not implemented yet
          isFavorite: false, // not implemented yet
        })),

        channel: {
          id: activity.channelId,
          users: activityViewers,
          messages: channel.messages,
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
          createdBy: ctx.session.user.id,
          slug: createSlug(input.title),
          channelId: channel.id,
        },
      });
    }),
});
