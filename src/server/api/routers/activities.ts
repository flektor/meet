import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { addActivityInput, User } from "~/types";
import { createSlug } from "~/utils";

const selectUserBaseFields = { select: { id: true, name: true, image: true } };
const userBaseFields = { user: selectUserBaseFields };

export const activitiesRouter = createTRPCRouter({
  getActivities: publicProcedure
    .query(async ({ ctx }) => {
      const activities = await ctx.prisma.activity.findMany({
        include: {
          favorites: true,
          registrations: true,
          _count: { select: { viewers: true } },
        },
      });

      return activities.map((
        { favorites, registrations, _count, ...activity },
      ) => ({
        ...activity,
        viewersIds: [],
        viewersCount: _count.viewers,
        registrationsCount: registrations.length,
        favoritesCount: favorites.length,
        isFavorite: ctx.session?.user.id
          ? favorites.some(({ userId }) => ctx.session?.user.id === userId)
          : false,

        isRegistered: ctx.session?.user.id
          ? registrations.some(({ userId }) => ctx.session?.user.id === userId)
          : false,
      }));
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
              include: userBaseFields,
            },
            groups: {
              include: {
                _count: { select: { viewers: true, memberships: true } },
                memberships: {
                  select: userBaseFields,
                  where: {
                    userId: ctx.session?.user.id,
                    group: { activity: { slug: input.slug } },
                  },
                },
              },
            },
            channel: {
              include: {
                messages: {
                  include: userBaseFields,
                  take: 20,
                },
              },
            },
          },
        });

      if (!activity) {
        return;
      }

      const {
        favorites,
        registrations,
        channel,
        groups,
        viewers,
        ...rest
      } = activity;

      const viewersIds = viewers.map(({ user }) => user.id);

      if (ctx.session && !viewersIds.includes(ctx.session.user.id as string)) {
        const data = { userId: ctx.session.user.id, activityId: activity.id };
        await ctx.prisma.activityViewer.upsert({
          create: data,
          update: data,
          where: { userId: ctx.session.user.id },
        });
        await ctx.prisma.groupViewer.deleteMany({
          where: { userId: ctx.session.user.id },
        });
      }

      const channelUsersIds = channel.messages.map(({ user }) => user.id);

      const users = [
        ...viewers.map(({ user }) => user),
        ...channel.messages.map(({ user }) => user),
      ];
      const userMap = new Map<string, typeof users[number]>();

      users.forEach((user) => {
        if (!userMap.has(user.id)) {
          userMap.set(user.id, user);
        }
      });

      const messages = channel.messages.map(({ user, ...msg }) => ({ ...msg }));

      return {
        ...rest,
        users: [...userMap.values()] as typeof users,
        viewersIds,
        viewersCount: activity.viewers.length,
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
          isMember: false,
          membersCount: group._count.memberships,
        })),

        channel: {
          id: activity.channelId,
          usersIds: channelUsersIds,
          messages: messages,
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
