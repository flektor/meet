import React from "react";
import { useRouter } from "next/navigation";
import Nav, { MenuOption } from ".";
import LeaveIcon from "../icons/Leave";
import FavoriteButton from "~/components/FavoriteButton";
import RegisterButton from "~/components/RegisterButton";
import { SessionContextValue, signIn, signOut } from "next-auth/react";
import { getActivityOutput } from "~/types";

const MenuOptions = ({ session }: { session: SessionContextValue }) => (
  <>
    {
      /* <MenuOption className="md:hidden">
      Search
    </MenuOption> */
    }
    <MenuOption href="/activities">
      Activities
    </MenuOption>

    <MenuOption href="/favorites">
      Favorites
    </MenuOption>

    <MenuOption href="/groups">
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

type ActivityPageNavProps = {
  session: SessionContextValue;
  activity: getActivityOutput | undefined;
  displayChat: boolean;
  toggleChat: () => void;
};

export default function ActivityPageNav(
  { session, activity, toggleChat, displayChat }: ActivityPageNavProps,
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
        {activity && (
          <>
            <span className="text-white text-xl md:text-2xl mr2 whitespace-nowrap">
              {activity.title}
            </span>

            <FavoriteButton activityId={activity.id} />

            <RegisterButton
              activitySlug={activity.slug}
              activityId={activity.id}
            />
          </>
        )}
      </div>

      <div className="w-full flex justify-end items-center">
        <button
          className="rounded-md min-w-20 w-20 font-semibold transition bg-black/20 hover:bg-black/5 border border-white hover:border-[#cc66ff] text-sm text-white hover:text-[#cc66ff] ml-2"
          onClick={toggleChat}
        >
          {displayChat ? "Groups" : "Chat"}
        </button>
      </div>
    </Nav>
  );
}
