import { Store } from "../store";
import getToastId from "./getToastId";
import {
  AcceptJoinRequestInput,
  acceptJoinRequestInput,
  DeclineJoinRequestInput,
  declineJoinRequestInput,
  PusherInviteMessage,
  PusherMessage,
  PusherQuickInviteMessage,
  ToastProps,
} from "../../types";

export function groupJoinRequestHandler(
  sender: string,
  message: PusherMessage,
  store: Store,
  onAccept: (data: AcceptJoinRequestInput) => void,
  onDecline: (data: DeclineJoinRequestInput) => void,
) {
  if (message.action !== "join_request") {
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
    displayMessage: `${sender} wants to join ${message.groupSlug}`,
    pusherMessage: message,
    duration: 15000,
    onAccept: () => _onAccept(message, store, onAccept),
    onDecline: () => _onDecline(message, store, onDecline),
  };

  store.addToast(toastProps);
}

function _onAccept(
  message: PusherMessage,
  store: Store,
  mutate: (data: AcceptJoinRequestInput) => void,
) {
  if (message.action !== "join_request") {
    return;
  }

  const activity = store.activities.find((activity) =>
    activity.slug === message.activitySlug
  );

  if (!activity) {
    return;
  }

  try {
    const input: AcceptJoinRequestInput = {
      groupId: message.groupSlug,
      activitySlug: activity.slug,
      userId: message.sentBy,
    };
    const data = acceptJoinRequestInput.parse(input);
    mutate(data);
  } catch (error) {}

  store.removeToast(getToastId(message));
}

function _onDecline(
  message: PusherInviteMessage | PusherQuickInviteMessage,
  store: Store,
  mutate: (data: DeclineJoinRequestInput) => void,
) {
  if (message.action !== "join_request") {
    return;
  }

  const activity = store.activities.find((activity) =>
    activity.slug === message.activitySlug
  );

  if (!activity) {
    return;
  }

  try {
    const input: DeclineJoinRequestInput = {
      groupId: message.groupSlug,
      userId: message.sentBy,
    };
    const data = declineJoinRequestInput.parse(input);
    mutate(data);
  } catch {}

  store.removeToast(getToastId(message));
}

export default {
  groupJoinRequestHandler,
};
