import { PusherInviteMessage, PusherQuickSearchMessage } from "../../types";

export default function getToastId(
  message: PusherInviteMessage | PusherQuickSearchMessage,
) {
  if (message.action === "quick_search_found") {
    return `${message.activitySlug}:${message.sentBy}`;
  }
  return `${message.activitySlug}.${message.groupSlug}:${message.sentBy}`;
}
