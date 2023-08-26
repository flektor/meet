import { type FunctionComponent } from "react";
import Toast from "../InvitationToast";
import React from "react";
import { useStore } from "../../utils/store";
import {
  addDynamicGroupInput,
  PusherInviteMessage,
  PusherMessage,
  PusherQuickSearchMessage,
} from "~/types";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const Toasts: FunctionComponent = () => {
  const router = useRouter();
  const store = useStore();

  const addDynamicGroup = api.groups.addDynamicGroup.useMutation({
    onError: (error) => {
      console.log({ error });
    },
    onSuccess: (group) => {
      if (!group.slug) return;
      router.push(`/activities/${group.activitySlug}/${group.slug}`);
    },
  });

  function getToastId(message: PusherInviteMessage | PusherQuickSearchMessage) {
    if (message.action === "quick_search_found") {
      return `${message.activitySlug}:${message.sentBy}`;
    }
    return `${message.activitySlug}.${message.groupSlug}:${message.sentBy}`;
  }

  function onAcceptInvitation(message: PusherMessage) {
    if (message.action !== "invite_accepted") {
      return;
    }

    const activity = store.activities.find((activity) =>
      activity.slug === message.activitySlug
    );

    store.removeToast(getToastId(message));
    router.push(`/activities/${message.activitySlug}/${message.groupSlug}`);

    if (!activity) {
      return;
    }

    try {
      const data = addDynamicGroupInput.parse({
        title: message.activitySlug,
        description: activity.description,
        activityId: activity.id,
        otherUserId: message.sentBy,
        activitySlug: activity.slug,
      });

      addDynamicGroup.mutate(data);
    } catch (error) {}

    store.removeToast(getToastId(message));
  }

  function onDeclineInvitation(
    message: PusherInviteMessage | PusherQuickSearchMessage,
  ) {
    store.removeToast(getToastId(message));
  }

  return (
    <ul className="fixed top-20 right-3 z-20 flex flex-col gap-2">
      {store.toasts.map(({ pusherMessage, displayMessage, id }) => (
        <li key={id}>
          <Toast
            message={displayMessage}
            onAccept={() => onAcceptInvitation(pusherMessage)}
            onDecline={() => onDeclineInvitation(pusherMessage)}
            onDie={() => store.removeToast(getToastId(pusherMessage))}
          />
        </li>
      ))}
    </ul>
  );
};

export default Toasts;
