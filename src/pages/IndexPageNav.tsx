import React from "react";
import Link from "next/link";
import Nav, { MenuOption, NavLogo } from "~/components/Nav";
import { NextRouter, useRouter } from "next/router";
import { SessionContextValue, signIn, signOut } from "next-auth/react";

const MenuOptions = (
  { session }: { router: NextRouter; session: SessionContextValue },
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

export default function HomePageNav(
  { session }: { session: SessionContextValue },
) {
  const router = useRouter();
  return (
    <Nav
      className="flex"
      session={session}
      menuChildren={<MenuOptions session={session} router={router} />}
    >
      <div className="flex items-center justify-center">
        <NavLogo />

        <Link
          href="/activities"
          className="text-white hover:underline hover:decoration-[#cc66ff] hover:text-[#cc66ff] pt-1 mr-4"
        >
          Activities
        </Link>

        {session.data &&
          (
            <>
              <Link
                href="/favorites"
                className="text-white hover:underline hover:decoration-[#cc66ff] hover:text-[#cc66ff] pt-1 mr-4"
              >
                Favorites
              </Link>

              <Link
                href="/activities"
                className="hidden md:block text-white hover:underline hover:decoration-[#cc66ff] hover:text-[#cc66ff] pt-1 mr-4"
              >
                Groups
              </Link>
            </>
          )}
      </div>
    </Nav>
  );
}
