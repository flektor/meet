import { type NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import ActivityPageNav from "./ActivityPageNav";
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

  const [displayChat, setDisplayChat] = useState(true);

  const { data: activity, isLoading, error } = api.activities
    .getActivity
    .useQuery({
      slug,
    }, { enabled: !!slug });

  useEffect(() => {
    if (activity) {
      store.pusherSubscribe(activity.channelId);
      store.setActivity(activity);
    }
  }, [activity]);

  usePusherEventHandler();

  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [showLoginMessageDialog, setShowLoginMessageDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b to-[#2e026d] from-[#15162c] ">
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

      <main>
        {activity && (
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

            <div className="flex flex-col items-center justify-center pt-2">
              <div className="md:w-2/3 flex flex-col justify-center items-center mt-3 ">
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
              </div>

              {displayChat
                ? (
                  <Chat
                    isLoading={isLoading}
                    channelId={activity.channelId}
                  />
                )
                : (
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-white text-2xl flex">
                      <span className="text-gray-400 mr-2">About:</span>
                      {activity.description}
                    </p>

                    {activity.groups.length === 0 && (
                      <p className="text-white m-10">
                        Be the first one to create a group!
                      </p>
                    )}
                    <button
                      className="rounded-full font-bold transition border-2 border-[#cc66ff] bg-black/20 hover:bg-black/5 hover:border-white hover:text-white text-[#cc66ff] p-1 pl-3 pr-3"
                      onClick={() => setShowCreateGroupDialog(true)}
                    >
                      Create Group
                    </button>
                    <Groups activitySlug={slug} />
                  </div>
                )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Activity;
