import { type NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import LeaveIcon from "~/components/icons/Leave";
import FavoriteButton from "~/components/FavoriteButton";
import useActivity from "~/hooks/useActivity";
import Nav from "~/components/Nav";
import RegisterButton from "~/components/RegisterButton";
import { Chat } from "~/components/Chat";
import { api } from "~/utils/api";
import { channel } from "diagnostics_channel";
import { Channel } from "~/types";

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
  const slug = router.query.slug as string;
  const { activity, error, isLoading, refetch } = useActivity(slug);

  const addToViewers = api.activityViewer.add.useMutation();

  const removeFromViewers = api.activityViewer.remove.useMutation();

  const [addedToViewers, setAddedToViewers] = useState(false);

  const { data: viewers, refetch: refetchViewers } = api.activityViewer
    .getActivityViewers
    .useQuery({
      activityId: activity ? activity.id : "",
    }, {
      enabled: !!activity,
    });

  function getUserNameById(userId: string) {
    return activity?.channel.users.find((user) => user.userId === userId)
      ?.name || "user";
  }

  function onUpdateHandler(
    action: "message" | "viewer",
  ) {
    switch (action) {
      case "message":
        return refetch();
      case "viewer":
        return refetchViewers();
    }
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

        {isLoading && <Spinner />}

        {error && <div className="text-white 2xl">There was an error.</div>}

        {activity && (
          <div className="flex flex-col items-center justify-center pt-32">
            <header className="w-full flex items-center justify-center">
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

            <RegisterButton
              activityId={activity.id}
              showText={true}
              className="m-5"
            />

            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
              <div className="text-white/50">
                Description:
                <p className="text-white text-2xl">{activity.description}</p>
              </div>

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
