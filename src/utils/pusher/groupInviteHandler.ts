import { Store } from "../store";
import getToastId from "./getToastId";
import {
  AddToMembershipsInput,
  addToMembershipsInput,
  PusherInviteMessage,
  PusherMessage,
  ToastProps,
} from "../../types";

export function groupInviteHandler(
  sender: string,
  message: PusherMessage,
  store: Store,
  mutate: (data: AddToMembershipsInput) => void,
) {
  if (message.action !== "invite_accepted") {
    return;
  }

  const activity = store.activities.find((activity) =>
    activity.slug === message.activitySlug
  );

  if (!activity) {
    return;
  }

  const toastProps: ToastProps = {
    id: `${message.activitySlug}:${message.sentBy}`,
    displayMessage: `${sender} invites you to join ${message.groupSlug}`,
    pusherMessage: message,
    duration: 15000,
    onAccept: () => onAccept(message, store, mutate),
    onDecline: () => onDecline(message, store),
  };

  store.addToast(toastProps);
  store.removeToast(getToastId(message));
}

function onAccept(
  message: PusherMessage,
  store: Store,
  mutate: (data: AddToMembershipsInput) => void,
) {
  if (message.action !== "invite_request") {
    return;
  }

  const activity = store.activities.find((activity) =>
    activity.slug === message.activitySlug
  );

  if (!activity) {
    return;
  }

  try {
    const input: AddToMembershipsInput = {
      groupId: message.groupSlug,
      activitySlug: activity.slug,
    };
    const data = addToMembershipsInput.parse(input);
    mutate(data);
  } catch (error) {}

  store.removeToast(getToastId(message));
}

function onDecline(
  message: PusherInviteMessage,
  store: Store,
) {
  store.removeToast(getToastId(message));
}
