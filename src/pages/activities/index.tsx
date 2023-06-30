import { type NextPage } from "next";
import React, { useRef, useState } from "react";
import Head from "next/head";
import Spinner from "../../components/Spinner";
import Nav from "../../components/Nav";
import Activities from "../../components/Activities";
import { useSession } from "next-auth/react";
import useActivities from "~/hooks/useActivities";
import CreateActivityDialog from "~/components/CreateActivityDialog";
import LoginMessageDialog from "~/components/LoginMessageDialog";

const Activity: NextPage = () => {
  const { data: session } = useSession();
  const { activities, isLoading, error } = useActivities();

  const [showCreateActivity, setShowCreateActivity] = useState(false);
  const [showLoginMessageDialog, setShowLoginMessageDialog] = useState(false);

  return (
    <>
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Nav />

        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() =>
              session?.user
                ? setShowCreateActivity(true)
                : setShowLoginMessageDialog(true)}
            className="mt-20 text-white border-2 border-white/40 hover:border-white list-none cursor-pointer text-2xl bg-white/20 hover:bg-white/30 rounded-3xl py-1 px-5 pb-3 transition"
          >
            Create Activity
          </button>

          {isLoading && <Spinner />}

          {error && <div className="text-white 2xl">There was an error.</div>}

          {activities.length === 0 && (
            <div className="text-white 2xl">There are no activities.</div>
          )}

          {showCreateActivity && (
            <CreateActivityDialog
              onNewActivity={() => setShowCreateActivity(false)}
              onClose={() => setShowCreateActivity(false)}
            />
          )}
          {showLoginMessageDialog && (
            <LoginMessageDialog
              onCancel={() => setShowLoginMessageDialog(false)}
            />
          )}

          <Activities />
        </div>
      </main>
    </>
  );
};

export default Activity;
