import React, { useState } from "react";
import PersonPlus from "../icons/PersonPlus";
import { useStore } from "~/utils/store";
import { SessionContextValue } from "next-auth/react";
import { api } from "~/utils/api";
import { group } from "console";
import groups from "~/utils/store/groups";
import { Group } from "~/types";

type UserMenuProps = {
  userId: string;
  isMember: boolean;
  session: SessionContextValue;
};

export default function UserMenu({ userId, isMember, session }: UserMenuProps) {
  const [showMenu, setShowMenu] = useState<"none" | "menu" | "invite">("none");
  const store = useStore((state) => ({
    groups: state.groups,
    setShowLoginMessageDialog: state.setShowLoginMessageDialog,
  }));

  const invite = api.memberships.inviteRequest.useMutation();

  const currentUserGroups = session.data && store.groups
    .filter(({ createdBy }) => createdBy === session.data.user.id);

  const showInviteButton = !isMember && currentUserGroups &&
    currentUserGroups?.length > 0;

  function sendInviteRequest(group: Group) {
    if (!session.data) {
      return store.setShowLoginMessageDialog(true);
    }

    invite.mutate({
      groupId: group.id,
      activitySlug: group.activitySlug,
      channelId: group.channelId,
      userId,
    });
    setShowMenu("none");
  }

  return (
    <div className="relative group">
      <button className="text-white group-hover:text-gray-400 focus:outline-none">
        <PersonPlus
          viewBox="0 0 24 24"
          className="w-[20px] h-[20px] fill-gray-400 mt-2 mr-1 hover:fill-primary"
          onClick={() =>
            setShowMenu((prev) => prev === "none" ? "menu" : "none")}
        />
      </button>

      {showMenu === "menu" && (
        <div className="absolute flex flex-col text-center rounded-md bg-[#2e026d] text-white border border-primary drop-shadow-2xl z-10">
          {
            /* <button className="p2 hover:bg-white/10 hover:bg-primary px-3 py-1">
            Follow
          </button> */
          }

          {showInviteButton &&
            (
              <button
                className="hover:bg-white/10 px-3 py-2 whitespace-nowrap"
                onClick={() => setShowMenu("invite")}
              >
                Invite
              </button>
            )}
          {
            /*
          <button className="hover:bg-white/10 px-3 py-2 whitespace-nowrap">
            Suggest to group
          </button>

          <button className="hover:bg-white/10 px-3 py-2 whitespace-nowrap">
            Create new group
          </button>

          <button className="hover:bg-white/10 px-3 py-2 whitespace-nowrap">
            Report user
          </button> */
          }
        </div>
      )}

      {showMenu === "invite" && (
        <div className="absolute flex flex-col text-center rounded-md bg-[#2e026d] text-white border border-primary drop-shadow-2xl z-10">
          <span className="text-primary px-3 py-2 whitespace-nowrap">
            Invite to group
          </span>

          <div className="overflow-y-auto max-h-48">
            {currentUserGroups && currentUserGroups.filter(({ membersIds }) =>
              !membersIds.includes(userId)
            ).map((group) => (
              <button
                className="hover:bg-white/10 px-2 py-2 whitespace-nowrap w-full"
                key={group.slug}
                onClick={() =>
                  sendInviteRequest(group)}
              >
                {group.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
