import React, { useState } from "react";
import Nav, { MenuOption } from "~/components/Nav";
import { useRouter } from "next/router";
import { SessionContextValue, signIn, signOut } from "next-auth/react";
import { GroupOutput } from "~/types";
import LeaveIcon from "~/components/icons/Leave";

const MenuOptions = (
  { session }: { session: SessionContextValue },
) => (
  <>
    {
      /* <MenuOption className="md:hidden">
      Search
    </MenuOption> */
    }

    <MenuOption className="md:hidden" href="/groups">
      Groups
    </MenuOption>

    <MenuOption href="/settings">Settings</MenuOption>

    {session.data &&
      <MenuOption href="/profile">Profile</MenuOption>}

    <MenuOption onClick={() => session.data ? signOut() : signIn()}>
      {session.data ? "Sign Out" : "Sign In"}
    </MenuOption>
  </>
);

type GroupPageNavProps = {
  session: SessionContextValue;
  group: GroupOutput | undefined;
  displayChat: boolean;
  toggleChat: () => void;
};

export default function GroupPageNav(
  { session, group, toggleChat, displayChat }: GroupPageNavProps,
) {
  const router = useRouter();

  return (
    <Nav
      className="flex items-center justify-center"
      session={session}
      menuChildren={<MenuOptions session={session} />}
    >
      {/* <NavLogo className={"hidden md:block"} /> */}
      <button
        className="inline-block"
        onClick={() => router.back()}
      >
        <LeaveIcon className="fill-white ml-2 mr-1" />
      </button>

      <div className="flex items-center justify-center">
        {group && (
          <>
            <span className="text-white text-xl md:text-2xl mr2 whitespace-nowrap">
              {group.title}
            </span>
          </>
        )}
      </div>
      <div className="w-full flex justify-end items-center">
        <button
          className="rounded-md min-w-20 w-20 font-semibold transition bg-black/20 hover:bg-black/5 border border-white hover:border-[#cc66ff] text-sm text-white hover:text-[#cc66ff] ml-2"
          onClick={toggleChat}
        >
          {displayChat ? "About" : "Chat"}
        </button>
      </div>
    </Nav>
  );
}