import { type inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import { type AppRouter } from "./server/api/root";

export type RouterOutput = inferRouterOutputs<AppRouter>;

export type getActivitiesOutput = NonNullable<
  RouterOutput["activities"]["getActivities"]
>;
export type addActivityOutput = NonNullable<
  RouterOutput["activities"]["addActivity"]
>;
export type getActivityOutput = NonNullable<
  RouterOutput["activities"]["getActivity"]
>;
type getActivityViewersOutput = NonNullable<
  RouterOutput["activityViewer"]["getActivityViewers"]
>;

// export type getUserGroupsOutput = NonNullable<
//   RouterOutput["groups"]["getUserGroups"]
// >;
export type addGroupOutput = NonNullable<RouterOutput["groups"]["addGroup"]>;
export type addDynamicGroupOutput = NonNullable<
  RouterOutput["groups"]["addDynamicGroup"]
>;

type getGroupViewersOutput = NonNullable<
  RouterOutput["groupViewer"]["getGroupViewers"]
>;

export type Viewers = getActivityViewersOutput | getGroupViewersOutput;

type BaseChannel =
  (Pick<getActivityOutput | getGroupOutput, "channel">)["channel"];

export type ChannelMessage = Omit<
  Pick<BaseChannel, "messages">["messages"][number],
  "channelId"
>;

export type User = Pick<
  getGroupOutput | getActivityOutput,
  "users"
>["users"][number];

export type Channel =
  & Omit<BaseChannel, "messages">
  & { messages: ChannelMessage[] };

export type ActivityOutput =
  & Omit<getActivityOutput, "channel">
  & { channel: Channel };

export type Activity = Omit<
  NonNullable<ActivityOutput>,
  "channel" | "groups" | "users"
>;

export type getGroupOutput = NonNullable<RouterOutput["groups"]["getGroup"]>;

export type GroupOutput =
  & Omit<getGroupOutput, "channel" | "users">
  & { channel: Channel; users: User[] };

export type Group = Omit<GroupOutput, "channel" | "users">;

export const addActivityInput = z.object({
  title: z.string().trim(),
  description: z.string(),
});

export const addGroupInput = z.object({
  title: z.string().trim(),
  description: z.string(),
  activityId: z.string(),
});

export const addDynamicGroupInput = z.object({
  title: z.string().trim(),
  description: z.string(),
  activityId: z.string(),
  activitySlug: z.string(),
  otherUserId: z.string(),
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

// export type createChannelOutput = RouterOutput["chat"]["createChannel"];
// export type getChannelOutput = RouterOutput["chat"]["getChannel"];
// export type sendMessageOutput = RouterOutput["chat"]["sendMessage"];

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
  // receivers: receiversInput,
});

export type MessageInput = z.infer<typeof sendMessageInput>;

type PusherChatMessage = {
  action: "message";
} & ChannelMessage;

type PusherViewerMessage = {
  action: "add_viewer" | "remove_viewer";
  sentBy: string;
};

export type PusherInviteMessage = {
  action:
    | "invite_request"
    | "invite_accepted"
    | "invite_declined";
  groupSlug: string;
  activitySlug: string;
  sentBy: string;
};

export type PusherQuickSearchMessage = {
  action: "quick_search_found";
  activitySlug: string;
  sentBy: string;
};

export type PusherMessage =
  | PusherViewerMessage
  | PusherChatMessage
  | PusherInviteMessage
  | PusherQuickSearchMessage;

export type PusherSendProps = {
  receivers: string | string[];
  channelId: string;
  body: PusherMessage;
};

export type Toast = {
  displayMessage: string;
  pusherMessage: PusherInviteMessage | PusherQuickSearchMessage;
  id: string;
  icon?: string;
};
