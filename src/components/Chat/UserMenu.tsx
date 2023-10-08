import React, { useState } from "react";
import PersonPlus from "../icons/PersonPlus";
import { useStore } from "~/utils/store";

export default function UserMenu() {
  const [showMenu, setShowMenu] = useState<"none" | "menu" | "invite">("none");
  const store = useStore();

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

      {showMenu === "menu" && (
        <div className="absolute left-0 flex flex-col text-center rounded-md bg-[#2e026d] text-white border border-primary drop-shadow-2xl z-10">
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
        </div>
      )}

      {showMenu === "invite" && (
        <div className="absolute left-0 flex flex-col text-center rounded-md bg-[#2e026d] text-white border border-primary drop-shadow-2xl z-10">
          <span className="text-primary px-3 py-2 whitespace-nowrap">
            Invite to group
          </span>
          {store.groups.filter((group) =>
            group.createdBy === store.session?.data?.user.id
          ).map((group) => (
            <button className="hover:bg-white/10 px-3 py-2 whitespace-nowrap">
              {group.title} {group.createdBy}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
