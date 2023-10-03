import { type NextPage } from "next";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Spinner from "../../components/Spinner";
import ActivitiesPageNav from "./ActivitiesPageNav";
import Activities from "../../components/Activities";
import { useSession } from "next-auth/react";
import CreateActivityDialog from "~/components/CreateActivityDialog";
import LoginMessageDialog from "~/components/LoginMessageDialog";
import LeaveIcon from "~/components/icons/Leave";
import { NextRouter, useRouter } from "next/router";
import usePusherEventHandler from "~/hooks/usePusherEventHandler";
import { useStore } from "~/utils/store";
import { api } from "~/utils/api";
import Link from "next/link";

const MenuLink = (
  { children, className = "", href = "", onClick }: {
    children?: ReactNode;
    className?: string;
    href?: string;
    onClick?: () => void;
  },
) => (
  <Link
    href={href}
    className={`${className} p-2 hover:bg-white/10 rounded-md`}
    onClick={onClick}
  >
    {children}
  </Link>
);

const MenuOptions = ({ router }: { router: NextRouter }) => (
  <>
    <MenuLink
      className="hidden md:block"
      onClick={() => {
        router.push("favorites");
      }}
    >
      Favorites
    </MenuLink>
    <MenuLink onClick={() => {}}>Settings</MenuLink>
    <MenuLink onClick={() => {}}>Profile</MenuLink>
    <MenuLink onClick={() => {}}>Logout</MenuLink>
  </>
);

const Activity: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  const store = useStore();
  const [showCreateActivity, setShowCreateActivity] = useState(false);
  const [showLoginMessageDialog, setShowLoginMessageDialog] = useState(false);

  const pathnameParts = router.pathname.split("/");
  const route = pathnameParts[pathnameParts.length - 1];
  usePusherEventHandler();

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

      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
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
              session?.data?.user
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
            : store.activities.length === 0 && (
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

          {isLoading
            ? (
              <div className="mt-48">
                <Spinner />
              </div>
            )
            : error
            ? <div className="text-white 2xl mt-48">There was an error.</div>
            : store.activities.length === 0 && (
              <div className="text-white 2xl mt-48">
                There are no activities.
              </div>
            )}
          <Activities />
        </div>
      </main>
    </>
  );
};

export default Activity;
