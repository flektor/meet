import { useStore } from "../utils/store";
import { PusherMessage } from "../types";
import usePusherStore from "./usePusherStore";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";
import quickInviteHandler from "~/utils/pusher/groupQuickInviteHandler";

import joinRequestHandler from "~/utils/pusher/groupJoinRequestHandler";
import { groupInviteHandler } from "~/utils/pusher/groupInviteHandler";

export default function usePusherEventHandler() {
  const store = useStore();
  const router = useRouter();

  const addDynamicGroup = api.groups.addDynamicGroup.useMutation({
    onError: quickInviteHandler.onAddGroupError,
    onSuccess: (data) => quickInviteHandler.onAddGroupSuccess(data, router),
  });

  const acceptJoinRequest = api.memberships.acceptJoinRequest.useMutation();
  const declineJoinRequest = api.memberships.declineJoinRequest.useMutation();
  const addToMemberships = api.memberships.add.useMutation();

  function handleChatUpdate(eventName: string, message: PusherMessage) {
    console.log(eventName, message);

    const sender = store.users.find((user) => user.id === message.sentBy)
      ?.name?.split(" ")[0] || "user";

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
        return groupInviteHandler(
          sender,
          message,
          store,
          addToMemberships.mutate,
        );

      case "invite_declined":
        return store.addToast({
          id: `${message.activitySlug}-${message.groupSlug}:${message.sentBy}`,
          displayMessage: `${sender} is not interested on ${
            message.groupSlug || message.activitySlug
          }`,
          pusherMessage: message,
        });

      case "quick_invite_request":
        return quickInviteHandler.groupQuickInviteHandler(
          sender,
          message,
          store,
          addDynamicGroup.mutate,
        );

      case "quick_invite_accepted":
        return router.push(
          `/activities/${message.activitySlug}/${message.groupSlug}`,
        );

      case "join_request":
        return joinRequestHandler.groupJoinRequestHandler(
          sender,
          message,
          store,
          acceptJoinRequest.mutate,
          declineJoinRequest.mutate,
        );
    }
  }

  const channel = usePusherStore((state) => state.channel);

  const stableCallback = useRef(handleChatUpdate);

  useEffect(() => {
    stableCallback.current = handleChatUpdate;
  }, [handleChatUpdate]);

  // const registrations = store.activities.filter((activity) =>
  //   activity.isRegistered
  // ).map((activity) => activity.id);

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
