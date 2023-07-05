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
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const group = await ctx.prisma.group
        .findUnique({
          where: { slug: input.slug },
          include: {
            channel: {
              include: {
                Message: true,
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

      const channelUsers = views.map(({ user }) => ({
        userId: user.id,
        image: user.image,
        name: user.name,
        slug: `user-${user.id}`,
      }));

      const { channel, ...rest } = group;

      return {
        ...rest,
        channel: {
          users: channelUsers,
          messages: channel.Message,
          id: channel.id,
          title: channel.title,
          description: channel.description,
          createdAt: channel.createdAt,
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
      return ctx.prisma.group.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          slug: createSlug(input.title),
          channelId: channel.id,
          // activityId: input.activityId,
        },
      });
    }),

  getUserGroups: protectedProcedure
    .query(async ({ ctx }) => {
      const groups = await ctx.prisma.group.findMany({
        where: { userId: ctx.session.user.id },
        include: { GroupViewer: true },
      });

      return groups.map(({ GroupViewer, ...rest }) => ({
        ...rest,
        viewersCount: GroupViewer.length,
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
      // console.log({ input });
      const { otherUserId, activitySlug, ...rest } = input;
      const title = input.title + "-" +
        Math.random().toString(16).substring(2);

      const group = await ctx.prisma.group.create({
        data: {
          ...rest,
          title,
          userId: ctx.session.user.id,
          slug: createSlug(title),
          channelId: channel.id,
          Membership: {
            create: [
              { userId: ctx.session.user.id },
              { userId: otherUserId },
            ],
          },
        },
      });

      pusherSend({
        receivers: `user-${input.otherUserId}`,
        slug: `accepted-${input.activityId}`,
        body: {
          action: "accepted",
          sentBy: ctx.session.user.id,
          data: {
            pageSlug: `/activities/${input.activitySlug}/${group.slug}`,
            title: input.title,
          },
        },
      });

      console.log(group);
      return group;
    }),
});

// await ctx.prisma.membership.createMany({
//   data: [{ userId: ctx.session.user.id, groupId: group.id }, {
//     userId: otherUserId,
//     groupId: group.id,
//   }],
// });
