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
    {session.data &&
      (
        <MenuOption className="md:hidden" href="/favorites">
          Favorites
        </MenuOption>
      )}
    {
      /* <MenuOption href="/settings">Settings</MenuOption>

    {session.data &&
      <MenuOption href="/profile">Profile</MenuOption>} */
    }

    <MenuOption onClick={() => session.data ? signOut() : signIn()}>
      {session.data ? "Sign Out" : "Sign In"}
    </MenuOption>
  </>
);

export default function ActivitiesPageNav(
  { session }: { session: SessionContextValue },
) {
  const router = useRouter();
  return (
    <Nav
      className="flex"
      session={session}
      searchBar={false}
      menuChildren={<MenuOptions session={session} router={router} />}
    >
      <div className="flex items-center justify-center gap-3">
        <NavLogo />

        <Link
          href="/activities"
          className="text-white hover:underline hover:decoration-primary hover:text-primary"
        >
          Activities
        </Link>

        {session.data &&
          (
            <>
              <Link
                href="/favorites"
                className="hidden md:block text-white hover:underline hover:decoration-primary hover:text-primary"
              >
                Favorites
              </Link>

              <Link
                href="/groups"
                className="text-white hover:underline hover:decoration-primary hover:text-primary underline"
              >
                Groups
              </Link>
            </>
          )}
      </div>
    </Nav>
  );
}
