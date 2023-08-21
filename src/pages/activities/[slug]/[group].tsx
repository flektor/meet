import { type NextPage } from "next";
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import Toasts from "~/components/Toasts";
import LeaveIcon from "~/components/icons/Leave";
import Nav from "~/components/Nav";
import useChannelUpdater from "~/hooks/useChannelUpdater";
import { Chat } from "~/components/Chat";
import useGroup from "~/hooks/useGroup";
import Map from "~/components/Map";
import useScreenSize from "~/hooks/useScreenSize";
import usePusherEventHandler from "~/hooks/usePusherEventHandler";

const Group: NextPage = () => {
  const router = useRouter();
  const slug = router.query.group as string;
  const activitySlug = router.query.slug as string;
  const screenSize = useScreenSize();
  const mapWidth = screenSize === "sm"
    ? "90vw"
    : screenSize === "md"
    ? "80vw"
    : "50vw";
  const mapHeight = mapWidth;

  const { group, viewers, isLoading, error } = useGroup(activitySlug, slug);

  const { channel } = useChannelUpdater(slug, group, viewers);

  usePusherEventHandler();

  // function onUpdateHandler(message: PusherMessage) {
  //   console.log({ pusherMessage: message });

  //   switch (message.action) {
  //     case "message":
  //       return refetchGroup();
  //     case "viewer":
  //       return refetchViewers();
  //     case "invite":
  //       return store.addToast({
  //         displayMessage: "invite is not impenting yet",
  //         pusherMessage: message,
  //       });
  //     case "quick":
  //       return store.addToast({
  //         displayMessage: "quick is not impenting yet",
  //         pusherMessage: message,
  //       });
  //   }
  // }

  // function onFoundUserForRegisteredActivity(groupId: string) {
  //   store.addToast({
  //     message: `user invites to join ${groupId}`,
  //     id: `inv-${groupId}`,
  //   });
  // }

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

              {channel && (
                <Chat
                  channel={channel}
                  isLoading={isLoading}
                  activitySlug={activitySlug}
                  groupSlug={group.slug}
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
