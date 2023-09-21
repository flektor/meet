import { useStore } from "../utils/store";
import { PusherMessage } from "../types";
import usePusherStore from "./usePusherStore";
import { useEffect, useRef, useState } from "react";

export default function usePusherEventHandler() {
  const store = useStore();

  function handleChatUpdate(channelId: string, message: PusherMessage) {
    switch (message.action) {
      case "message":
        const { action, ...body } = message;
        body.sentAt = new Date(body.sentAt);
        store.addMessage(channelId, body);
        return;

      case "add_viewer":
        return store.addViewer(channelId);

      case "remove_viewer":
        return store.removeViewer(channelId);

      case "invite_request":
        return store.addToast({
          id: `${message.activitySlug}.${message.groupSlug}:${message.sentBy}`,
          displayMessage: "'invite' not implemented yet",
          pusherMessage: message,
        });

      case "quick_search_found":
        return store.addToast({
          id: `${message.activitySlug}:${message.sentBy}`,
          displayMessage: "'quick' not implemented yet",
          pusherMessage: message,
        });

      case "invite_accepted":
        return store.addToast({
          id: `${message.activitySlug}-${message.groupSlug}:${message.sentBy}`,
          displayMessage: `${message.sentBy} is interested on ${channel}`,
          pusherMessage: message,
        });

      case "invite_declined":
        return store.addToast({
          id: `${message.activitySlug}-${message.groupSlug}:${message.sentBy}`,
          displayMessage: `${message.sentBy} is not interested on ${channel}`,
          pusherMessage: message,
        });
    }
  }

  const channel = usePusherStore((state) => state.channel);

  const stableCallback = useRef(handleChatUpdate);

  useEffect(() => {
    stableCallback.current = handleChatUpdate;
  }, [handleChatUpdate]);

  const [subscriptions, setSubscriptions] = useState<string[]>([]);

  useEffect(() => {
    if (!channel) {
      return;
    }

    const reference = (eventName: string, message: PusherMessage) => {
      stableCallback.current(eventName, message);
    };

    for (const eventName of store.pusherSubscriptions) {
      if (!subscriptions.includes(eventName)) {
        channel.bind(
          eventName,
          (message: PusherMessage) => reference(eventName, message),
        );
        setSubscriptions([...subscriptions, eventName]);
      }
    }

    return () => {
      for (const eventName of subscriptions) {
        channel.unbind(eventName, reference);
      }
    };
  }, [channel, store.pusherSubscriptions]);
}
