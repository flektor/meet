import { type NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import Toasts from "~/components/Toasts";
import GroupPageNav from "./GroupPageNav";
import Chat from "~/components/Chat";
import Map from "~/components/Map";
import useScreenSize from "~/hooks/useScreenSize";
import usePusherEventHandler from "~/hooks/usePusherEventHandler";
import { useStore } from "~/utils/store";
import { api } from "~/utils/api";
import { Activity } from "~/types";
import { useSession } from "next-auth/react";

const Group: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  const store = useStore();
  const slug = router.query.group as string;
  const activitySlug = router.query.slug as string;
  const screenSize = useScreenSize();
  const mapWidth = screenSize === "sm"
    ? "90vw"
    : screenSize === "md"
    ? "60vw"
    : "40vw";
  const mapHeight = mapWidth;

  const {
    data: activitiesData,
    error: getActivitiesError,
    isLoading: isLoadingActivities,
  } = api.activities.getActivities
    .useQuery(undefined, {
      enabled: store.fetchedActivitiesTimestamp === false,
    });

  useEffect(() => {
    if (activitiesData && store.fetchedActivitiesTimestamp === false) {
      console.log(
        "set activities",
        activitiesData,
        store.fetchedActivitiesTimestamp,
      );
      store.setActivities(activitiesData);
    }
  }, [activitiesData]);

  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const act = store.activities.find((activity) =>
      activity.slug === activitySlug
    );

    if (act) {
      setActivity(act);
    }
  }, [store.activities]);

  const { data: group, isLoading, error } = api.groups
    .getGroup
    .useQuery({
      activitySlug,
      slug,
    }, { enabled: !!slug && !!activity });

  console.log(activity);

  useEffect(() => {
    if (group) {
      store.setGroup(group);
      store.pusherSubscribe(group.channelId);
    }
  }, [group]);

  usePusherEventHandler();

  const [displayTab, setDisplayTab] = useState<"chat" | "map" | "about">(
    "about",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] ">
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GroupPageNav
        session={session}
        onTabChanged={(tab) => setDisplayTab(tab)}
        group={group}
        displayChat={displayTab === "chat"}
      />

      <main>
        {group && (
          <>
            <Toasts />

            {isLoading
              ? (
                <div className="mt-48">
                  <Spinner />
                </div>
              )
              : error && (
                <div className="text-white 2xl mt-48">There was an error.</div>
              )}

            <div className="flex flex-col items-center justify-center pt-12">
              {
                /* <div className="md:w-2/3 flex flex-col justify-center items-center mt-3 ">

                {showLoginMessageDialog && (
                  <LoginMessageDialog
                    onCancel={() => setShowLoginMessageDialog(false)}
                  />
                )}
              </div> */
              }

              {displayTab === "chat" &&
                (
                  <Chat
                    isLoading={isLoading}
                    channelId={group.channelId}
                  />
                )}
              {displayTab === "about" &&
                (
                  <div className="flex flex-col justify-start items-center mt-32">
                    <p className="text-white text-2xl flex">
                      <span className="text-gray-400 mr-2">About:</span>
                      {group.description}
                    </p>
                  </div>
                )}

              {displayTab === "map" &&
                (
                  <div className="flex flex-col justify-center items-center mt-3 gap-3">
                    <Map width={mapWidth} height={mapHeight} />
                  </div>
                )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Group;
