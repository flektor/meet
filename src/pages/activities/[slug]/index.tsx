import { type NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import LeaveIcon from "~/components/icons/Leave";
import FavoriteButton from "~/components/FavoriteButton";
import Nav from "~/components/Nav";
import RegisterButton from "~/components/RegisterButton";
import Chat from "~/components/Chat";
import CreateGroupDialog from "~/components/CreateGroupDialog";
import LoginMessageDialog from "~/components/LoginMessageDialog";
import Groups from "~/components/Groups";
import { useStore } from "~/utils/store";
import Toasts from "~/components/Toasts";
import usePusherEventHandler from "~/hooks/usePusherEventHandler";
import { api } from "~/utils/api";
import Link from "next/link";

const Activity: NextPage = () => {
  const router = useRouter();
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
    <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {activity && (
          <>
            <nav className="fixed left-0 top-0 w-full flex items-center justify-center bg-gradient-to-b from-[#25213C] to-[#1b1b2e] z-10  ">
              <div className="flex items-center justify-between w-full max-w-5xl">
                <div className="flex items-center justify-center transition duration-1000 m-3">
                  {
                    /* <Link
                    href="/"
                    className="hidden md:block text-[#cc66ff] text-5xl font-extrabold tracking-tight -mt-3 ml-2  mr-10"
                  >
                    meet
                  </Link> */
                  }

                  <button
                    className="inline-block"
                    onClick={() => router.back()}
                  >
                    <LeaveIcon className="-mr-2 fill-white" />
                  </button>
                  <span className=" mr-2 ml-2 text-white text-2xl">
                    {activity.title}
                  </span>

                  <FavoriteButton activityId={activity.id} />
                  <RegisterButton
                    activitySlug={activity.slug}
                    activityId={activity.id}
                  />
                </div>
                <button
                  className="justify-end rounded-md w-20 font-bold transition border-2 border-[##2F2C47] bg-black/20 hover:bg-black/5 hover:border-white border-[#cc66ff] text-sm hover:text-white text-[#cc66ff] ml-3 mr-4"
                  onClick={() => setDisplayChat(!displayChat)}
                >
                  {displayChat ? "Groups" : "Chat"}
                </button>
              </div>
            </nav>

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
