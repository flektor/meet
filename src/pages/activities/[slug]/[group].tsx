import { type NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import LeaveIcon from "~/components/icons/Leave";
import Toast from "~/components/InvitationToast";
import Nav from "~/components/Nav";
import { Chat } from "~/components/Chat";
import { api } from "~/utils/api";
import { Channel, PusherMessage } from "~/types";
import useGroup from "~/hooks/useGroup";
import Map from "~/components/Map";
import useScreenSize from "~/hooks/useScreenSize";

const _initChannelData = {
  createdAt: new Date(),
  description: "",
  id: "temp",
  messages: [],
  title: "",
  users: [],
};

const Group: NextPage = () => {
  const router = useRouter();
  const slug = router.query.group as string;

  const screenSize = useScreenSize();

  const mapWidth = screenSize === "sm"
    ? "90vw"
    : screenSize === "md"
    ? "80vw"
    : "50vw";
  const mapHeight = mapWidth;

  const { group, isLoading, error, refetch } = useGroup(slug);

  const addToViewers = api.groupViewer.add.useMutation();

  const removeFromViewers = api.groupViewer.remove.useMutation();

  const [addedToViewers, setAddedToViewers] = useState(false);

  const { data: viewers, refetch: refetchViewers } = api.groupViewer
    .getGroupViewers
    .useQuery({
      groupId: group ? group.id : "",
    }, {
      enabled: !!group,
    });

  const [toasts, setToasts] = useState<
    { message: string; icon?: string }[]
  >(
    [],
  );

  function getUserNameById(userId: string) {
    return group?.channel.users.find((user) => user.userId === userId)
      ?.name || "user";
  }

  function onUpdateHandler(
    message: PusherMessage,
  ) {
    console.log({ pusherMessage: message });

    switch (message.action) {
      case "message":
        return refetch();
      case "viewer":
        return refetchViewers();
      case "invite":
        return setToasts(
          (prev) => [...prev, { message: "'invite' not implemented yet" }],
        );
      case "quick":
        return setToasts(
          (prev) => [...prev, { message: "'quick' not implemented yet" }],
        );
    }
  }

  function onFoundUserForRegisteredActivity(groupId: string) {
    setToasts((
      prev,
    ) => [...prev, { message: `user invites to join ${groupId}` }]);
  }

  function removeToast(index: number) {
    setToasts((prev) => [...(prev.filter((t, i) => i !== index))]);
  }

  function onAcceptInvitation(index: number) {
    removeToast(index);
  }

  function onDeclineInvitation(index: number) {
    removeToast(index);
  }

  const [channel, setChannel] = useState<Channel>(_initChannelData);

  useEffect(() => {
    if (!group) return;

    if (viewers) {
      for (const viewer of viewers) {
        const index = group.channel.users.findIndex(({ userId }) =>
          viewer.userId === userId
        );
        if (index > -1) {
          group.channel.users[index] = viewer;
          continue;
        }
        group.channel.users.push(viewer);
        continue;
      }
    }
    const updatedMessages = group.channel.messages.map((message) => {
      return {
        ...message,
        sentBy: getUserNameById(message.sentBy),
      };
    });

    setChannel({
      ...group.channel,
      messages: updatedMessages,
    });
  }, [viewers, group]);

  useEffect(() => {
    if (!group || !viewers) return;

    for (const viewer of viewers) {
      const index = group.channel.users.findIndex(({ userId }) =>
        viewer.userId === userId
      );
      if (index > -1) {
        group.channel.users[index] = viewer;
        return;
      }
      group.channel.users.push(viewer);
    }
  }, [group]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (group) {
        removeFromViewers.mutate({ groupId: group.id });
      }
    };

    if (group && !addedToViewers) {
      addToViewers.mutate({ groupId: group.id });
      setAddedToViewers(true);
    }

    router.events.on("beforeHistoryChange", handleRouteChange);
    window.addEventListener("beforeunload", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
      router.events.off("beforeHistoryChange", handleRouteChange);
    };
  }, [group, addedToViewers]);

  const name = group?.title.includes("-")
    ? group.title?.split("-")[0]
    : group?.title;

  return (
    <>
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Nav />

        {isLoading && <Spinner />}

        {error && <div className="text-white 2xl">There was an error.</div>}

        <ul className="fixed top-20 right-3 z-20 flex flex-col gap-2">
          {toasts.map(({ message }, index) => (
            <li key={index}>
              <Toast
                message={message}
                onAccept={() => onAcceptInvitation(index)}
                onDecline={() => onDeclineInvitation(index)}
                onDie={() => removeToast(index)}
              />
            </li>
          ))}
        </ul>
        {group && (
          <div className="flex flex-col items-center justify-center pt-20 ">
            <header className="w-full flex items-center justify-center">
              <button
                className="inline-block"
                onClick={() => router.back()}
              >
                <LeaveIcon />
              </button>
              <span className=" mr-2 ml-2 text-white text-3xl">
                {name! || group.title}
              </span>
            </header>

            <div className="container flex flex-col items-center justify-center gap-4 py-4 w-full">
              <div className="text-white/50 flex justify-center items-center w-full ">
                Description:
                <p className="pl-3 text-white text-2xl">{group.description}</p>
              </div>

              {group && (
                <Chat
                  update={onUpdateHandler}
                  channel={channel}
                  isLoading={isLoading}
                />
              )}
              <Map width={mapWidth} height={mapHeight} draggable />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Group;
