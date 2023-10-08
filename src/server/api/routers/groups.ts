import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { pusherSend } from "~/server/utils";
import { addDynamicGroupInput, addGroupInput } from "~/types";
import { createSlug } from "~/utils";

const selectUserBaseFields = { select: { id: true, name: true, image: true } };
const userBaseFields = { user: selectUserBaseFields };

export const groupsRouter = createTRPCRouter({
  getGroup: publicProcedure
    .input(
      z.object({
        activitySlug: z.string(),
        slug: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const group = await ctx.prisma.group
        .findUnique({
          where: { slug: input.slug },
          include: {
            channel: {
              include: {
                messages: {
                  include: userBaseFields,
                  orderBy: {
                    sentAt: "desc",
                  },
                  take: 30,
                },
              },
            },
            viewers: { select: userBaseFields },
            memberships: { select: userBaseFields },
          },
        });

      if (!group) {
        return;
      }

      const { channel, viewers, memberships, ...rest } = group;
      const viewersIds = viewers.map(({ user }) => user.id);
      const membersIds = memberships.map(({ user }) => user.id);
      const channelUsersIds = channel.messages.map(({ user }) => user.id);

      if (ctx.session && !viewersIds.includes(ctx.session.user.id as string)) {
        const data = { userId: ctx.session.user.id, groupId: group.id };
        await ctx.prisma.groupViewer.upsert({
          create: data,
          update: data,
          where: { userId: ctx.session.user.id },
        });
        await ctx.prisma.activityViewer.deleteMany({
          where: { userId: ctx.session.user.id },
        });
      }

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

      const messages = channel.messages.map(({ user, ...msg }) => ({ ...msg }))
        .reverse();
      return {
        ...rest,
        viewersIds,
        membersIds,
        users: [...userMap.values()] as typeof users,
        activitySlug: input.activitySlug,
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
      const { activityId, ...rest } = input;

      const activity = await ctx.prisma.activity.findUnique({
        where: { id: input.activityId },
      });
      if (!activity) {
        return;
      }

      return {
        activitySlug: activity.slug,
        ...(await ctx.prisma.group.create({
          data: {
            ...rest,
            activity: { connect: { id: input.activityId } },
            user: { connect: { id: ctx.session.user.id } },
            slug: createSlug(input.title),
            channel: { create: { title: input.title } },
            memberships: { create: [{ userId: ctx.session.user.id }] },
          },
        })),
      };
    }),

  addDynamicGroup: protectedProcedure
    .input(addDynamicGroupInput)
    .mutation(async ({ input, ctx }) => {
      const { otherUserId, activityId, ...rest } = input;
      const title = input.title + "-" +
        Math.random().toString(16).substring(2);

      const activity = await ctx.prisma.activity.findUnique({
        where: { id: input.activityId },
      });
      if (!activity) {
        return;
      }

      const group = await ctx.prisma.group.create({
        data: {
          ...rest,
          title,
          activity: { connect: { id: input.activityId } },
          user: { connect: { id: ctx.session.user.id } },
          slug: createSlug(title),
          channel: { create: { title: input.title } },
          memberships: {
            create: [
              { userId: ctx.session.user.id },
              { userId: otherUserId },
            ],
          },
        },
      });

      pusherSend({
        channelId: activity.channelId,
        receivers: otherUserId,
        body: {
          action: "invite_accepted",
          sentBy: ctx.session.user.id,
          groupSlug: group.slug,
          groupId: group.id,
          activitySlug: activity.slug,
        },
      });
      return { ...group, activitySlug: activity.slug };
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
});
