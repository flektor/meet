import { type NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import Toasts from "~/components/Toasts";
import LeaveIcon from "~/components/icons/Leave";
import Nav from "~/components/Nav";
import { Chat } from "~/components/Chat";
import { Channel, getGroupOutput, PusherMessage } from "~/types";
import useGroup from "~/hooks/useGroup";
import Map from "~/components/Map";
import useScreenSize from "~/hooks/useScreenSize";
import { useStore } from "~/utils/store";
import useGroupViewer from "~/hooks/useGroupViewer";
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
  const store = useStore();

  const screenSize = useScreenSize();
  const mapWidth = screenSize === "sm"
    ? "90vw"
    : screenSize === "md"
    ? "80vw"
    : "50vw";
  const mapHeight = mapWidth;

  const { group, isLoading, error, refetch: refetchGroup } = useGroup(slug);

  const { viewers, refetchViewers } = useGroupViewer(group);

  const [channel, setChannel] = useState<Channel>(_initChannelData);

  function getUserNameById(userId: string) {
    return group?.channel.users.find((user) => user.userId === userId)?.name ||
      "user";
  }

  function updateSenderNamesOnMessages(group: NonNullable<getGroupOutput>) {
    const updatedMessages = group.channel.messages.map((message) => ({
      ...message,
      sentBy: getUserNameById(message.sentBy),
    }));
    setChannel({ ...group.channel, messages: updatedMessages });
  }

  function onUpdateHandler(message: PusherMessage) {
    console.log({ pusherMessage: message });

    switch (message.action) {
      case "message":
        return refetchGroup();
      case "viewer":
        return refetchViewers();
      case "invite":
        return store.addToast({
          message: "'invite' not implemented yet",
          id: message.id,
        });
      case "quick":
        return store.addToast({
          message: "'quick' not implemented yet",
          id: message.id,
        });
    }
  }

  // function onFoundUserForRegisteredActivity(groupId: string) {
  //   store.addToast({
  //     message: `user invites to join ${groupId}`,
  //     id: `inv-${groupId}`,
  //   });
  // }

  // Update usernames on messages
  useEffect(() => {
    if (!group) return;

    updateSenderNamesOnMessages(group);

    if (!viewers) return;

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
  }, [viewers, group]);

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
        <Toasts />

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
