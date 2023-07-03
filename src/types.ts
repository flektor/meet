import { type inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import { type AppRouter } from "./server/api/root";
import { Message } from "@prisma/client";

export type RouterOutput = inferRouterOutputs<AppRouter>;

export type getActivitiesOutput = RouterOutput["activities"]["getActivities"];
export type addActivityOutput = RouterOutput["activities"]["addActivity"];
export type getActivityOutput = RouterOutput["activities"]["getActivity"];
// this does not work
// export type Channel = Pick<getActivityOutput, "channel">;

export type Channel = {
  users: {
    image: string | null;
    name: string | null;
    userId: string;
    slug: string;
  }[];
  messages: Message[];
  id: string;
  title: string | null;
  description: string | null;
  createdAt: Date;
};

export const addActivityInput = z.object({
  title: z.string().trim(),
  description: z.string(),
});

export type AddActivityValidator = z.infer<typeof addActivityInput>;

export type addToFavoritesOutput = RouterOutput["favorites"]["addToFavorites"];
export type removeFromFavoritesOutput =
  RouterOutput["favorites"]["removeFromFavorites"];

export type addToActivityViewerOutput = RouterOutput["activityViewer"]["add"];
export type removeFromActivityViewerOutput =
  RouterOutput["activityViewer"]["remove"];
export type getAllActivityViewersOutput =
  RouterOutput["activityViewer"]["getActivityViewers"];

export type addToRegistrationsOutput = RouterOutput["registrations"]["add"];
export type removeFromRegistratiosOutput =
  RouterOutput["registrations"]["remove"];

export type createChannelOutput = RouterOutput["chat"]["createChannel"];
// export type getChannelOutput = RouterOutput["chat"]["getChannel"];
export type sendMessageOutput = RouterOutput["chat"]["sendMessage"];

export const createChannelInput = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  userIds: z.array(z.string()).optional(),
});

export const receiversInput = z.union([
  z.string().nonempty(),
  z.array(z.string().nonempty()),
]);

export const sendMessageInput = z.object({
  content: z.string(),
  channelId: z.string(),
  receivers: receiversInput,
});
