import { type NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import LeaveIcon from "~/components/icons/Leave";
import Toast from "~/components/InvitationToast";
import FavoriteButton from "~/components/FavoriteButton";
import useActivity from "~/hooks/useActivity";
import Nav from "~/components/Nav";
import RegisterButton from "~/components/RegisterButton";
import { Chat } from "~/components/Chat";
import { api } from "~/utils/api";
import { addDynamicGroupInput, Channel, PusherMessage } from "~/types";
import CreateGroupDialog from "~/components/CreateGroupDialog";
import LoginMessageDialog from "~/components/LoginMessageDialog";
import Groups from "~/components/Groups";
import { useStore } from "~/utils/store";

const _initChannelData = {
  createdAt: new Date(),
  description: "",
  id: "temp",
  messages: [],
  title: "",
  users: [],
};

const Activity: NextPage = () => {
  const router = useRouter();
  const store = useStore();
  const slug = router.query.slug as string;
  const { activity, error, isLoading, refetch } = useActivity(slug);

  const addToViewers = api.activityViewer.add.useMutation();

  const addDynamicGroup = api.groups.addDynamicGroup.useMutation({
    onError: (error) => {
      console.log({ error });
    },
    onSuccess: (group) => {
      if (!activity) return;
      router.push(`/activities/${activity.slug}/${group.slug}`);
    },
  });

  const removeFromViewers = api.activityViewer.remove.useMutation();

  const [addedToViewers, setAddedToViewers] = useState(false);

  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [showLoginMessageDialog, setShowLoginMessageDialog] = useState(false);

  const { data: viewers, refetch: refetchViewers } = api.activityViewer
    .getActivityViewers
    .useQuery({
      activityId: activity ? activity.id : "",
    }, {
      enabled: !!activity,
    });

  const [toasts, setToasts] = useState<
    { displayMessage: string; icon?: string; pusherMessage: PusherMessage }[]
  >(
    [],
  );

  function getUserNameById(userId: string) {
    return activity?.channel.users.find((user) => user.userId === userId)
      ?.name || "user";
  }

  function onUpdateHandler(message: PusherMessage) {
    console.log({ pusherMessage: message });
    switch (message.action) {
      case "message":
        return refetch();
      case "viewer":
        return refetchViewers();
      case "invite":
        return setToasts(
          (
            prev,
          ) => [...prev, {
            displayMessage: "'invite' not implemented yet",
            pusherMessage: message,
          }],
        );
      case "quick":
        return setToasts(
          (
            prev,
          ) => [...prev, {
            displayMessage: "'quick' not implemented yet",
            pusherMessage: message,
          }],
        );

      case "accepted":
        return setToasts(
          (
            prev,
          ) => [...prev, {
            displayMessage:
              `${message.sentBy} is interested on ${message.data.title}`,
            pusherMessage: message,
          }],
        );

        // message.sentBy;
        // return router.push(`/activities/${activity.slug}/${group.slug}`);
    }
  }

  function onFoundUserForRegisteredActivity(
    activityId: string,
    message: PusherMessage,
  ) {
    const activity = store.activities.find(({ id }) => id === activityId);
    const groupName = activity ? activity.title : activityId;

    setToasts((
      prev,
    ) => [...prev, {
      displayMessage: `user invites to join ${groupName}`,
      pusherMessage: message,
    }]);
  }

  function removeToast(index: number) {
    setToasts((prev) => [...(prev.filter((t, i) => i !== index))]);
  }

  function onAcceptInvitation(index: number, message: PusherMessage) {
    if (!activity) {
      return removeToast(index);
    }

    if (message.action === "accepted") {
      removeToast(index);
      router.push(message.data.pageSlug);
    }

    try {
      const data = addDynamicGroupInput.parse({
        title: activity.title,
        description: activity.description,
        activityId: activity.id,
        otherUserId: message.sentBy,
        activitySlug: activity.slug,
      });

      addDynamicGroup.mutate(data);
    } catch (error) {}

    removeToast(index);
  }

  function onDeclineInvitation(index: number) {
    removeToast(index);
  }

  const [channel, setChannel] = useState<Channel>(_initChannelData);

  useEffect(() => {
    if (!activity) return;

    if (viewers) {
      for (const viewer of viewers) {
        const index = activity.channel.users.findIndex(({ userId }) =>
          viewer.userId === userId
        );
        if (index > -1) {
          activity.channel.users[index] = viewer;
          continue;
        }
        activity.channel.users.push(viewer);
        continue;
      }
    }
    const updatedMessages = activity.channel.messages.map((message) => {
      return {
        ...message,
        sentBy: getUserNameById(message.sentBy),
      };
    });

    setChannel({
      ...activity.channel,
      messages: updatedMessages,
    });
  }, [viewers, activity]);

  useEffect(() => {
    if (!activity || !viewers) return;

    for (const viewer of viewers) {
      const index = activity.channel.users.findIndex(({ userId }) =>
        viewer.userId === userId
      );
      if (index > -1) {
        activity.channel.users[index] = viewer;
        return;
      }
      activity.channel.users.push(viewer);
    }
  }, [activity]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (activity) {
        removeFromViewers.mutate({ activityId: activity.id });
      }
    };

    if (activity && !addedToViewers) {
      addToViewers.mutate({ activityId: activity.id });
      setAddedToViewers(true);
    }

    router.events.on("beforeHistoryChange", handleRouteChange);
    window.addEventListener("beforeunload", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
      router.events.off("beforeHistoryChange", handleRouteChange);
    };
  }, [activity, addedToViewers]);

  return (
    <>
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Nav />

        <ul className="fixed top-20 right-3 z-20 flex flex-col gap-2">
          {toasts.map((toast, index) => (
            <li key={index}>
              <Toast
                message={toast.displayMessage}
                onAccept={() => onAcceptInvitation(index, toast.pusherMessage)}
                onDecline={() => onDeclineInvitation(index)}
                onDie={() => removeToast(index)}
              />
            </li>
          ))}
        </ul>

        {isLoading
          ? (
            <div className="mt-48">
              <Spinner />
            </div>
          )
          : error && (
            <div className="text-white 2xl mt-48">There was an error.</div>
          )}
        {activity && (
          <div className="flex flex-col items-center justify-center pt-32">
            <header className="w-full flex items-center justify-center mb-6">
              <button
                className="inline-block"
                onClick={() => router.back()}
              >
                <LeaveIcon />
              </button>
              <span className=" mr-2 ml-2 text-white text-3xl">
                {activity.title}
              </span>

              <FavoriteButton
                activityId={activity.id}
                className="mt-1"
              />
            </header>

            <button
              className="rounded-full px-8 py-3 font-semibold text-white no-underline transition border-2 border-[#cc66ff] bg-black/20 hover:bg-black/5 hover:border-white hover:text-white"
              onClick={() => setShowCreateGroupDialog(true)}
            >
              Create Group
            </button>

            <RegisterButton
              activityId={activity.id}
              showText={true}
              className="m-5"
              onPusherMessage={onFoundUserForRegisteredActivity}
            />

            <div className="container flex flex-col items-center justify-center gap-12 py-1 px-5 pb-3 ">
              <div className="text-white/50">
                Description:
                <p className="text-white text-2xl">{activity.description}</p>
              </div>

              {activity.groups.length === 0 && (
                <div className="text-white 2xl">There are no activities.</div>
              )}

              {showCreateGroupDialog && (
                <CreateGroupDialog
                  onNewGroup={() => setShowCreateGroupDialog(false)}
                  onClose={() => setShowCreateGroupDialog(false)}
                  activitySlug={slug}
                  activityId={activity.id}
                />
              )}
              {showLoginMessageDialog && (
                <LoginMessageDialog
                  onCancel={() => setShowLoginMessageDialog(false)}
                />
              )}

              <Groups activitySlug={slug} />

              {activity && (
                <Chat
                  update={onUpdateHandler}
                  channel={channel}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Activity;
