import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { pusherSend } from "~/server/utils";
import { addDynamicGroupInput, addGroupInput, User } from "~/types";
import { createSlug } from "~/utils";

const selectUserBaseFields = { select: { id: true, name: true, image: true } };
const userBaseFields = { user: selectUserBaseFields };

export const groupsRouter = createTRPCRouter({
  getGroup: publicProcedure
    .input(z.object({ activitySlug: z.string(), slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const group = await ctx.prisma.group
        .findUnique({
          where: { slug: input.slug },
          include: {
            channel: {
              include: { messages: { include: userBaseFields, take: 20 } },
            },
            viewers: { select: userBaseFields },
            memberships: { select: userBaseFields },
          },
        });

      if (!group) {
        return;
      }

      const { channel, viewers, memberships, ...activity } = group;
      const viewersIds = viewers.map(({ user }) => user.id);
      const membersIds = memberships.map(({ user }) => user.id);
      const channelUsersIds = channel.messages.map(({ user }) => user.id);

      const userMap = new Map();
      const users = [
        ...viewers.map(({ user }) => user),
        ...memberships.map(({ user }) => user),
        ...channel.messages.map(({ user }) => user),
      ];

      users.forEach((user) => {
        if (!userMap.has(user.id)) {
          userMap.set(user.id, user);
        }
      });

      const messages = channel.messages.map(({ user, ...msg }) => ({ ...msg }));

      return {
        ...activity,
        viewersIds,
        membersIds,
        users: [...userMap.values()] as typeof users,
        activityId: activity.id,
        activitySlug: activity.slug,
        membersCount: membersIds.length,
        viewersCount: viewersIds.length,
        channel: {
          id: channel.id,
          messages,
          title: channel.title,
          description: channel.description,
          createdAt: channel.createdAt,
          usersIds: channelUsersIds,
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

  // getUserGroups: protectedProcedure
  //   .query(async ({ ctx }) => {
  //     const groups = await ctx.prisma.group.findMany({
  //       include: {
  //         memberships: true,
  //         viewers: true,
  //         activity: { select: { slug: true } },
  //       },
  //       where: { memberships: { every: { userId: ctx.session.user.id } } },
  //     });

  //     return groups.map(({ viewers, activity, ...group }) => ({
  //       ...group,
  //       viewersCount: viewers.length,
  //     }));
  //   }),

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
          groupSlug: group.slug,
          activitySlug: group.slug,
        },
      });
      return { ...group, activitySlug: input.activitySlug };
    }),
});
