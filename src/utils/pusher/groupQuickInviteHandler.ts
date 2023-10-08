import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Store } from "../store";
import getToastId from "./getToastId";
import {
  AddDynamicGroupInput,
  addDynamicGroupInput,
  addDynamicGroupOutput,
  getGroupOutput,
  PusherMessage,
  PusherQuickInviteMessage,
  ToastProps,
} from "../../types";

export function groupQuickInviteHandler(
  sender: string,
  message: PusherMessage,
  store: Store,
  mutate: (data: AddDynamicGroupInput) => void,
) {
  if (message.action !== "quick_invite_request") {
    return;
  }

  const toastProps: ToastProps = {
    id: `${message.activitySlug}:${message.sentBy}`,
    displayMessage: `Join ${sender} for ${message.activitySlug}`,
    pusherMessage: message,
    duration: 15000,
    onAccept: () => onAccept(message, store, mutate),
    onDecline: () => onDecline(message, store),
    // onDie: () => redirect(),
  };

  store.addToast(toastProps);
}

function onAccept(
  message: PusherMessage,
  store: Store,
  mutate: (data: AddDynamicGroupInput) => void,
) {
  if (message.action !== "quick_invite_accepted") {
    return;
  }

  const activity = store.activities.find((activity) =>
    activity.slug === message.activitySlug
  );

  if (!activity) {
    return;
  }

  const groupData: AddDynamicGroupInput = {
    description: activity.description,
    title: activity.title,
    activityId: activity.id,
    locationTitle: "Berlin",
    minParticipants: 2,
    maxParticipants: 2,
    private: true,
    otherUserId: message.sentBy,
    startsAt: new Date(),
  };

  try {
    const data = addDynamicGroupInput.parse(groupData);
    mutate(data);
  } catch (error) {}

  store.removeToast(getToastId(message));
}

function onDecline(
  message: PusherQuickInviteMessage,
  store: Store,
) {
  // TODO send back to the server so it can reach for an other user instead
  store.removeToast(getToastId(message));
}

export function onAddGroupError(error: any) {
  console.log({ error });
}

export function onAddGroupSuccess(
  group: getGroupOutput | addDynamicGroupOutput | undefined,
  router: AppRouterInstance,
) {
  if (!group) {
    return console.error("ActivityNotFound");
  }

  if (!group.slug) return;
  router.push(`/activities/${group.activitySlug}/${group.slug}`);
}

export default {
  groupQuickInviteHandler,
  onAddGroupError,
  onAddGroupSuccess,
};
