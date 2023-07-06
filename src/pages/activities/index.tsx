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
import LeaveIcon from "~/components/icons/Leave";
import { useRouter } from "next/router";

const Activity: NextPage = () => {
  const router = useRouter();
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

        <header className="w-full flex items-center justify-center mb-6 p-1">
          <div className="mt-32 flex items-center">
            <button
              className=" inline-block"
              onClick={() => router.back()}
            >
              <LeaveIcon />
            </button>
            <span className=" mr-2 ml-2 text-white text-3xl">
              Activities
            </span>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() =>
              session?.user
                ? setShowCreateActivity(true)
                : setShowLoginMessageDialog(true)}
            className="rounded-full px-8 py-3 font-semibold text-white no-underline transition border-2 border-[#cc66ff] bg-black/20 hover:bg-black/5 hover:border-white hover:text-white"
          >
            Create Activity
          </button>

          {isLoading
            ? (
              <div className="mt-48">
                <Spinner />
              </div>
            )
            : error
            ? <div className="text-white 2xl mt-48">There was an error.</div>
            : activities.length === 0 && (
              <div className="text-white 2xl mt-48">
                There are no activities.
              </div>
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
