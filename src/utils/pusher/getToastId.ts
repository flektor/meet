import { PusherInviteMessage, PusherQuickInviteMessage } from "../../types";

export default function getToastId(
  message: PusherInviteMessage | PusherQuickInviteMessage,
) {
  if (message.action === "quick_invite_request") {
    return `${message.activitySlug}:${message.sentBy}`;
  }

  if (message.action === "invite_accepted") {
    return `general.${message.groupId}:${message.sentBy}`;
  }

  return `${message.activitySlug}.${message.groupSlug}:${message.sentBy}`;
}
