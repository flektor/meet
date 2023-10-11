import { Store } from "../store";
import getToastId from "./getToastId";
import {
  AcceptInviteRequestInput,
  acceptInviteRequestInput,
  PusherInviteMessage,
  ToastProps,
} from "../../types";

export function groupInviteHandler(
  sender: string,
  message: PusherInviteMessage,
  store: Store,
  mutate: (data: AcceptInviteRequestInput) => void,
) {
  if (message.action !== "invite_request") {
    return;
  }

  const toastProps: ToastProps = {
    id: getToastId(message),
    displayMessage: `${sender} invites you to join ${message.groupSlug}`,
    pusherMessage: message,
    duration: 15000,
    onAccept: () => onAccept(message, store, mutate),
    onDecline: () => onDecline(message, store),
  };

  store.addToast(toastProps);
}

function onAccept(
  message: PusherInviteMessage,
  store: Store,
  mutate: (data: AcceptInviteRequestInput) => void,
) {
  try {
    const input: AcceptInviteRequestInput = {
      groupId: message.groupId,
      userId: message.sentBy,
    };
    const data = acceptInviteRequestInput.parse(input);
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
