import { connect } from "http2";
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
    .input(
      z.object({
        activityId: z.string(),
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
              include: { messages: { include: userBaseFields, take: 20 } },
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

      const messages = channel.messages.map(({ user, ...msg }) => ({ ...msg }));
      return {
        ...rest,
        viewersIds,
        membersIds,
        users: [...userMap.values()] as typeof users,
        activityId: input.activityId,
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
      const channel = await ctx.prisma.channel.create({
        data: {
          title: input.title,
        },
      });

      console.log(addGroupInput);
      return await ctx.prisma.group.create({
        data: {
          ...input,
          createdBy: ctx.session.user.id,
          slug: createSlug(input.title),
          // channelId: channel.id,
          channel: {
            create: {
              title: input.title,
            },
          },
        } as any,
      });

      // await ctx.prisma.membership.create({
      //   data: {
      //     groupId: group.id,
      //     userId: ctx.session.user.id,
      //   },
      // });
      // return group;
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
      const { otherUserId, ...rest } = input;
      const title = input.title + "-" +
        Math.random().toString(16).substring(2);

      const group = await ctx.prisma.group.create({
        data: {
          ...rest,
          title,
          createdBy: ctx.session.user.id,
          slug: createSlug(title),
          channel: {
            create: {
              title: input.title,
            },
          },
          memberships: {
            create: [
              { userId: ctx.session.user.id },
              { userId: otherUserId },
            ],
          },
        } as any,
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
