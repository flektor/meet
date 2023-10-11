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
    id: `${message.activitySlug}.${message.groupSlug}:${message.sentBy}`,
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

  store.removeToast(getToastId(message));

  const activity = store.activities.find((activity) =>
    activity.slug === message.activitySlug
  );

  if (!activity) {
    return;
  }

  try {
    const input: AcceptJoinRequestInput = {
      groupId: message.groupId,
      activitySlug: activity.slug,
      userId: message.sentBy,
    };
    const data = acceptJoinRequestInput.parse(input);
    mutate(data);

    const group = store.groups.find((group) => group.id === message.groupId);

    if (!group) {
      return;
    }

    store.setGroup({
      ...group,
      membersIds: [...group.membersIds, message.sentBy],
    });
  } catch (error) {}
}

function _onDecline(
  message: PusherInviteMessage | PusherQuickInviteMessage,
  store: Store,
  mutate: (data: DeclineJoinRequestInput) => void,
) {
  if (message.action !== "join_request") {
    return;
  }

  store.removeToast(getToastId(message));

  const activity = store.activities.find((activity) =>
    activity.slug === message.activitySlug
  );

  if (!activity) {
    return;
  }

  try {
    const input: DeclineJoinRequestInput = {
      groupId: message.groupId,
      userId: message.sentBy,
    };
    const data = declineJoinRequestInput.parse(input);
    mutate(data);
  } catch {}
}

export default {
  groupJoinRequestHandler,
};
