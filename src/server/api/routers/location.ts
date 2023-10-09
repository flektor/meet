import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusherSend } from "~/server/utils";
import { updateGroupLocationInput } from "~/types";

export const locationRouter = createTRPCRouter({
  updateGroupLocation: protectedProcedure
    .input(updateGroupLocationInput)
    .mutation(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.update({
        data: { locationPin: input.lngLat.toString() },
        select: { channelId: true, memberships: { select: { userId: true } } },
        where: { id: input.groupId },
      });
      if (!group) {
        return;
      }

      const otherMembersIds = group.memberships.map(({ userId }) => userId)
        .filter(
          (id) => id !== ctx.session.user.id,
        );

      pusherSend({
        channelId: group.channelId,
        receivers: otherMembersIds,
        body: {
          action: "location_update",
          sentBy: ctx.session.user.id,
          lngLat: input.lngLat,
          groupId: input.groupId,
        },
      });
      return true;
    }),
});
