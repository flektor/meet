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
          include: { Message: true },
        });
    }),

  getRegisteredUsers: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ input, ctx }) => {
      const activity = await ctx.prisma.activity
        .findUnique({
          where: { channelId: input.channelId },
          include: { Registrations: true },
        });

      if (!activity) {
        return;
      }

      return activity.Registrations.map(({ userId }) => userId);
    }),

  getAllMessages: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ input, ctx }) => {
      const channel = await ctx.prisma.channel
        .findUnique({
          where: { id: input.channelId },
          include: { Message: true },
        });
      return channel?.Message;
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

      const message = {
        content: input.content,
        sentBy: ctx.session.user.id,
        sentAt: new Date(),
      };

      if (
        input.receivers !== "" &&
        (input.receivers instanceof Array && input.receivers.length > 0)
      ) {
        pusherSend({
          receivers: input.receivers,
          slug: input.channelId,
          action: "message",
        });
      }

      return await ctx.prisma.message.create({
        data: { ...message, channelId: input.channelId },
      });
    }),
});
