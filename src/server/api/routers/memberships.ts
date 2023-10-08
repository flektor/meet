import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusherSend } from "~/server/utils";
import {
  acceptJoinRequestInput,
  addToMembershipsInput,
  declineJoinRequestInput,
  inviteRequestInput,
} from "~/types";

export const membershipsRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId_groupId = {
        userId: ctx.session.user.id,
        groupId: input.groupId,
      };

      const group = await ctx.prisma.group.findUnique({
        where: { id: input.groupId },
      });

      if (!group) {
        return;
      }

      if (group.private) {
        const invite = await ctx.prisma.pendingInvite.findUnique({
          where: { userId_groupId },
        });

        if (!invite) {
          return;
        }
      }

      await ctx.prisma.pendingInvite.delete({ where: { userId_groupId } });

      return await ctx.prisma.membership.create({ data: userId_groupId });
    }),

  remove: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.membership.delete({
        where: {
          userId_groupId: {
            groupId: input.groupId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.membership.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
    }),

  acceptJoinRequest: protectedProcedure
    .input(acceptJoinRequestInput)
    .mutation(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.findUnique({
        where: { id: input.groupId },
      });

      if (!group) {
        return;
      }

      const userId_groupId = {
        userId: input.userId,
        groupId: input.groupId,
      };

      await ctx.prisma.pendingInvite.delete({ where: { userId_groupId } });

      const membership = await ctx.prisma.membership.create({
        data: userId_groupId,
      });

      pusherSend({
        channelId: group.channelId,
        receivers: input.userId,
        body: {
          action: "join_accepted",
          sentBy: ctx.session.user.id,
          activitySlug: input.activitySlug,
          groupSlug: group.slug,
          groupId: group.id,
        },
      });

      return membership;
    }),

  declineJoinRequest: protectedProcedure
    .input(declineJoinRequestInput)
    .mutation(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
          createdBy: input.userId,
        },
      });

      if (!group) {
        return;
      }

      return await ctx.prisma.pendingInvite.delete({
        where: {
          userId_groupId: {
            userId: input.userId,
            groupId: input.groupId,
          },
        },
      });
    }),

  joinRequest: protectedProcedure
    .input(addToMembershipsInput)
    .mutation(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
        },
      });

      if (!group) {
        return;
      }

      const invite = await ctx.prisma.pendingInvite.create({
        data: {
          userId: ctx.session.user.id,
          groupId: input.groupId,
        },
      });

      pusherSend({
        channelId: group.channelId,
        receivers: group.createdBy,
        body: {
          action: "join_request",
          sentBy: ctx.session.user.id,
          groupSlug: group.slug,
          activitySlug: input.activitySlug,
          groupId: group.id,
        },
      });

      return invite;
    }),

  inviteRequest: protectedProcedure
    .input(inviteRequestInput)
    .mutation(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
          createdBy: ctx.session.user.id,
        },
      });

      if (!group) {
        return;
      }

      const invite = await ctx.prisma.pendingInvite.create({
        data: {
          userId: input.userId,
          groupId: input.groupId,
        },
      });

      pusherSend({
        channelId: input.channelId,
        receivers: input.userId,
        body: {
          action: "invite_request",
          sentBy: ctx.session.user.id,
          groupSlug: group.slug,
          activitySlug: input.activitySlug,
          groupId: group.id,
        },
      });

      return invite;
    }),
});
