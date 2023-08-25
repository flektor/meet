import { pusherServerClient } from "~/server/pusher";
import { PusherSendProps } from "~/types";

export function pusherSend({ receivers, channelId, body }: PusherSendProps) {
  pusherServerClient.trigger(
    receivers,
    channelId,
    body,
  );
}
