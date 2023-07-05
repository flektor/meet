import { pusherServerClient } from "~/server/pusher";
import { PusherSendProps } from "~/types";

export function pusherSend({ receivers, slug, body }: PusherSendProps) {
  pusherServerClient.trigger(
    receivers,
    slug,
    body,
  );
}
