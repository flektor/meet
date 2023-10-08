import React, { ReactNode, useState } from "react";
// import SearchBar from "./SearchBar";
import MenuSvg from "../icons/Menu";
export { MenuOption } from "./MenuOption";
export { NavLogo } from "./NavLogo";
import { SessionContextValue, signIn } from "next-auth/react";

export type NavProps = {
  children?: ReactNode | null;
  session: SessionContextValue;
  menuChildren?: ReactNode;
  searchBar?: boolean;
  className?: string;
};

export default function Nav(
  {
    className = "",
    children = null,
    menuChildren,
    searchBar = true,
    session,
  }: NavProps,
) {
  const [showMenu, setShowMenu] = useState(false);

  function onSearchComplete() {
  }

  function onSearchCancel() {
  }

  return (
    <>
      <div className="absolute w-full h-14 left-0 top-0" />
      <nav className="fixed left-0 top-0 w-full flex items-center justify-center bg-[#2e026d] z-10 h-14 max-h-14">
        <div
          className={`w-full max-w-5xl mt-2 mb-2 ${className} flex justify-between`}
        >
          {children}
          {
            /*
          <div className="flex w-full items-center justify-center transition duration-1000 h-9">
            {searchBar && <SearchBar toggleSearchDialog />}
          </div> */
          }

          {
            !session.data &&
            (
              <div className="flex justify-end items-center gap-2">
                <button
                  onClick={() => signIn()}
                  className="text-white hover:text-white pt-1 mr-4 whitespace-nowrap"
                >
                  Sign In
                </button>
              </div>
            )
            // : (
            //   <ProfileSvg
            //     className="hidden md:block mt-[1px] hover:cursor-pointer hover:fill-[#cc66ff]"
            //     onClick={() => setShowMenu(!showMenu)}
            //   />
            // )
          }

          <div className="relative group">
            <button
              onBlur={() => setShowMenu(false)}
              className="text-white group-hover:text-gray-400 focus:outline-none"
            >
              <MenuSvg
                active={showMenu}
                className="pt-2 ml-2 mr-2 lg:mr-0"
                onClick={() => setShowMenu(!showMenu)}
              />
            </button>

            {showMenu && (
              <div onClick={() => setShowMenu(false)}>
                <div
                  className={`absolute right-0 flex flex-col w-28 text-center rounded-md bg-[#2e026d] text-white border border-[#cc66ff] drop-shadow-2xl`}
                >
                  {menuChildren}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {
        /* {store.showSearchDialog &&
        (
          <SearchDialog
            onSearch={onSearchComplete}
            onCancel={onSearchCancel}
          />
        )} */
      }
    </>
  );
}
