import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { pusherSend } from "~/server/utils";
import { addDynamicGroupInput, addGroupInput } from "~/types";
import { createSlug } from "~/utils";

export const groupsRouter = createTRPCRouter({
  getGroup: publicProcedure
    .input(z.object({ activitySlug: z.string(), slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const group = await ctx.prisma.group
        .findUnique({
          where: { slug: input.slug },
          include: {
            _count: { select: { viewers: true, memberships: true } },
            channel: { include: { messages: true } },
            // Favorites: true,
            viewers: {
              include: {
                user: { select: { id: true, name: true, image: true } },
              },
            },
            memberships: {
              select: { user: { select: { id: true } } },
              where: {
                userId: ctx.session?.user.id,
                group: {
                  activity: { slug: input.activitySlug },
                  slug: input.slug,
                },
              },
            },
          },
        });

      if (!group) {
        return;
      }

      const views = await ctx.prisma.groupViewer
        .findMany({
          where: { groupId: group.id },
          include: { user: true },
        });

      const groupViewers = views.map(({ user }) => ({
        userId: user.id,
        image: user.image,
        name: user.name,
      }));

      const { channel, viewers, memberships, _count, ...activity } = group;

      return {
        ...activity,
        activityId: activity.id,
        activitySlug: activity.slug,
        viewersCount: group._count.viewers,
        isMember: group.memberships.length === 1,
        membersCount: group._count.memberships,
        favoritesCount: 0, // not impemented yey
        isFavorite: false,
        // isFavorite: ctx.session?.user.id
        //   ? Favorites.some(({ userId }) => ctx.session?.user.id === userId)
        //   : false,

        channel: {
          id: channel.id,
          messages: channel.messages,
          title: channel.title,
          description: channel.description,
          createdAt: channel.createdAt,
          users: groupViewers,
        },
      };
    }),

  addGroup: protectedProcedure
    .input(addGroupInput)
    .mutation(async ({ input, ctx }) => {
      const channel = await ctx.prisma.channel.create({
        data: { title: input.title },
      });

      const group = await ctx.prisma.group.create({
        data: {
          ...input,
          createdBy: ctx.session.user.id,
          slug: createSlug(input.title),
          channelId: channel.id,
        },
      });

      await ctx.prisma.membership.create({
        data: {
          groupId: group.id,
          userId: ctx.session.user.id,
        },
      });
      return group;
    }),

  getUserGroups: protectedProcedure
    .query(async ({ ctx }) => {
      const groups = await ctx.prisma.group.findMany({
        include: {
          memberships: true,
          viewers: true,
          activity: { select: { slug: true } },
        },
        where: { memberships: { every: { userId: ctx.session.user.id } } },
      });

      return groups.map(({ viewers, activity, ...group }) => ({
        ...group,
        viewersCount: viewers.length,
      }));
    }),

  addDynamicGroup: protectedProcedure
    .input(addDynamicGroupInput)
    .mutation(async ({ input, ctx }) => {
      const channel = await ctx.prisma.channel.create({
        data: {
          title: input.title,
        },
      });
      const { otherUserId, ...rest } = input;
      const title = input.title + "-" +
        Math.random().toString(16).substring(2);

      const group = await ctx.prisma.group.create({
        data: {
          ...rest,
          title,
          createdBy: ctx.session.user.id,
          slug: createSlug(title),
          channelId: channel.id,
          memberships: {
            create: [
              { userId: ctx.session.user.id },
              { userId: otherUserId },
            ],
          },
        },
      });

      pusherSend({
        channelId: group.channelId,
        receivers: otherUserId,
        body: {
          action: "invite_accepted",
          sentBy: ctx.session.user.id,
          groupId: group.id,
          activityId: group.activityId,
        },
      });
      return { ...group };
    }),
});
