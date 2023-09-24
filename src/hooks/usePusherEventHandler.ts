import { useStore } from "../utils/store";
import { PusherMessage } from "../types";
import usePusherStore from "./usePusherStore";
import { useEffect, useRef, useState } from "react";
import activities from "~/utils/store/activities";

export default function usePusherEventHandler() {
  const store = useStore();

  function handleChatUpdate(eventName: string, message: PusherMessage) {
    console.log(eventName, message);
    switch (message.action) {
      case "message":
        const { action, ...body } = message;
        body.sentAt = new Date(body.sentAt);
        store.addMessage(eventName, body);
        return;

      case "add_viewer":
        return store.addViewer(eventName);

      case "remove_viewer":
        return store.removeViewer(eventName);

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

  const registrations = store.activities.filter((activity) =>
    activity.isRegistered
  ).map((activity) => activity.id);

  const reference = (eventName: string, message: PusherMessage) => {
    stableCallback.current(eventName, message);
  };

  useEffect(() => {
    if (!channel) {
      return;
    }

    const subscriptions = Object.keys(channel.callbacks._callbacks).map((key) =>
      key.substring(1)
    );

    for (const eventName of store.pusherSubscriptions) {
      if (!subscriptions.includes(eventName)) {
        channel.bind(
          eventName,
          (message: PusherMessage) => reference(eventName, message),
        );
      }
    }

    return () => {
      for (const eventName of subscriptions) {
        channel.unbind(eventName, reference);
      }
    };
  }, [channel, store.pusherSubscriptions]);
}
