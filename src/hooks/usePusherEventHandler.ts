import { useStore } from "../utils/store";
import { PusherMessage } from "../types";
import usePusherStore from "./usePusherStore";
import { useEffect, useState } from "react";

export default function usePusherEventHandler() {
  const store = useStore();

  function handleChatUpdate(channelId: string, message: PusherMessage) {
    console.log({ message });

    switch (message.action) {
      case "message":
        const { action, ...body } = message;
        store.addMessage(channelId, body);
        return;

      case "add_viewer":
        return store.addViewer(channelId);

      case "remove_viewer":
        return store.removeViewer(channelId);

      case "invite_request":
        return store.addToast({
          id: `${message.activityId}-${message.groupId}:${message.sentBy}`,
          displayMessage: "'invite' not implemented yet",
          pusherMessage: message,
        });

      case "quick_search_found":
        return store.addToast({
          id: `${message.activityId}:${message.sentBy}`,
          displayMessage: "'quick' not implemented yet",
          pusherMessage: message,
        });

      case "invite_accepted":
        return store.addToast({
          id: `${message.activityId}-${message.groupId}:${message.sentBy}`,
          displayMessage: `${message.sentBy} is interested on ${channel}`,
          pusherMessage: message,
        });

      case "invite_declined":
        return store.addToast({
          id: `${message.activityId}-${message.groupId}:${message.sentBy}`,
          displayMessage: `${message.sentBy} is not interested on ${channel}`,
          pusherMessage: message,
        });
    }
  }

  const channel = usePusherStore((state) => state.channel);

  const [subscriptions, setSubscriptions] = useState<string[]>([]);

  useEffect(() => {
    if (!channel) {
      return;
    }

    for (const eventName of store.pusherSubscriptions) {
      if (!subscriptions.includes(eventName)) {
        channel.bind(eventName, handleChatUpdate);
        setSubscriptions([...subscriptions, eventName]);
      }
    }
  }, [store.pusherSubscriptions]);

  useEffect(() => {
    if (!channel) {
      return;
    }
    channel.subscribe();

    for (const eventName of store.pusherSubscriptions) {
      if (!subscriptions.includes(eventName)) {
        channel.bind(eventName, handleChatUpdate);
        setSubscriptions([...subscriptions, eventName]);
      }
    }

    return () => {
      for (const eventName of subscriptions) {
        channel.bind(eventName, handleChatUpdate);
        channel.unsubscribe();
      }
    };
  }, [channel]);
}
