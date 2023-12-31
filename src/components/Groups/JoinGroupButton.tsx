import React, { useState } from "react";
import PersonArrow from "../icons/PersonArrow";
import { useStore } from "~/utils/store";
import { SessionContextValue } from "next-auth/react";
import { api } from "~/utils/api";
import { Group } from "~/types";

type JoinGroupButtonProps = {
  group: Group;
  session: SessionContextValue;
};

export default function JoinGroupButton(
  { group, session }: JoinGroupButtonProps,
) {
  const { setShowLoginDialog, setGroup } = useStore((state) => ({
    setShowLoginDialog: state.setShowLoginMessageDialog,
    setGroup: state.setGroup,
  }));
  const [showMenu, setShowMenu] = useState<"none" | "join">("none");

  const joinRequest = api.memberships.joinRequest.useMutation();
  const join = api.memberships.add.useMutation({
    onSuccess: () => {
      if (!session.data) {
        return;
      }

      if (group.private) {
        return;
      }

      setGroup({
        ...group,
        membersIds: [...group.membersIds, session.data?.user.id],
      });
    },
  });

  const isMember = session.data &&
    group.membersIds.includes(session.data?.user.id);

  if (isMember) {
    return null;
  }

  function onClick() {
    if (!session.data) {
      return setShowLoginDialog(true);
    }

    setShowMenu("none");

    if (group.private) {
      return joinRequest.mutate({
        groupId: group.id,
        activitySlug: group.activitySlug,
      });
    }

    return join.mutate({
      groupId: group.id,
    });
  }

  return (
    <div className="relative group">
      <button className="text-white group-hover:text-gray-400 focus:outline-none">
        <PersonArrow
          viewBox="0 0 24 24"
          className="w-[24px] h-[24px] fill-white/60  mt-2 -ml-3 hover:fill-primary"
          onClick={() =>
            setShowMenu((prev) => prev === "none" ? "join" : "none")}
        />
      </button>

      {showMenu === "join" && (
        <div className="absolute right-0 flex flex-col text-center rounded-md bg-[#2e026d] text-white border border-primary drop-shadow-2xl z-10">
          <button
            className="hover:bg-white/10 px-3 py-2 whitespace-nowrap"
            onClick={onClick}
          >
            {group.private && "Request to "}Join
          </button>
        </div>
      )}
    </div>
  );
}
