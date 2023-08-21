import { type FunctionComponent } from "react";
import Toast from "../InvitationToast";
import React from "react";
import { useStore } from "../../utils/store";
import { addDynamicGroupInput, PusherMessage } from "~/types";
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
      router.push(`/activities/${group.activity}/${group.slug}`);
    },
  });

  function onAcceptInvitation(toastId: string, message: PusherMessage) {
    if (message.action !== "invite_accepted") {
      return;
    }

    const activity = store.activities.find((activity) =>
      activity.slug === message.activity
    );

    store.removeToast(message.requestId);
    router.push(`/activities/${message.activity}/${message.group}`);

    if (!activity) {
      return;
    }

    try {
      const data = addDynamicGroupInput.parse({
        title: message.activity,
        description: activity.description,
        activityId: activity.id,
        otherUserId: message.sentBy,
        activitySlug: activity.slug,
      });

      addDynamicGroup.mutate(data);
    } catch (error) {}

    store.removeToast(toastId);
  }

  function onDeclineInvitation(toastId: string) {
    store.removeToast(toastId);
  }

  return (
    <ul className="fixed top-20 right-3 z-20 flex flex-col gap-2">
      {store.toasts.map(({ pusherMessage, displayMessage, id }) => (
        <li key={id}>
          <Toast
            message={displayMessage}
            onAccept={() => onAcceptInvitation(id, pusherMessage)}
            onDecline={() => onDeclineInvitation(id)}
            onDie={() => store.removeToast(id)}
          />
        </li>
      ))}
    </ul>
  );
};

export default Toasts;
