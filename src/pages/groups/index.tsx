import React, { useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Spinner from "~/components/Spinner";
import GroupsPageNav from "~/components/Nav/GroupsPageNav";
import Toasts from "~/components/Toasts";
import GroupsList from "~/components/Groups";
import { useStore } from "~/utils/store";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const Groups: NextPage = () => {
  const session = useSession();

  const store = useStore((state) => ({
    activities: state.activities,
    setActivities: state.setActivities,
    groups: state.groups,
    setGroups: state.setGroups,
  }));

  const groups = session.data
    ? store.groups.filter(({ membersIds }) =>
      membersIds.includes(session.data.user.id)
    )
    : [];

  const { data, error, isLoading } = api.groups.getUserGroups.useQuery();

  useEffect(() => {
    if (!data) return;

    store.setGroups(data);
  }, [data]);

  return (
    <>
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GroupsPageNav session={session} />
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Toasts />

        <div className="flex flex-col items-center justify-center">
          {isLoading
            ? (
              <div className="mt-48">
                <Spinner />
              </div>
            )
            : error
            ? <div className="text-white 2xl mt-48">There was an error.</div>
            : groups.length === 0 && (
              <div className="text-white 2xl mt-48">
                You are not a member of any group..
              </div>
            )}

          <GroupsList groups={groups} />
        </div>
      </main>
    </>
  );
};
export default Groups;
