import { type NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Spinner from "../../components/Spinner";
import ActivitiesPageNav from "~/components/Nav/ActivitiesPageNav";
import Activities from "../../components/Activities";
import { useSession } from "next-auth/react";
import CreateActivityDialog from "~/components/CreateActivityDialog";
import LoginMessageDialog from "~/components/LoginMessageDialog";
import usePusherEventHandler from "~/hooks/usePusherEventHandler";
import { useStore } from "~/utils/store";
import { api } from "~/utils/api";

const Activity: NextPage = () => {
  const session = useSession();
  const store = useStore();
  const [showCreateActivity, setShowCreateActivity] = useState(false);
  usePusherEventHandler(session.data?.user.id || "userId");

  const { data, error, isLoading } = api.activities.getActivities
    .useQuery();

  useEffect(() => {
    if (data) {
      store.setActivities(data);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ActivitiesPageNav session={session} />

      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] pt-20 ">
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() =>
              session?.data?.user
                ? setShowCreateActivity(true)
                : store.setShowLoginMessageDialog(true)}
            className="rounded-full px-5 py-2 font-semibold text-white no-underline transition border-2 border-primary bg-black/20 hover:bg-black/5 hover:border-white hover:text-white"
          >
            Create Activity
          </button>

          {showCreateActivity && (
            <CreateActivityDialog
              onNewActivity={() => setShowCreateActivity(false)}
              onClose={() => setShowCreateActivity(false)}
            />
          )}

          <LoginMessageDialog />

          {isLoading
            ? (
              <div className="mt-24">
                <Spinner />
              </div>
            )
            : error
            ? <div className="text-white 2xl mt-24">There was an error.</div>
            : store.activities.length === 0 && (
              <div className="text-white 2xl mt-48">
                Create the first activity!
              </div>
            )}

          <Activities />
        </div>
      </main>
    </>
  );
};

export default Activity;
