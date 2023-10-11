import { type NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import ActivityPageNav from "../../../components/Nav/ActivityPageNav";
import Chat from "~/components/Chat";
import CreateGroupDialog from "~/components/CreateGroupDialog";
import LoginMessageDialog from "~/components/LoginMessageDialog";
import Groups from "~/components/Groups";
import { useStore } from "~/utils/store";
import Toasts from "~/components/Toasts";
import usePusherEventHandler from "~/hooks/usePusherEventHandler";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const Activity: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  const store = useStore();
  const slug = router.query.slug as string;

  const [displayChat, setDisplayChat] = useState(false);

  const { data: activity, isLoading, error } = api.activities
    .getActivity
    .useQuery({ slug }, { enabled: !!slug });

  const { data: membershipsIds, isLoading: isLoadingM, error: errorM } = api
    .memberships
    .getAll
    .useQuery();

  useEffect(() => {
    if (activity) {
      store.pusherSubscribe(activity.channelId);

      store.setActivity(activity);
    }
  }, [activity]);

  useEffect(() => {
    console.log({ membershipsIds });
    if (membershipsIds) {
      store.pusherSubscribe(membershipsIds);
      // store.setActivity(activity);
    }
  }, [membershipsIds]);

  usePusherEventHandler(session.data?.user.id || "userId");

  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [showLoginMessageDialog, setShowLoginMessageDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] ">
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ActivityPageNav
        session={session}
        activity={activity}
        displayChat={displayChat}
        toggleChat={() => setDisplayChat(!displayChat)}
      />

      {activity && (
        <main className="flex flex-col items-center justify-center pt-20">
          <div className="md:w-2/3 flex flex-col justify-center items-center">
            {showCreateGroupDialog && (
              <CreateGroupDialog
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
          </div>

          {displayChat &&
            (
              <Chat
                isLoading={isLoading}
                channelId={activity.channelId}
                session={session}
              />
            )}

          {!displayChat && (
            <div className="flex flex-col gap-6 justify-center items-center">
              {
                /* <p className="text-white text-2xl flex">
                <span className="text-gray-400 mr-2">About:</span>
                {activity.description}
              </p> */
              }

              {activity.groups.length === 0 && (
                <p className="text-gray-400 text-xl">
                  Create the first group!
                </p>
              )}

              <button
                className="rounded-full px-5 py-2 font-semibold text-white no-underline transition border-2 border-primary bg-black/20 hover:bg-black/5 hover:border-white hover:text-white"
                onClick={() => setShowCreateGroupDialog(true)}
              >
                Create Group
              </button>

              <Groups activitySlug={slug} />
            </div>
          )}

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

export default Activity;
