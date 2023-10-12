import { SessionContextValue, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Group } from "~/types";
import { useStore } from "~/utils/store";
import JoinGroupButton from "./JoinGroupButton";

export type GroupsProps = {
  activitySlug: string;
};

function getGroups(groups: Group[], activitySlug: string) {
  const privateGroups = [];
  const publicGroups = [];

  for (const group of groups) {
    if (group.activitySlug !== activitySlug) {
      continue;
    }

    if (group.private) {
      privateGroups.push(group);
      continue;
    }

    publicGroups.push(group);
  }
  return {
    privateGroups,
    publicGroups,
  };
}

function Group(
  { group, index, session }: {
    group: Group;
    index: number;
    session: SessionContextValue;
  },
) {
  const name = group.title.includes("-")
    ? group.title.split("-")[0]! + "#" + index
    : group.title;

  const isMember = session.data &&
    group.membersIds.includes(session.data.user.id);

  const isAuthor = session.data &&
    group.createdBy === session.data.user.id;

  return (
    <li
      key={group.slug}
      className="relative flex items center max-w-xs w-fit h-12 pb-1 rounded-xl bg-white/10 pl-2.5 pr-2.5 text-white"
    >
      <div className="flex items-center justify-between gap-4">
        {isMember && (
          <Link
            className={`text-2xl hover:underline ${
              isMember ? "text-primary" : "text-white"
            }`}
            href={`/activities/${group.activitySlug}/${group.slug}`}
          >
            {name}
          </Link>
        )}

        {!isMember && (
          <span className="text-2xl text-white">
            {name}
          </span>
        )}

        <span className="text-sm mt-1">
          {group.membersIds.length} / {group.maxParticipants}
        </span>

        {!isMember && !isAuthor &&
          (
            <JoinGroupButton
              group={group}
              session={session}
            />
          )}
      </div>
    </li>
  );
}

function GroupList(
  { groups, session }: { groups: Group[]; session: SessionContextValue },
) {
  return (
    <ul className="flex flex-wrap justify-center gap-2 mx-2">
      {groups.map(
        (group, index) => (
          <Group key={index} group={group} index={index} session={session} />
        ),
      )}
    </ul>
  );
}

const Groups = ({ activitySlug }: GroupsProps) => {
  const groups = useStore((state) => state.groups);
  const session = useSession();

  const { privateGroups, publicGroups } = getGroups(groups, activitySlug);

  // const [_groups, setGroups] = useState(getGroups(store.groups, activitySlug));
  // useEffect(() => {
  //   setGroups((store.groups, activitySlug));
  // }, [store.groups]);

  return (
    <section className="flex flex-col gap-6">
      {
        /* <div className="flex flex-col items-center pb-10">
        <h2 className="p-4 text-white text-2xl font-bold">Groups</h2>
        <hr className="w-40 h-px border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />
      </div> */
      }

      {privateGroups.length > 0 &&
        (
          <>
            <span className="w-full flex justify-center text-gray-400 text-xl">
              Private Groups
            </span>
            <GroupList session={session} groups={privateGroups} />
          </>
        )}

      {publicGroups.length > 0 && (
        <>
          <span className="w-full flex justify-center text-gray-400 text-xl mt-3">
            Public Groups
          </span>
          <GroupList session={session} groups={publicGroups} />
        </>
      )}
    </section>
  );
};

export default Groups;
