import { useStore } from "../utils/store";
import { PusherMessage } from "../types";
import usePusherStore from "./usePusherStore";
import { useEffect } from "react";

export default function usePusherEventHandler() {
  const store = useStore();

  function handleChatUpdate(message: PusherMessage) {
    const channelId = `${message.activitySlug}"/"${message.groupSlug}` || "";

    console.log({ pusherMessage: message });
    switch (message.action) {
      case "message":
        return;
        // return refetch();

      case "add_viewer":
        return;

      case "remove_viewer":
        // return refetchViewers();
        return;

      case "invite_request":
        return store.addToast({
          id: message.requestId,
          displayMessage: "'invite' not implemented yet",
          pusherMessage: message,
        });

      case "quick_search_found":
        return store.addToast({
          id: message.requestId,

          displayMessage: "'quick' not implemented yet",
          pusherMessage: message,
        });

      case "invite_accepted":
        return store.addToast({
          id: message.requestId,
          displayMessage: `${message.sentBy} is interested on ${channel}`,
          pusherMessage: message,
        });

      case "invite_declined":
        return store.addToast({
          id: message.requestId,
          displayMessage: `${message.sentBy} is not interested on ${channel}`,
          pusherMessage: message,
        });
    }
  }

  const channel = usePusherStore((state) => state.channel);

  useEffect(() => {
    if (!channel) {
      return;
    }
    channel.subscribe();
    channel.bind_global(handleChatUpdate);
    return () => {
      channel.unsubscribe();
      channel.unbind_all();
    };
  }, [channel]);
}
