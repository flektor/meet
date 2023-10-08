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

export type addGroupOutput = NonNullable<RouterOutput["groups"]["addGroup"]>;

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
export type addDynamicGroupOutput = NonNullable<
  RouterOutput["groups"]["addDynamicGroup"]
>;

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
  locationTitle: z.string(),
  locationPin: z.string().optional(),
  startsAt: z.date(),
  endsAt: z.date().optional(),
  minParticipants: z.number(),
  maxParticipants: z.number().optional(),
  private: z.boolean(),
});

export const addDynamicGroupInput = addGroupInput.extend({
  otherUserId: z.string(),
});

export const acceptJoinRequestInput = z.object({
  activitySlug: z.string(),
  groupId: z.string(),
  userId: z.string(),
});
export type AcceptJoinRequestInput = z.infer<typeof acceptJoinRequestInput>;

export const declineJoinRequestInput = z.object({
  userId: z.string(),
  groupId: z.string(),
});
export type DeclineJoinRequestInput = z.infer<typeof declineJoinRequestInput>;

export const inviteRequestInput = z.object({
  channelId: z.string(),
  groupId: z.string(),
  activitySlug: z.string(),
  userId: z.string(),
});
export type InviteRequestInput = z.infer<typeof inviteRequestInput>;

export const addToMembershipsInput = z.object({
  groupId: z.string(),
  activitySlug: z.string(),
});
export type AddToMembershipsInput = z.infer<typeof addToMembershipsInput>;

export type AddGroupInput = z.infer<typeof addGroupInput>;
export type AddDynamicGroupInput = z.infer<typeof addDynamicGroupInput>;
export type AddActivityInput = z.infer<typeof addActivityInput>;

export type addToFavoritesOutput = RouterOutput["favorites"]["addToFavorites"];
export type removeFromFavoritesOutput =
  RouterOutput["favorites"]["removeFromFavorites"];

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
    | "quick_invite_accepted"
    | "invite_declined"
    | "join_request"
    | "join_accepted";
  groupId: string;
  groupSlug: string;
  activitySlug: string;
  sentBy: string;
};

export type PusherQuickInviteMessage = {
  action: "quick_invite_request";
  activitySlug: string;
  sentBy: string;
};

export type PusherMessage =
  | PusherViewerMessage
  | PusherChatMessage
  | PusherInviteMessage
  | PusherQuickInviteMessage;

export type PusherSendProps = {
  receivers: string | string[];
  channelId: string;
  body: PusherMessage;
};

export type ToastProps = {
  duration?: number;
  displayMessage: string;
  pusherMessage: PusherInviteMessage | PusherQuickInviteMessage;
  id: string;
  icon?: string;
  onDie?: (...args: any) => void;
  onAccept?: (...args: any) => void;
  onDecline?: (...args: any) => void;
};
