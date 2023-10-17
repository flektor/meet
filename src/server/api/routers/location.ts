import { LngLat } from "~/components/Map";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusherSend } from "~/server/utils";
import { lngLatInput, updateGroupLocationInput } from "~/types";

export async function getLocationName(
  lngLat: LngLat,
): Promise<string> {
  try {
    const endpoint =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.toString()}.json?types=address&access_token=${env.NEXT_PUBLIC_MAPBOX_KEY}`;
    const response = await fetch(endpoint);
    const results = await response.json();
    const location = results.features[0].place_name;
    if (!location) {
      throw null;
    }
    return location as string;
  } catch (error) {
    console.log("Error on fetching location data");
    throw "location_name_not_found";
  }
}

export const locationRouter = createTRPCRouter({
  updateGroupLocation: protectedProcedure
    .input(updateGroupLocationInput)
    .mutation(async ({ input, ctx }) => {
      const locationName = await getLocationName(input.lngLat);

      const group = await ctx.prisma.group.update({
        data: {
          locationPin: input.lngLat.toString(),
          locationTitle: locationName,
        },
        select: { channelId: true, memberships: { select: { userId: true } } },
        where: { id: input.groupId },
      });

      if (!group) {
        throw "group_not_found";
      }

      const otherMembersIds = group.memberships.map(({ userId }) => userId)
        .filter((id) => id !== ctx.session.user.id);

      if (otherMembersIds.length === 0) {
        return { locationName };
      }

      pusherSend({
        channelId: group.channelId,
        receivers: otherMembersIds,
        body: {
          action: "location_update",
          sentBy: ctx.session.user.id,
          lngLat: input.lngLat,
          groupId: input.groupId,
          locationName,
        },
      });

      return { locationName };
    }),

  getLocationName: protectedProcedure
    .input(lngLatInput)
    .mutation(async ({ input }) => {
      return getLocationName(input);
    }),
});
