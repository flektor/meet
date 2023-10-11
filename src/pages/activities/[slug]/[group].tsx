import { type NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import Toasts from "~/components/Toasts";
import GroupPageNav from "~/components/Nav/GroupPageNav";
import Chat from "~/components/Chat";
import usePusherEventHandler from "~/hooks/usePusherEventHandler";
import { useStore } from "~/utils/store";
import { api } from "~/utils/api";
import { Activity } from "~/types";
import { useSession } from "next-auth/react";
import GroupInfo from "~/components/Group";

const Group: NextPage = () => {
  const router = useRouter();
  const store = useStore();
  const session = useSession();

  const slug = router.query.group as string;
  const activitySlug = router.query.slug as string;

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

  useEffect(() => {
    if (group) {
      store.setGroup(group);
      store.pusherSubscribe(group.channelId);
    }
  }, [group]);

  usePusherEventHandler(session.data?.user.id || "userId");

  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] ">
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GroupPageNav
        session={session}
        toggleChat={() => setShowChat(!showChat)}
        group={group}
        displayChat={showChat}
      />

      {group && (
        <main className="flex flex-col items-center justify-center pt-12">
          {
            /* <div className="md:w-2/3 flex flex-col justify-center items-center mt-3 ">

                {showLoginMessageDialog && (
                  <LoginMessageDialog
                    onCancel={() => setShowLoginMessageDialog(false)}
                  />
                )}
              </div> */
          }

          {showChat
            ? (
              <Chat
                isLoading={isLoading}
                channelId={group.channelId}
                groupId={group.id}
                session={session}
              />
            )
            : <GroupInfo group={group} />}

          <Toasts />

          {isLoading
            ? (
              <div className="mt-10">
                <Spinner />
              </div>
            )
            : error && (
              <div className="text-white 2xl mt-10">
                There was an error.
              </div>
            )}
        </main>
      )}
    </div>
  );
};

export default Group;
