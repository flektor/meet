import { type NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import LeaveIcon from "~/components/icons/Leave";
import Toast from "~/components/InvitationToast";
import FavoriteButton from "~/components/FavoriteButton";
import useActivity from "~/hooks/useActivity";
import useActivityViewers from "~/hooks/useActivityViewers";
import useChannelUpdater from "~/hooks/useChannelUpdater";
import Nav from "~/components/Nav";
import RegisterButton from "~/components/RegisterButton";
import { Chat } from "~/components/Chat";
import { PusherMessage } from "~/types";
import CreateGroupDialog from "~/components/CreateGroupDialog";
import LoginMessageDialog from "~/components/LoginMessageDialog";
import Groups from "~/components/Groups";
import { useStore } from "~/utils/store";
import Toasts from "~/components/Toasts";
import usePusherEventHandler from "~/hooks/usePusherEventHandler";

const Activity: NextPage = () => {
  const router = useRouter();
  // const store = useStore();
  const slug = router.query.slug as string;
  const { activity, viewers, error, isLoading } = useActivity(slug);

  const { channel } = useChannelUpdater(slug, activity, viewers);

  usePusherEventHandler();

  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [showLoginMessageDialog, setShowLoginMessageDialog] = useState(false);

  // function onFoundUserForRegisteredActivity(
  //   activityId: string,
  //   message: PusherMessage,
  // ) {
  //   const activity = store.activities.find(({ id }) => id === activityId);
  //   const groupName = activity ? activity.title : activityId;

  //   store.addToast({
  //     id: message.sentBy + activity?.title,
  //     displayMessage: `user invites to join ${groupName}`,
  //     pusherMessage: message,
  //   });
  // }

  return (
    <>
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Nav />

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
              activitySlug={activity.slug}
              activityId={activity.id}
              showText={true}
              className="m-5"
              // onPusherMessage={onFoundUserForRegisteredActivity}
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

              {channel && (
                <Chat
                  // update={onUpdateHandler}
                  channel={channel}
                  isLoading={isLoading}
                  activitySlug={activity.slug}
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
