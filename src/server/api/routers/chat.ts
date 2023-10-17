import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createChannelInput, sendMessageInput } from "~/types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { pusherSend } from "~/server/utils";

export const chatRouter = createTRPCRouter({
  createChannel: protectedProcedure
    .input(createChannelInput)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.channel.create({ data: input });
    }),

  getChannel: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.channel
        .findUnique({
          where: { id: input.channelId },
          include: { messages: true },
        });
    }),

  getRegisteredUsers: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ input, ctx }) => {
      const activity = await ctx.prisma.activity
        .findUnique({
          where: { channelId: input.channelId },
          include: { registrations: true },
        });

      if (!activity) {
        return;
      }

      return activity.registrations.map(({ userId }) => userId);
    }),

  getAllMessages: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ input, ctx }) => {
      const channel = await ctx.prisma.channel
        .findUnique({
          where: { id: input.channelId },
          include: { messages: true },
        });
      return channel?.messages;
    }),

  sendMessage: protectedProcedure
    .input(sendMessageInput)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.name) {
        throw new TRPCError({
          message: "NOT SIGNED IN",
          code: "UNAUTHORIZED",
        });
      }
      const message = await ctx.prisma.message.create({
        data: {
          content: input.content,
          sentBy: ctx.session.user.id,
          sentAt: new Date(),
          channelId: input.channelId,
        },
      });

      const channel = await ctx.prisma.channel
        .findUnique({
          select: {
            group: { select: { viewers: { select: { userId: true } } } },
            activity: {
              select: { viewers: { select: { userId: true } } },
            },
          },
          where: { id: input.channelId },
        });

      if (!channel) {
        return message;
      }

      const receivers =
        (channel.group?.viewers || channel.activity?.viewers || [])
          .map(({ userId }) => userId).filter((id) =>
            id !== ctx.session.user.id
          );

      if (receivers.length === 0) {
        return message;
      }

      pusherSend({
        receivers,
        channelId: input.channelId,
        body: {
          action: "message",
          ...message,
        },
      });
      return message;
    }),
});
