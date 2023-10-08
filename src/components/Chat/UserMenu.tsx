import React, { useState } from "react";
import PersonPlus from "../icons/PersonPlus";
import { useStore } from "~/utils/store";
import { SessionContextValue } from "next-auth/react";
import { api } from "~/utils/api";

export default function UserMenu(
  { userId, session }: { userId: string; session: SessionContextValue },
) {
  const [showMenu, setShowMenu] = useState<"none" | "menu" | "invite">("none");
  const store = useStore();

  const invite = api.memberships.inviteRequest.useMutation();

  return (
    <div className="relative group">
      <button className="text-white group-hover:text-gray-400 focus:outline-none">
        <PersonPlus
          viewBox="0 0 16 16"
          className="w-[24px] h-[24px] fill-white/60  mt-2 ml-2 hover:fill-primary"
          onClick={() =>
            setShowMenu((prev) => prev === "none" ? "menu" : "none")}
        />
      </button>

      <div className="absolute flex flex-col text-center rounded-md bg-[#2e026d] text-white border border-primary drop-shadow-2xl z-10">
        {showMenu === "menu" && (
          <>
            {
              /* <button className="p2 hover:bg-white/10 hover:bg-primary px-3 py-1">
            Follow
          </button> */
            }
            <button
              className="hover:bg-white/10 px-3 py-2 whitespace-nowrap"
              onClick={() => setShowMenu("invite")}
            >
              Invite to group
            </button>
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
          </>
        )}

        {showMenu === "invite" && (
          <>
            <span className="text-primary px-3 py-2 whitespace-nowrap">
              Invite to group
            </span>
            <div className="overflow-y-auto max-h-48">
              {session.data && store.groups
                .filter(({ createdBy }) => createdBy === session.data.user.id)
                .map((group) => (
                  <button
                    className="hover:bg-white/10 px-2 py-2 whitespace-nowrap w-full"
                    key={group.slug}
                    onClick={() => {
                      invite.mutate({
                        groupId: group.id,
                        activitySlug: group.activitySlug,
                        channelId: group.channelId,
                        userId,
                      });
                      setShowMenu("none");
                    }}
                  >
                    {group.title}
                  </button>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
