import { type inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import { type AppRouter } from "./server/api/root";
import { Message } from "@prisma/client";

export type RouterOutput = inferRouterOutputs<AppRouter>;

export type getActivitiesOutput = RouterOutput["activities"]["getActivities"];
export type addActivityOutput = RouterOutput["activities"]["addActivity"];
export type getActivityOutput = RouterOutput["activities"]["getActivity"];
export type getActivityViewersOutput =
  RouterOutput["activityViewer"]["getActivityViewers"];

export type getUserGroupsOutput = RouterOutput["groups"]["getUserGroups"];
export type addGroupOutput = RouterOutput["groups"]["addGroup"];
export type addDynamicGroupOutput = RouterOutput["groups"]["addDynamicGroup"];
export type getGroupOutput = RouterOutput["groups"]["getGroup"];
export type getGroupViewers = RouterOutput["groupViewer"]["getGroupViewers"];
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
  activitySlug: string;
  groupSlug?: string;
};

export type ChannelOverview = {
  id: string;
  title: string;
  slug: string;
  activitySlug: string;
  groupSlug?: string;
  unreadMessagesCount: string;
  viewersCount: number;
};

export type ChannelsOverview = ChannelOverview[];

export type GroupOverview = {
  title: string;
  slug: string;
  isMember: boolean;
  activitySlug: string;
  viewersCount: number;
};

export type GroupsOverview = GroupOverview[];

export const addActivityInput = z.object({
  title: z.string().trim(),
  description: z.string(),
});

export const addGroupInput = z.object({
  title: z.string().trim(),
  description: z.string(),
  activityId: z.string(),
  // startingAt: z.date()
  // endingAt: z.date().optional()
});

export const addDynamicGroupInput = z.object({
  title: z.string().trim(),
  description: z.string(),
  activityId: z.string(),
  activitySlug: z.string(),
  otherUserId: z.string(),
  // startingAt: z.date()
  // endingAt: z.date().optional()
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
  activitySlug: z.string(),
  groupSlug: z.string().optional(),
});

export type MessageInput = z.infer<typeof sendMessageInput>;

export type PusherMessageAction = "message";

export type PusherMessegeViewAction = "add_viewer" | "remove_viewer";

export type PusherMessegeJoinAction =
  | "invite_request"
  | "invite_accepted"
  | "invite_declined"
  | "quick_search_found";

type BasePusherMessage = {
  // id: string;
  action:
    | PusherMessegeViewAction
    | PusherMessageAction
    | PusherMessegeJoinAction;
  sentBy: string;
  activitySlug: string;
  groupSlug?: string;
};

export type PusherMessage =
  | (BasePusherMessage & { action: PusherMessegeViewAction })
  | (BasePusherMessage & { action: PusherMessageAction; content: string })
  | (BasePusherMessage & {
    action: PusherMessegeJoinAction;
    requestId: string;
  });

export type PusherSendProps = {
  receivers: string[] | string;
  channelId: string;
  body: PusherMessage;
};

export type Toast = {
  displayMessage: string;
  pusherMessage: PusherMessage;
  id: string;
  icon?: string;
};
