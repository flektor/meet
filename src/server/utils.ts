import { pusherServerClient } from "~/server/pusher";
import { PusherSendProps } from "~/types";

export function pusherSend({ receivers, slug, action }: PusherSendProps) {
  pusherServerClient.trigger(
    receivers,
    slug,
    action,
  );
}
